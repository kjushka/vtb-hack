package http_service

import (
	"article-service/internal/config"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
)

func InitRouter(db *sqlx.DB, cfg *config.Config) http.Handler {
	s := NewService(db, cfg)

	r := chi.NewRouter()
	initMiddlewares(r, s)
	initRoutes(r, s)

	return r
}
