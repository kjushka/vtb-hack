package product_service

import "time"

type Purchase struct {
	Product *Product
	BuyDate time.Time
	Count   int64
}
