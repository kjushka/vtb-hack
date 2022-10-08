package database

import (
	"fmt"
	"log"
	"market-service/internal/config"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/pkg/errors"
)

func InitDB(cfg *config.Config) (*sqlx.DB, error) {
	connStr := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		cfg.DBUser,
		cfg.DBPass,
		cfg.DBHost,
		cfg.DBPort,
		cfg.Database,
	)
	db, err := sqlx.Open("postgres", connStr)
	if err != nil {
		return nil, errors.Wrap(err, "couldn't connect with database")
	}

	err = db.Ping()
	if err != nil {
		for err != nil {
			log.Println(errors.Wrap(err, "couldn't make ping").Error())
			err = db.Ping()
		}
	}

	return db, nil
}
