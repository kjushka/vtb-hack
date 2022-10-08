package database

import (
	"database/sql"
	"fmt"
	"github.com/jmoiron/sqlx"
	"time"
	"user-service/internal/config"

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
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, errors.Wrap(err, "couldn't connect with database")
	}

	err = db.Ping()
	if err != nil {
		for err != nil {
			time.Sleep(time.Second * 2)
			err = db.Ping()
		}
	}

	sqlx.NewDb(db, "postgres")

	return sqlx.NewDb(db, "postgres"), nil
}
