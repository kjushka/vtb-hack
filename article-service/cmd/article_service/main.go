package main

import (
	"article-service/internal/config"
	"article-service/internal/database"
	"article-service/internal/http_service"
	"article-service/internal/migrations"
	"log"
	"net/http"
	"os"

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
