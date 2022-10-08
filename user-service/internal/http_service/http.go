package http_service

import (
	"github.com/jmoiron/sqlx"
	"net/http"
	"user-service/internal/config"

	"github.com/go-chi/chi/v5"
)

func InitRouter(db *sqlx.DB, cfg *config.Config) http.Handler {
	s := NewService(db, cfg)

	r := chi.NewRouter()
	initMiddlewares(r, s)
	initRoutes(r, s)

	return r
}
