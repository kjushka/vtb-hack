package product_repository

import (
	"context"
	"database/sql"
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
	DeleteProduct(ctx context.Context, productID int64) error
	MakePurchase(ctx context.Context, p *product.Product, customerID, amount int64) error
	GetUserProducts(ctx context.Context, userID int64) ([]product.Product, error)
	GetUserPurchases(ctx context.Context, userID int64) ([]product.Purchase, error)
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
	if product == nil {
		return nil, nil
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
		select id, title, description, price, product_count, is_nft, seller_id 
		from products 
		where id = $1;
	`, productID)
	if err = productQueryRow.Err(); err != nil {
		return nil, errors.WithStack(err)
	}

	productResult := &product_model.Product{Seller: &user_service.User{}}
	err = productQueryRow.Scan(
		&productResult.ID,
		&productResult.Title,
		&productResult.Description,
		&productResult.Price,
		&productResult.Count,
		&productResult.IsNFT,
		&productResult.Seller.ID,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
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
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, errors.WithStack(err)
	}

	return comments, nil
}

func (pr *productRepository) SaveProduct(ctx context.Context, product *product.Product) error {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	_, err := pr.db.ExecContext(ctx,
		`
		insert into products (title, seller_id, preview, product_count, price, description, in_nft)
		values ($1, $2, $3, $4, $5, $6, $7);
		`,
		product.Title,
		product.Seller.ID,
		product.Preview,
		product.Count,
		product.Price,
		product.Description,
		product.IsNFT,
	)
	if err != nil {
		return errors.WithStack(err)
	}

	return nil
}

func (pr *productRepository) GetAllProducts(ctx context.Context) ([]product.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	query := "select id, title, description, price, product_count as count, preview, seller_id as sellerID, is_nft as isNFT from products;"

	var productsDTO []product.DTOProduct
	err := pr.db.SelectContext(ctx, &productsDTO, query)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return product.DTOToProducts(productsDTO), nil
}

func (pr *productRepository) GetProductsByIDs(ctx context.Context, productsIds []int64) ([]product.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	var err error
	queryBase := "select id, title, description, price, product_count as count, preview, seller_id as sellerID, is_nft as isNFT from products where id in (?);"
	query, params, err := sqlx.In(queryBase, productsIds)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	query = pr.db.Rebind(query)

	var productsDTO []product.DTOProduct
	err = pr.db.SelectContext(ctx, &productsDTO, query, params...)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return product.DTOToProducts(productsDTO), nil
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
			product_count = $4,
			owner_id = $5,
			preview = $6,
			price = $7
		where id=$1;
		`,
		productId,
		pr.Title,
		pr.Description,
		pr.Count,
		pr.Seller.ID,
		pr.Preview,
		pr.Price,
	)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return pr, nil
}

func (pr *productRepository) DeleteProduct(ctx context.Context, productID int64) error {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	tx, err := pr.db.BeginTx(ctx, &sql.TxOptions{
		Isolation: sql.LevelReadCommitted,
		ReadOnly:  false,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	_, err = tx.ExecContext(ctx,
		`
		delete from products
		where id=$1;
		`,
		productID,
	)
	if err != nil {
		tx.Rollback()
		return errors.WithStack(err)
	}

	_, err = tx.ExecContext(ctx,
		`
		delete from comments
		where product_id=$1;
		`,
		productID,
	)
	if err != nil {
		tx.Rollback()
		return errors.WithStack(err)
	}

	_, err = tx.ExecContext(ctx,
		`
		delete from purchases
		where product_id=$1;
		`,
		productID,
	)
	if err != nil {
		tx.Rollback()
		return errors.WithStack(err)
	}

	tx.Commit()

	return nil
}

func (pr *productRepository) MakePurchase(ctx context.Context, p *product.Product, customerID, amount int64) error {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	_, err := pr.db.ExecContext(ctx,
		`
		insert into purchases (product_id, owner_id, buy_date, amount)
		values ($1, $2, $3, $4, $5, $6, $7);
		`,
		p.ID,
		customerID,
		time.Now(),
		amount,
	)
	if err != nil {
		return errors.WithStack(err)
	}

	return nil
}

func (pr *productRepository) GetUserProducts(ctx context.Context, userID int64) ([]product.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	query := "select id, title, description, price, product_count as count, preview, seller_id as sellerID, is_nft as isNFT from products where seller_id = $1;"

	var productsDTO []product.DTOProduct
	err := pr.db.SelectContext(ctx, &productsDTO, query, userID)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return product.DTOToProducts(productsDTO), nil
}

func (pr *productRepository) GetUserPurchases(ctx context.Context, userID int64) ([]product.Purchase, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	query := `
select pr.id, pr.title, pr.description, pr.price, pr.product_count as count, 
       pr.preview, pr.seller_id as sellerID, pr.is_nft as isNFT, 
       pur.buy_date as buyDate, pur.amount, pur.owner_id as ownerID 
from purchases as pur
inner join products as pr
on pur.product_id = pr.id
where pur.owner_id = $1;`

	var dtoPurchases []product.DTOPurchase
	err := pr.db.SelectContext(ctx, &dtoPurchases, query, userID)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return product.DTOToPurchase(dtoPurchases), nil
}
