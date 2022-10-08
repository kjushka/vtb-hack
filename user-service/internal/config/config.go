package config

import (
	"fmt"
	"os"

	"github.com/pkg/errors"
)

type Config struct {
	DBHost, DBPort, Database, DBUser, DBPass string
	MarketServiceAPIURL                      string
	MoneyServiceAPIURL                       string
	SaveImagesURL                            string
	AuthKey                                  string
}

func InitConfig() (*Config, error) {
	pgHost, ok := os.LookupEnv("PG_HOST")
	if !ok {
		return nil, errors.New("PG_ADDR not found")
	}
	pgPort, ok := os.LookupEnv("PG_PORT")
	if !ok {
		return nil, errors.New("PG_PORT not found")
	}
	database, ok := os.LookupEnv("PG_MARKET_DATABASE")
	if !ok {
		return nil, errors.New("PG_MARKET_DATABASE not found")
	}
	pgUser, ok := os.LookupEnv("PG_MARKET_USER")
	if !ok {
		return nil, errors.New("PG_MARKET_USER not found")
	}
	pgPass, ok := os.LookupEnv("PG_MARKET_PASS")
	if !ok {
		return nil, errors.New("PG_MARKET_PASS not found")
	}

	marketServiceHost, ok := os.LookupEnv("MARKET_SERVICE_HOST")
	if !ok {
		return nil, errors.New("MARKET_SERVICE_HOST not found")
	}
	marketServicePort, ok := os.LookupEnv("MARKET_SERVICE_PORT")
	if !ok {
		return nil, errors.New("MARKET_SERVICE_PORT not found")
	}
	marketServiceAPIURL := fmt.Sprintf("http://%s:%s/market", marketServiceHost, marketServicePort)

	moneyServiceHost, ok := os.LookupEnv("MONEY_SERVICE_HOST")
	if !ok {
		return nil, errors.New("MONEY_SERVICE_HOST not found")
	}
	moneyServicePort, ok := os.LookupEnv("MONEY_SERVICE_PORT")
	if !ok {
		return nil, errors.New("MONEY_SERVICE_PORT not found")
	}
	moneyServiceAPIURL := fmt.Sprintf("http://%s:%s/api", moneyServiceHost, moneyServicePort)

	saveImagesURL, ok := os.LookupEnv("SAVE_IMAGES_PATH")
	if !ok {
		return nil, errors.New("SAVE_IMAGES_PATH not found")
	}

	authKey, ok := os.LookupEnv("AUTH_KEY")
	if !ok {
		return nil, errors.New("AUTH_KEY not found")
	}

	config := &Config{
		DBHost:              pgHost,
		DBPort:              pgPort,
		DBUser:              pgUser,
		DBPass:              pgPass,
		Database:            database,
		MarketServiceAPIURL: marketServiceAPIURL,
		MoneyServiceAPIURL:  moneyServiceAPIURL,
		SaveImagesURL:       saveImagesURL,
		AuthKey:             authKey,
	}
	return config, nil
}
