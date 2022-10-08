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
	CreateWallet(userID int64) (*BalanceResponse, error)
	DeleteWallet(userID int64) error
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
	resp, err := http.Get(fmt.Sprintf("%s/get_balance/%v", monServ.moneyServiceAPIURL, userID))
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

func (monServ *moneyService) CreateWallet(userID int64) (*BalanceResponse, error) {
	req := struct {
		UserID int64 `json:"user_id"`
	}{UserID: userID}
	data, err := json.Marshal(req)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	resp, err := http.Post(
		fmt.Sprintf("%s/wallet/create_wallet", monServ.moneyServiceAPIURL),
		"application/json",
		bytes.NewBuffer(data),
	)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	if resp.StatusCode < 200 && resp.StatusCode > 399 {
		return nil, errors.New("invalid status code from money service")
	}

	return monServ.GetUserBalance(userID)
}

func (monServ *moneyService) DeleteWallet(userID int64) error {
	resp, err := http.Get(fmt.Sprintf("%s/delete_wallet/%v", monServ.moneyServiceAPIURL, userID))
	if err != nil {
		return errors.WithStack(err)
	}
	if resp.StatusCode < 200 && resp.StatusCode > 399 {
		return errors.New("invalid response status code response")
	}

	return nil
}
