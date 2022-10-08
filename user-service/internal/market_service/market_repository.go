package market_service

import (
	"encoding/json"
	"fmt"
	"github.com/pkg/errors"
	"io"
	"net/http"
)

type MarketService interface {
	GetUserProducts(userID int64) ([]Product, error)
	GetUserPurchases(userID int64) ([]Purchase, error)
	DeleteUserMarketData(userID int64) error
}

type marketService struct {
	marketServiceAPIURL string
}

func NewMarketService(marketServiceAPIURL string) MarketService {
	return &marketService{
		marketServiceAPIURL: marketServiceAPIURL,
	}
}

func (marketServ *marketService) GetUserProducts(userID int64) ([]Product, error) {
	resp, err := http.Get(fmt.Sprintf("%s/products/%v", marketServ.marketServiceAPIURL, userID))
	if err != nil {
		return nil, errors.WithStack(err)
	}

	buf, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	defer resp.Body.Close()

	products := make([]Product, 0)
	err = json.Unmarshal(buf, &products)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return products, nil
}

func (marketServ *marketService) GetUserPurchases(userID int64) ([]Purchase, error) {
	resp, err := http.Get(fmt.Sprintf("%s/purchases/%v", marketServ.marketServiceAPIURL, userID))
	if err != nil {
		return nil, errors.WithStack(err)
	}

	buf, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	defer resp.Body.Close()

	purchases := make([]Purchase, 0)
	err = json.Unmarshal(buf, &purchases)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return purchases, nil
}

func (marketServ *marketService) DeleteUserMarketData(userID int64) error {
	resp, err := http.Get(fmt.Sprintf("%s/user_data/%v", marketServ.marketServiceAPIURL, userID))
	if err != nil {
		return errors.WithStack(err)
	}
	if resp.StatusCode < 200 && resp.StatusCode > 399 {
		return errors.New("invalid response status code response")
	}

	return nil
}
