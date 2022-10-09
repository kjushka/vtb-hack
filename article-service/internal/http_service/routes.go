package http_service

import "github.com/go-chi/chi/v5"

func initRoutes(r chi.Router, s Service) {
	r.Route("/article_service", func(r chi.Router) {
		r.Post("/articles", s.CreateArticle)
		r.Get("/articles", s.GetArticle)
		r.Get("/articles/{id}", s.GetArticles)
		r.Put("/articles/{id}", s.EditArticle)
		r.Delete("/articles/{id}", s.DeleteArticle)
		r.Post("/thanks", s.Thanks)
		r.Post("articles/{id}/comment", s.AddComment)
	})
}
