package money_service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/pkg/errors"
	"io"
	"net/http"
)

type MoneyService interface {
	GetUserBalance(userID int64) (*BalanceResponse, error)
	MakePurchase(from int64, to int64, amount float64) error
}

type moneyService struct {
	moneyServiceAPIURL string
}

func NewMoneyService(moneyServiceAPIURL string) MoneyService {
	return &moneyService{moneyServiceAPIURL: moneyServiceAPIURL}
}

type BalanceResponse struct {
	Balance float64 `json:"matic_amount"`
}

func (monServ *moneyService) GetUserBalance(userID int64) (*BalanceResponse, error) {
	resp, err := http.Get(fmt.Sprintf("%s/wallet/get_balance/%v", monServ.moneyServiceAPIURL, userID))
	if err != nil {
		return nil, errors.WithStack(err)
	}

	buf, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	defer resp.Body.Close()

	balance := &BalanceResponse{}
	err = json.Unmarshal(buf, balance)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return balance, nil
}

func (monServ *moneyService) MakePurchase(from int64, to int64, amount float64) error {
	makePurchaseRequest := struct {
		From   int64   `json:"from"`
		To     int64   `json:"to"`
		Amount float64 `json:"amount"`
	}{
		From:   from,
		To:     to,
		Amount: amount,
	}
	body, err := json.Marshal(makePurchaseRequest)
	if err != nil {
		return errors.WithStack(err)
	}

	resp, err := http.Post(fmt.Sprintf("%s/transfer/transfer_matic", monServ.moneyServiceAPIURL), "application/json", bytes.NewBuffer(body))
	if err != nil {
		return errors.WithStack(err)
	}
	if resp.StatusCode < 200 && resp.StatusCode > 399 {
		return errors.New("invalid response status code response")
	}

	return nil
}
