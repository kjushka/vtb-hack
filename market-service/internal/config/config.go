package config

import (
	"fmt"
	"os"

	"github.com/pkg/errors"
)

type Config struct {
	DBHost, DBPort, Database, DBUser, DBPass string
	UserServiceAPIURL                        string
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

	userServiceHost, ok := os.LookupEnv("USER_SERVICE_HOST")
	if !ok {
		return nil, errors.New("USER_SERVICE_HOST not found")
	}
	userServicePort, ok := os.LookupEnv("USER_SERVICE_PORT")
	if !ok {
		return nil, errors.New("PG_MARKET_PASS not found")
	}
	userServiceAPIURL := fmt.Sprintf("http://%s:%s/user_service", userServiceHost, userServicePort)

	moneyServiceHost, ok := os.LookupEnv("MONEY_SERVICE_HOST")
	if !ok {
		return nil, errors.New("MONEY_SERVICE_HOST not found")
	}
	moneyServicePort, ok := os.LookupEnv("MONEY_SERVICE_PORT")
	if !ok {
		return nil, errors.New("MONEY_SERVICE_PORT not found")
	}
	moneyServiceAPIURL := fmt.Sprintf("http://%s:%s/api", moneyServiceHost, moneyServicePort)

	authKey, ok := os.LookupEnv("AUTH_KEY")
	if !ok {
		return nil, errors.New("AUTH_KEY not found")
	}

	config := &Config{
		DBHost:             pgHost,
		DBPort:             pgPort,
		DBUser:             pgUser,
		DBPass:             pgPass,
		Database:           database,
		UserServiceAPIURL:  userServiceAPIURL,
		MoneyServiceAPIURL: moneyServiceAPIURL,
		AuthKey:            authKey,
	}
	return config, nil
}
