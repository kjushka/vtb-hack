package market_service

import "time"

type Purchase struct {
	Product
	BuyDate time.Time
	Count   int64
}
