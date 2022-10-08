package product_repository

import (
	"context"
	"market-service/internal/user_service"
	"market-service/pkg/product"
	product_model "market-service/pkg/product"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

type ProductRepository interface {
	GetProduct(ctx context.Context, productID int64) (*product_model.Product, error)
	SaveProduct(ctx context.Context, product *product.Product) error
	GetAllProducts(ctx context.Context) ([]product.Product, error)
	GetProductsByIDs(ctx context.Context, userIDs []int64) ([]product.Product, error)
	UpdateProduct(ctx context.Context, productId int64, pr *product.Product) (*product.Product, error)
}

func NewProductRepository(db *sqlx.DB) ProductRepository {
	return &productRepository{
		db: db,
	}
}

type productRepository struct {
	db *sqlx.DB
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

func (pr *productRepository) SaveProduct(ctx context.Context, product *product.Product) error {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	_, err := pr.db.ExecContext(ctx,
		`
		insert into products (id, title, owner_id, preview, product_count, price, description)
		values ($1, $2, $3, $4, $5, $6, $7);
		`,
		product.ID,
		product.Title,
		product.Owner.ID,
		product.Preview,
		product.Count,
		product.Price,
		product.Description,
	)
	if err != nil {
		return errors.WithStack(err)
	}

	return nil
}

func (pr *productRepository) GetAllProducts(ctx context.Context) ([]product.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	query := "select id, title, description, price, count, preview, owner from products;"

	var products []product.Product
	err := pr.db.SelectContext(ctx, &products, query)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return products, nil
}

func (pr *productRepository) GetProductsByIDs(ctx context.Context, productsIds []int64) ([]product.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	var err error
	queryBase := "select id, title, description, price, count, preview, owner from products where id in (?);"
	query, params, err := sqlx.In(queryBase, productsIds)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	query = pr.db.Rebind(query)

	var products []product.Product
	err = pr.db.SelectContext(ctx, &products, query, params...)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return products, nil
}

func (prRep *productRepository) UpdateProduct(ctx context.Context, productId int64, pr *product.Product) (*product.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	_, err := prRep.db.ExecContext(ctx,
		`
		update products
		set
		    title = $2,
			description = $3,
			count = $4,
			owner_id = $5,
			preview = $6,
			price = $7
		where id=$1;
		`,
		productId,
		pr.Title,
		pr.Description,
		pr.Count,
		pr.Owner.ID,
		pr.Preview,
		pr.Price,
	)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return pr, nil
}
