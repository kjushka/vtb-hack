package http_service

import (
	"database/sql"
	"net/http"
	"user-service/internal/config"

	"github.com/go-chi/chi/v5"
)

func InitRouter(db *sql.DB, cfg *config.Config) http.Handler {
	s := NewService(db, cfg)

	r := chi.NewRouter()
	initMiddlewares(r, s)
	initRoutes(r, s)

	return r
}
