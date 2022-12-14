package http_service

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"
	"time"
	"user-service/internal/config"
	"user-service/internal/market_service"
	"user-service/internal/money_service"
	"user-service/internal/user_repository"
	"user-service/pkg/user"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

type Service interface {
	// middlewares
	CheckAuth(next http.Handler) http.Handler

	// routes
	CreateUser(w http.ResponseWriter, r *http.Request)
	GetUser(w http.ResponseWriter, r *http.Request)
	GetUsers(w http.ResponseWriter, r *http.Request)
	EditUser(w http.ResponseWriter, r *http.Request)
	DeleteUser(w http.ResponseWriter, r *http.Request)

	Thanks(w http.ResponseWriter, r *http.Request)
}

func NewService(db *sqlx.DB, cfg *config.Config) Service {
	return &httpService{
		userRepository: user_repository.NewUserRepository(db),
		moneyService:   money_service.NewMoneyService(cfg.MoneyServiceAPIURL),
		marketService:  market_service.NewMarketService(cfg.MarketServiceAPIURL),
		saveImagesURL:  cfg.SaveImagesURL,
		authKey:        cfg.AuthKey,
	}
}

type httpService struct {
	userRepository user_repository.UserRepository
	moneyService   money_service.MoneyService
	marketService  market_service.MarketService
	saveImagesURL  string
	authKey        string
}

func (s *httpService) CheckAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		jwtCookie, err := r.Cookie("auth_jwt")
		if err != nil {
			http.Error(w, errors.Wrap(err, "error in getting cookie").Error(), http.StatusMethodNotAllowed)
			return
		}

		var keyfunc jwt.Keyfunc = func(token *jwt.Token) (interface{}, error) {
			return []byte(s.authKey), nil
		}

		parsed, err := jwt.Parse(jwtCookie.Value, keyfunc)
		if err != nil {
			http.Error(w, errors.Wrap(err, "failed to parse JWT").Error(), http.StatusMethodNotAllowed)
			return
		}

		if !parsed.Valid {
			http.Error(w, errors.Wrap(err, "failed to parse JWT").Error(), http.StatusForbidden)
		}
		next.ServeHTTP(w, r)
	})
}

func (s *httpService) CreateUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	err := r.ParseMultipartForm(32 << 10)
	if err != nil {
		http.Error(w, "invalid form data", http.StatusBadRequest)
		return
	}

	var u user.User
	strID := r.PostFormValue("id")
	u.ID, err = strconv.ParseInt(strID, 10, 64)
	if err != nil {
		http.Error(w, "invalid id param", http.StatusBadRequest)
		return
	}
	birthdayStr := r.PostFormValue("birthday")
	if birthdayStr == "" {
		http.Error(w, "invalid birthday param", http.StatusBadRequest)
		return
	}
	u.Birthday, err = time.Parse("2006-01-02", birthdayStr)
	if err != nil {
		http.Error(w, "invalid birthday param", http.StatusBadRequest)
		return
	}
	u.FirstName = r.PostFormValue("firstName")
	if u.FirstName == "" {
		http.Error(w, "invalid first name param", http.StatusBadRequest)
		return
	}
	u.LastName = r.PostFormValue("lastName")
	if u.LastName == "" {
		http.Error(w, "invalid last name param", http.StatusBadRequest)
		return
	}
	u.Email = r.PostFormValue("email")
	if u.Email == "" {
		http.Error(w, "invalid email param", http.StatusBadRequest)
		return
	}
	//u.PhoneNumber = r.PostFormValue("phoneNumber")
	//if u.PhoneNumber == "" {
	//	http.Error(w, "invalid phone number param", http.StatusBadRequest)
	//	return
	//}
	u.Department = r.PostFormValue("department")
	if u.Department == "" {
		http.Error(w, "invalid department param", http.StatusBadRequest)
		return
	}
	u.Description = r.PostFormValue("description")

	file, fileHeader, err := r.FormFile("avatar")
	if err != nil {
		http.Error(w, errors.Wrap(err, "invoke FormFile error:").Error(), http.StatusInternalServerError)
		return
	}

	err = os.MkdirAll(path.Join(s.saveImagesURL, strconv.FormatInt(u.ID, 10)), os.ModeDir)
	if err != nil && !errors.Is(err, os.ErrExist) {
		http.Error(w, errors.Wrap(err, "failed to create dir for user image").Error(), http.StatusInternalServerError)
		return
	}

	localFileName := path.Join(s.saveImagesURL, strconv.FormatInt(u.ID, 10), fileHeader.Filename)
	out, err := os.OpenFile(localFileName, os.O_APPEND|os.O_CREATE|os.O_RDWR, 0666)
	if err != nil {
		file.Close()
		http.Error(w, errors.Wrap(err, fmt.Sprintf("failed to open the file %s for writing", localFileName)).Error(), http.StatusInternalServerError)
		return
	}
	_, err = io.Copy(out, file)
	if err != nil {
		out.Close()
		file.Close()
		http.Error(w, errors.Wrap(err, "copy file err").Error(), http.StatusInternalServerError)
		return
	}

	out.Close()
	file.Close()

	u.Avatar = localFileName

	err = s.userRepository.SaveUser(ctx, &u)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in save user data").Error(), http.StatusInternalServerError)
		return
	}

	balance, err := s.moneyService.CreateWallet(u.ID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting user balance").Error(), http.StatusInternalServerError)
		return
	}
	u.Balance = balance.Balance

	respData, err := json.Marshal(&u)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(respData)
}

func (s *httpService) GetUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	userIDStr := chi.URLParam(r, "id")
	if userIDStr == "" {
		http.Error(w, "empty user id", http.StatusBadRequest)
		return
	}
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		http.Error(w, errors.Wrap(err, "invalid user id").Error(), http.StatusBadRequest)
		return
	}

	u, err := s.userRepository.GetUser(ctx, userID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting user").Error(), http.StatusInternalServerError)
		return
	}
	if u == nil {
		http.Error(w, errors.New("user not found").Error(), http.StatusNotFound)
		return
	}

	balance, err := s.moneyService.GetUserBalance(userID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting user balance").Error(), http.StatusInternalServerError)
		return
	}
	u.Balance = balance.Balance

	u.Products, err = s.marketService.GetUserProducts(userID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting user products").Error(), http.StatusInternalServerError)
		return
	}

	u.Purchases, err = s.marketService.GetUserPurchases(userID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting user purchases").Error(), http.StatusInternalServerError)
		return
	}

	result, err := json.Marshal(u)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(result)
}

func (s *httpService) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var (
		users  []user.User
		outErr error
	)
	userIDsStr := r.URL.Query().Get("ids")
	if userIDsStr != "" {
		var userIDs []int64
		for _, userIDStr := range strings.Split(userIDsStr, ",") {
			userID, err := strconv.ParseInt(userIDStr, 10, 64)
			if err != nil {
				http.Error(w, errors.Wrap(err, "invalid user id").Error(), http.StatusBadRequest)
				return
			}
			userIDs = append(userIDs, userID)
		}
		if len(userIDs) == 0 {
			http.Error(w, "empty user ids", http.StatusBadRequest)
			return
		}

		users, outErr = s.userRepository.GetUsersByIDs(ctx, userIDs)
	} else {
		users, outErr = s.userRepository.GetAllUsers(ctx)
	}

	if outErr != nil {
		http.Error(w, errors.Wrap(outErr, "error in getting user").Error(), http.StatusInternalServerError)
		return
	}

	if len(users) == 0 {
		http.Error(w, "no users found", http.StatusNotFound)
		return
	}

	result, err := json.Marshal(users)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(result)
}

func (s *httpService) EditUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	userIDStr := chi.URLParam(r, "id")
	if userIDStr == "" {
		http.Error(w, "empty u id", http.StatusBadRequest)
		return
	}
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		http.Error(w, errors.Wrap(err, "invalid u id").Error(), http.StatusBadRequest)
		return
	}

	u := &user.User{}
	buf, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}
	err = json.Unmarshal(buf, &u)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	u, err = s.userRepository.UpdateUser(ctx, userID, u)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in updating u").Error(), http.StatusInternalServerError)
		return
	}

	respData, err := json.Marshal(&u)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(respData)
}

func (s *httpService) DeleteUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	userIDStr := chi.URLParam(r, "id")
	if userIDStr == "" {
		http.Error(w, "empty user id", http.StatusBadRequest)
		return
	}
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		http.Error(w, errors.Wrap(err, "invalid user id").Error(), http.StatusBadRequest)
		return
	}

	err = s.userRepository.DeleteUser(ctx, userID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in deleting user").Error(), http.StatusInternalServerError)
		return
	}

	go func() {
		err = os.RemoveAll(s.saveImagesURL + userIDStr)
		if err != nil {
			log.Println(errors.Wrap(err, "error in deleting user picture"))
		}
	}()

	go func() {
		err = s.moneyService.DeleteWallet(userID)
		if err != nil {
			log.Println(errors.Wrap(err, "error in deleting user wallet"))
		}
	}()

	go func() {
		err = s.marketService.DeleteUserMarketData(userID)
		if err != nil {
			log.Println(errors.Wrap(err, "error in deleting user data in market"))
		}
	}()

	w.WriteHeader(http.StatusOK)
}

func (s *httpService) Thanks(w http.ResponseWriter, r *http.Request) {
	thanksRequest := struct {
		From   int64   `json:"from"`
		To     int64   `json:"to"`
		Amount float64 `json:"amount"`
	}{}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in read body").Error(), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	err = json.Unmarshal(body, &thanksRequest)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	balance, err := s.moneyService.GetUserBalance(thanksRequest.From)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting sender user balance").Error(), http.StatusInternalServerError)
		return
	}

	if thanksRequest.Amount > balance.Balance {
		http.Error(w, errors.New("current seller balance less than thanks").Error(), http.StatusBadRequest)
		return
	}

	err = s.moneyService.Thanks(thanksRequest.From, thanksRequest.To, thanksRequest.Amount)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in send thanks").Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
