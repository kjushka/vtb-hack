package main

import (
	"log"
	"net/http"
	"os"
	"user-service/internal/config"
	"user-service/internal/database"
	"user-service/internal/http_service"
	"user-service/internal/migrations"

	"github.com/pkg/errors"
)

func main() {
	cfg, err := config.InitConfig()
	if err != nil {
		log.Fatal(errors.Wrap(err, "error in config initiating"))
	}

	db, err := database.InitDB(cfg)
	if err != nil {
		log.Fatal(errors.Wrap(err, "error in create database conn"))
	}
	defer db.Close()

	err = migrations.Migrate(db, cfg)
	if err != nil {
		log.Fatal(errors.Wrap(err, "error in migrate process"))
	}

	log.Println("service starting...")
	router := http_service.InitRouter(db, cfg)
	err = http.ListenAndServe(":8081", router)
	if err != nil {
		log.Println(errors.Wrap(err, "error in running service"))
		os.Exit(0)
	}
}
