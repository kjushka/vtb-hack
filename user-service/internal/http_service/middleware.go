package http_service

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func initMiddlewares(r chi.Router, s Service) {
	r.Use(
		middleware.Logger,
		s.CheckAuth,
	)
}
