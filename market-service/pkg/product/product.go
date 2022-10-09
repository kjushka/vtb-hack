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
	Seller   *user_service.User `json:"seller"`
	Comments []Comment          `json:"comments,omitempty"`
}

type Comment struct {
	ID          int64              `json:"id"`
	CommentText string             `json:"commentText"`
	Author      *user_service.User `json:"author"`
	WriteDate   time.Time          `json:"writeDate"`
	ProductID   int64              `json:"productID"`
}
