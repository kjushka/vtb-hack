package product

import (
	"market-service/internal/user_service"
	"time"
)

type Product struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Count       int64   `json:"count"`
	Preview     string  `json:"preview"`
	IsNFT       bool    `json:"isNFT"`
	//Images      []string           `json:"images,omitempty"`
	Owner    *user_service.User `json:"owner"`
	Comments []Comment          `json:"comments,omitempty"`
}

type Comment struct {
	ID     int64              `json:"id"`
	Text   string             `json:"text"`
	Author *user_service.User `json:"author"`
	Date   time.Time          `json:"date"`
}
