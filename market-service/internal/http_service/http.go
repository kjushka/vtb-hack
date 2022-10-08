package http_service

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func InitRouter(db *sql.DB, userServiceAPIURL string) http.Handler {
	s := NewService(db, userServiceAPIURL)

	r := chi.NewRouter()
	initMiddlewares(r, s)
	initRoutes(r, s)

	return r
}
