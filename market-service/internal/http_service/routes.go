package http_service

import "github.com/go-chi/chi/v5"

func initRoutes(r chi.Router, s Service) {
	r.Route("/market", func(r chi.Router) {
		r.Post("/products", s.CreateArticle)
		r.Get("/products", s.GetArticles)
		r.Get("/products/{id}", s.GetArticle)
		r.Put("/products/{id}", s.EditArticle)
		r.Delete("/products/{id}", s.DeleteArticle)
		r.Get("/products/users/{id}", s.AddComment)
		r.Get("/purchases/users/{id}", s.GetUserPurchases)
		r.Post("/buy/{id}", s.Thanks)
		r.Post("/products/{id}/feedback", s.AddFeedback)
	})
}
