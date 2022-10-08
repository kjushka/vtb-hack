package market_service

type Product struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Count       int64   `json:"count"`
	IsNFT       bool    `json:"isNFT"`
	Preview     string  `json:"preview"`
}
