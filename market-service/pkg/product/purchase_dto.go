package product

import (
	"market-service/internal/user_service"
	"time"
)

type DTOPurchase struct {
	DTOProduct
	BuyDate time.Time `json:"buyDate"`
	Amount  int64     `json:"amount"`
	OwnerID int64     `json:"ownerID"`
}

func DTOToPurchase(dtos []DTOPurchase) []Purchase {
	purchases := make([]Purchase, 0, len(dtos))
	for _, dto := range dtos {
		p := Product{
			ID:          dto.ID,
			Title:       dto.Title,
			Description: dto.Description,
			Price:       dto.Price,
			Count:       dto.Count,
			Preview:     dto.Preview,
			IsNFT:       dto.IsNFT,
			Seller:      &user_service.User{},
			Comments:    nil,
		}
		pur := Purchase{
			Product: p,
			BuyDate: dto.BuyDate,
			Amount:  dto.Amount,
			OwnerID: dto.OwnerID,
		}
		purchases = append(purchases, pur)
	}
	return purchases
}
