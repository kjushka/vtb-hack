package http_service

import "github.com/go-chi/chi/v5"

func initRoutes(r chi.Router, s Service) {
	r.Route("/user_service", func(r chi.Router) {
		r.Post("/users", s.CreateUser)
		r.Get("/users", s.GetUsers)
		r.Get("/users/{id}", s.GetUser)
		r.Put("/users/{id}", s.EditUser)
		r.Delete("/users/{id}", s.DeleteUser)

		r.Post("/thanks", s.Thanks)
	})
}
