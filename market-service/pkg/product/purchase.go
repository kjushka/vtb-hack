package product

import "time"

type Purchase struct {
	Product
	BuyDate time.Time `json:"buyDate"`
	Amount  int64     `json:"amount"`
	OwnerID int64     `json:"ownerID"`
}
