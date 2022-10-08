package product_repository

import (
	"context"
	"database/sql"
	"market-service/internal/user_service"
	product_model "market-service/pkg/product"
	"time"

	"github.com/pkg/errors"
)

type ProductRepository interface {
	GetProduct(ctx context.Context, productID int64) (*product_model.Product, error)
}

func NewProductRepository(db *sql.DB) ProductRepository {
	return &productRepository{
		db: db,
	}
}

type productRepository struct {
	db *sql.DB
}

func (pr *productRepository) GetProduct(ctx context.Context, productID int64) (*product_model.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	product, err := pr.getProduct(ctx, productID)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	comments, err := pr.getProductComments(ctx, productID)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	product.Comments = comments

	return product, nil
}

func (pr *productRepository) getProduct(ctx context.Context, productID int64) (*product_model.Product, error) {
	var err error
	productQueryRow := pr.db.QueryRowContext(ctx, `
		select id, title, description, price, count, owner_id 
		from products 
		where id = $1;
	`, productID)
	if err = productQueryRow.Err(); err != nil {
		return nil, errors.WithStack(err)
	}

	productResult := &product_model.Product{Owner: &user_service.User{}}
	err = productQueryRow.Scan(
		&productResult.ID,
		&productResult.Title,
		&productResult.Description,
		&productResult.Price,
		&productResult.Count,
		&productResult.Owner.ID,
	)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return productResult, nil
}

func (pr *productRepository) getProductComments(ctx context.Context, productID int64) ([]product_model.Comment, error) {
	commentsQueryRows, err := pr.db.QueryContext(ctx, `
		select id, comment_text, write_date, author_id
		from product_comments
		where product_id = $1
	`, productID)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	var comments []product_model.Comment
	for commentsQueryRows.Next() {
		comment := product_model.Comment{Author: &user_service.User{}}
		if err = commentsQueryRows.Scan(
			&comment.ID,
			&comment.Text,
			&comment.Date,
			&comment.Author.ID,
		); err != nil {
			return nil, errors.WithStack(err)
		}
		comments = append(comments, comment)
	}
	if err = commentsQueryRows.Err(); err != nil {
		return nil, errors.WithStack(err)
	}

	return comments, nil
}
