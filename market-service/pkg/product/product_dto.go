package product

import "market-service/internal/user_service"

type DTOProduct struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Count       int64   `json:"count"`
	IsNFT       bool    `json:"isNFT"`
	Preview     string  `json:"preview"`
	OwnerID     int64   `json:"ownerId"`
}

func DTOToProducts(dtos []DTOProduct) []Product {
	products := make([]Product, 0, len(dtos))
	for _, dto := range dtos {
		p := Product{
			ID:          dto.ID,
			Title:       dto.Title,
			Description: dto.Description,
			Price:       dto.Price,
			Count:       dto.Count,
			Preview:     dto.Preview,
			IsNFT:       dto.IsNFT,
			Owner:       &user_service.User{},
			Comments:    nil,
		}
		products = append(products, p)
	}
	return products
}
