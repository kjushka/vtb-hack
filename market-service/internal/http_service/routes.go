package http_service

import "github.com/go-chi/chi/v5"

func initRoutes(r chi.Router, s Service) {
	r.Route("/api/market", func(r chi.Router) {
		r.Post("/products", s.CreateProduct)
		r.Get("/products", s.GetProducts)
		r.Get("/products/{id}", s.GetProduct)
		r.Put("/products/{id}", s.EditProduct)
		r.Delete("/products/{id}", s.DeleteProduct)
		r.Post("/buy/{id}", s.BuyProduct)
	})
}