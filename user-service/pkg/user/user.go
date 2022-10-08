package user

import (
	"time"
	"user-service/internal/product_service"
)

type User struct {
	ID          int64     `json:"id" db:"id"`
	FirstName   string    `json:"firstName" db:"first_name"`
	LastName    string    `json:"lastName" db:"last_name"`
	Email       string    `json:"email" db:"email"`
	PhoneNumber string    `json:"phoneNumber" db:"phone_number"`
	Description string    `json:"description" db:"description"`
	Avatar      string    `json:"avatar" db:"avatar"`
	Birthday    time.Time `json:"birthday" db:"birthday"`
	Department  string    `json:"department" db:"department"`

	Balance   float64                    `json:"balance,omitempty"`
	Products  []product_service.Product  `json:"products,omitempty"`
	Purchases []product_service.Purchase `json:"purchases,omitempty"`
}
