package http_service

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"io"
	"market-service/internal/config"
	"market-service/internal/money_service"
	"market-service/internal/product_repository"
	"market-service/internal/user_service"
	"market-service/pkg/product"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

type Service interface {
	// middlewares
	CheckAuth(next http.Handler) http.Handler

	// routes
	CreateArticle(w http.ResponseWriter, r *http.Request)
	GetArticle(w http.ResponseWriter, r *http.Request)
	GetArticles(w http.ResponseWriter, r *http.Request)
	EditArticle(w http.ResponseWriter, r *http.Request)
	DeleteArticle(w http.ResponseWriter, r *http.Request)

	Thanks(w http.ResponseWriter, r *http.Request)
	AddFeedback(w http.ResponseWriter, r *http.Request)
	AddComment(w http.ResponseWriter, r *http.Request)
	GetUserPurchases(w http.ResponseWriter, r *http.Request)
}

func NewService(db *sqlx.DB, cfg *config.Config) Service {
	userService := user_service.NewUserService(cfg.UserServiceAPIURL)
	productRepository := product_repository.NewProductRepository(db)
	moneyService := money_service.NewMoneyService(cfg.MoneyServiceAPIURL)
	return &httpService{
		productRepository: productRepository,
		moneyService:      moneyService,
		userService:       userService,
		saveImagesURL:     cfg.SaveImagesURL,
		authKey:           cfg.AuthKey,
	}
}

type httpService struct {
	productRepository product_repository.ProductRepository
	moneyService      money_service.MoneyService
	userService       user_service.UserService
	saveImagesURL     string
	authKey           string
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

func (s *httpService) CreateArticle(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	err := r.ParseMultipartForm(32 << 10)
	if err != nil {
		http.Error(w, "invalid form data", http.StatusBadRequest)
		return
	}

	var prod product.Product

	titleStr := r.PostFormValue("title")
	prod.Title = titleStr
	if titleStr == "" {
		http.Error(w, "invalid title param", http.StatusBadRequest)
		return
	}
	prod.Description = r.PostFormValue("description")
	if err != nil {
		http.Error(w, "invalid description param", http.StatusBadRequest)
		return
	}
	prod.Price, err = strconv.ParseFloat(r.PostFormValue("price"), 64)
	if err != nil {
		http.Error(w, "invalid price param", http.StatusBadRequest)
		return
	}
	coutStr := r.PostFormValue("count")
	prod.Count, err = strconv.ParseInt(coutStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid count param", http.StatusBadRequest)
		return
	}

	ownerIdStr := r.PostFormValue("owner")
	prod.Seller.ID, err = strconv.ParseInt(ownerIdStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid owner id param", http.StatusBadRequest)
		return
	}

	isNFTStr := r.PostFormValue("isNFT")
	prod.IsNFT, err = strconv.ParseBool(isNFTStr)
	if err != nil {
		http.Error(w, "invalid isNFT param", http.StatusBadRequest)
		return
	}

	file, fileHeader, err := r.FormFile("preview")
	if err != nil {
		http.Error(w, errors.Wrap(err, "invoke FormFile error:").Error(), http.StatusInternalServerError)
		return
	}

	err = os.MkdirAll(path.Join(s.saveImagesURL, strconv.FormatInt(prod.ID, 10)), os.ModeDir)
	if err != nil && !errors.Is(err, os.ErrExist) {
		http.Error(w, errors.Wrap(err, "failed to create dir for user image").Error(), http.StatusInternalServerError)
		return
	}

	localFileName := path.Join(s.saveImagesURL, strconv.FormatInt(prod.ID, 10), fileHeader.Filename)
	out, err := os.OpenFile(localFileName, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
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

	prod.Preview = localFileName
	prod.Seller = &user_service.User{}

	err = s.productRepository.SaveProduct(ctx, &prod)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in save product data").Error(), http.StatusInternalServerError)
		return
	}

	respData, err := json.Marshal(&prod)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(respData)

}

func (s *httpService) GetArticle(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var err error

	productIDStr := chi.URLParam(r, "id")
	if productIDStr == "" {
		err = errors.New("no product id was found")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	productID, err := strconv.ParseInt(productIDStr, 10, 64)
	if err != nil {
		err = errors.New("product id wasn't provided as integer")
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	p, err := s.productRepository.GetProduct(ctx, productID)
	if err != nil {
		err = errors.Wrap(err, "error in getting product")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if p == nil {
		http.Error(w, errors.New("product not found").Error(), http.StatusNotFound)
		return
	}

	seller, err := s.userService.GetUserByID(p.Seller.ID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting seller data").Error(), http.StatusInternalServerError)
		return
	}
	p.Seller = seller

	resp, err := json.Marshal(p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(resp)
}

func (s *httpService) GetArticles(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var (
		products []product.Product
		outErr   error
	)
	productIDsStr := r.URL.Query().Get("ids")
	if productIDsStr != "" {
		var productIDs []int64
		for _, productIdStr := range strings.Split(productIDsStr, ",") {
			productId, err := strconv.ParseInt(productIdStr, 10, 64)
			if err != nil {
				http.Error(w, errors.Wrap(err, "invalid product id").Error(), http.StatusBadRequest)
				return
			}
			productIDs = append(productIDs, productId)
		}
		if len(productIDs) == 0 {
			http.Error(w, "empty user ids", http.StatusBadRequest)
			return
		}

		products, outErr = s.productRepository.GetProductsByIDs(ctx, productIDs)
	} else {
		products, outErr = s.productRepository.GetAllProducts(ctx)
	}

	if outErr != nil {
		http.Error(w, errors.Wrap(outErr, "error in getting product").Error(), http.StatusInternalServerError)
		return
	}

	if len(products) == 0 {
		http.Error(w, "no products found", http.StatusNotFound)
		return
	}

	usersIDs := make([]int64, 0)
	for _, p := range products {
		usersIDs = append(usersIDs, p.Seller.ID)
		for _, comm := range p.Comments {
			usersIDs = append(usersIDs, comm.Author.ID)
		}
	}
	users, err := s.userService.GetUsersByIDs(usersIDs)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting users for products").Error(), http.StatusInternalServerError)
		return
	}

	usersMap := make(map[int64]*user_service.User)
	for _, user := range users {
		if _, ok := usersMap[user.ID]; !ok {
			usersMap[user.ID] = user
		}
	}
	for _, p := range products {
		p.Seller = usersMap[p.Seller.ID]
		for _, comm := range p.Comments {
			comm.Author = usersMap[comm.Author.ID]
		}
	}

	result, err := json.Marshal(products)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(result)
}

func (s *httpService) EditArticle(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	productIDStr := chi.URLParam(r, "id")
	if productIDStr == "" {
		http.Error(w, "empty product id", http.StatusBadRequest)
		return
	}
	productId, err := strconv.ParseInt(productIDStr, 10, 64)
	if err != nil {
		http.Error(w, errors.Wrap(err, "invalid product id").Error(), http.StatusBadRequest)
		return
	}

	pr := &product.Product{}
	buf, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}
	err = json.Unmarshal(buf, &pr)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	pr, err = s.productRepository.UpdateProduct(ctx, productId, pr)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in updating u").Error(), http.StatusInternalServerError)
		return
	}

	respData, err := json.Marshal(&pr)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(respData)
}

func (s *httpService) DeleteArticle(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	productIDStr := chi.URLParam(r, "id")
	if productIDStr == "" {
		http.Error(w, "empty product id", http.StatusBadRequest)
		return
	}
	productID, err := strconv.ParseInt(productIDStr, 10, 64)
	if err != nil {
		http.Error(w, errors.Wrap(err, "invalid product id").Error(), http.StatusBadRequest)
		return
	}

	err = s.productRepository.DeleteProduct(ctx, productID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in deleting product").Error(), http.StatusInternalServerError)
		return
	}
}

func (s *httpService) Thanks(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	buyRequest := struct {
		ProductID  int64 `json:"productID"`
		CustomerID int64 `json:"userID"`
		Amount     int64 `json:"amount"`
	}{}
	buf, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}
	err = json.Unmarshal(buf, &buyRequest)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	p, err := s.productRepository.GetProduct(ctx, buyRequest.ProductID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting product").Error(), http.StatusInternalServerError)
		return
	}

	customerBalance, err := s.moneyService.GetUserBalance(buyRequest.CustomerID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting customerID").Error(), http.StatusInternalServerError)
		return
	}

	total := p.Price * float64(buyRequest.Amount)
	if customerBalance.Balance < total {
		http.Error(w, errors.New("not enough money to make purchase").Error(), http.StatusBadRequest)
		return
	}

	err = s.moneyService.MakePurchase(buyRequest.CustomerID, p.Seller.ID, total)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in make transaction").Error(), http.StatusInternalServerError)
		return
	}

	err = s.productRepository.MakePurchase(ctx, p, buyRequest.CustomerID, buyRequest.Amount)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in create purchase").Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (s *httpService) AddComment(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var err error

	userIDStr := chi.URLParam(r, "id")
	if userIDStr == "" {
		err = errors.New("no user id was found")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		err = errors.New("user id wasn't provided as integer")
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	products, err := s.productRepository.GetUserProducts(ctx, userID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting products").Error(), http.StatusInternalServerError)
		return
	}

	result, err := json.Marshal(products)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(result)
}

func (s *httpService) GetUserPurchases(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var err error

	userIDStr := chi.URLParam(r, "id")
	if userIDStr == "" {
		err = errors.New("no user id was found")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		err = errors.New("user id wasn't provided as integer")
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	purchases, err := s.productRepository.GetUserPurchases(ctx, userID)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in getting purchases").Error(), http.StatusInternalServerError)
		return
	}

	result, err := json.Marshal(purchases)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(result)
}

func (s *httpService) AddFeedback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	productIDStr := chi.URLParam(r, "id")
	if productIDStr == "" {
		http.Error(w, errors.New("empty product id url param").Error(), http.StatusBadRequest)
		return
	}
	productID, err := strconv.ParseInt(productIDStr, 10, 64)
	if err != nil {
		http.Error(w, errors.Wrap(err, "invalid product id url param").Error(), http.StatusBadRequest)
		return
	}

	buf, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}

	var comment product.Comment
	err = json.Unmarshal(buf, &comment)
	if err != nil {
		http.Error(w, errors.Wrap(err, "internal error").Error(), http.StatusInternalServerError)
		return
	}
	comment.ProductID = productID

	err = s.productRepository.AddComment(ctx, comment)
	if err != nil {
		http.Error(w, errors.Wrap(err, "error in adding product comment").Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
