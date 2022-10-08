package http_service

import (
	"database/sql"
	"encoding/json"
	"market-service/internal/product_repository"
	"market-service/internal/user_service"
	"net/http"
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

func NewService(db *sql.DB, userServiceAPIURL string) Service {
	userService := user_service.NewUserService(userServiceAPIURL)
	productRepository := product_repository.NewProductRepository(db)
	return &httpService{
		productRepository: productRepository,
		userService:       userService,
	}
}

type httpService struct {
	productRepository product_repository.ProductRepository
	userService       user_service.UserService
}

func (s *httpService) CheckAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
	})
}

func (s *httpService) CreateProduct(w http.ResponseWriter, r *http.Request) {

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
