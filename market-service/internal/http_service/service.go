package http_service

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"market-service/internal/config"
	"market-service/internal/product_repository"
	"market-service/internal/user_service"
	"market-service/pkg/product"
	"net/http"
	"os"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/pkg/errors"
)

type Service interface {
	// middlewares
	CheckAuth(next http.Handler) http.Handler

	// routes
	CreateProduct(w http.ResponseWriter, r *http.Request)
	GetProduct(w http.ResponseWriter, r *http.Request)
	GetProducts(w http.ResponseWriter, r *http.Request)
	EditProduct(w http.ResponseWriter, r *http.Request)
	DeleteProduct(w http.ResponseWriter, r *http.Request)
	BuyProduct(w http.ResponseWriter, r *http.Request)
}

func NewService(db *sql.DB, cfg *config.Config) Service {
	userService := user_service.NewUserService(cfg.UserServiceURL)
	productRepository := product_repository.NewProductRepository(db)
	return &httpService{
		productRepository: productRepository,
		userService:       userService,
		saveImagesURL:     cfg.SaveImagesURL,
	}
}

type httpService struct {
	productRepository product_repository.ProductRepository
	userService       user_service.UserService
	saveImagesURL     string
}

func (s *httpService) CheckAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
	})
}

func (s *httpService) CreateProduct(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	err := r.ParseMultipartForm(32 << 10)
	if err != nil {
		http.Error(w, "invalid form data", http.StatusBadRequest)
		return
	}

	var prod product.Product
	strID := r.PostFormValue("id")
	prod.ID, err = strconv.ParseInt(strID, 10, 64)
	if err != nil {
		http.Error(w, "invalid id param", http.StatusBadRequest)
		return
	}
	titleStr := r.PostFormValue("title")
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

	file, fileHeader, err := r.FormFile("preview")
	if err != nil {
		http.Error(w, errors.Wrap(err, "invoke FormFile error:").Error(), http.StatusInternalServerError)
		return
	}

	err = os.Mkdir(fmt.Sprintf("%s/%v", s.saveImagesURL, prod.ID), os.ModeDir)
	if err != nil && !errors.Is(err, os.ErrExist) {
		http.Error(w, errors.Wrap(err, "failed to create dir for user image").Error(), http.StatusInternalServerError)
		return
	}

	localFileName := fmt.Sprintf("%s/%v/%s", s.saveImagesURL, prod.ID, fileHeader.Filename)
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

	ownerIdStr := r.PostFormValue("owner")
	prod.Owner.ID, err = strconv.ParseInt(ownerIdStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid owner id param", http.StatusBadRequest)
		return
	}

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

func (s *httpService) GetProduct(w http.ResponseWriter, r *http.Request) {
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

	product, err := s.productRepository.GetProduct(ctx, productID)
	if err != nil {
		err = errors.Wrap(err, "error in getting product")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := json.Marshal(product)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(resp)
}

func (s *httpService) GetProducts(w http.ResponseWriter, r *http.Request) {

}

func (s *httpService) EditProduct(w http.ResponseWriter, r *http.Request) {

}

func (s *httpService) DeleteProduct(w http.ResponseWriter, r *http.Request) {

}

func (s *httpService) BuyProduct(w http.ResponseWriter, r *http.Request) {

}
