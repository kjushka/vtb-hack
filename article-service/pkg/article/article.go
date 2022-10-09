package article

import (
	"article-service/internal/user_service"
	"time"
)

type Article struct {
	ID           int64              `json:"id"`
	Title        string             `json:"title"`
	Text         string             `json:"text"`
	CreationDate time.Time          `json:"creationDate"`
	Likes        int64              `json:"likes"`
	Author       *user_service.User `json:"author"`
}

type Comment struct {
	ID          int64              `json:"id"`
	CommentText string             `json:"commentText"`
	Author      *user_service.User `json:"author"`
	WriteDate   time.Time          `json:"writeDate"`
}
