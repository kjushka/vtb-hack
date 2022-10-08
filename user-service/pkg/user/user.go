package user

import (
	"time"
	"user-service/internal/product_service"
)

type User struct {
	ID          int64                     `json:"id"`
	FirstName   string                    `json:"firstName"`
	LastName    string                    `json:"lastName"`
	Email       string                    `json:"email"`
	PhoneNumber string                    `json:"phoneNumber"`
	Description string                    `json:"description"`
	Avatar      string                    `json:"avatar"`
	Birthday    time.Time                 `json:"birthday"`
	Department  string                    `json:"department"`
	Products    []product_service.Product `json:"products,omitempty"`
}
