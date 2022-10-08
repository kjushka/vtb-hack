package user_repository

import (
	"context"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"time"
	"user-service/pkg/user"
)

type UserRepository interface {
	SaveUser(ctx context.Context, user *user.User) error
	GetUser(ctx context.Context, userID int64) (*user.User, error)
	GetUsersByIDs(ctx context.Context, userIDs []int64) ([]user.User, error)
	GetAllUsers(ctx context.Context) ([]user.User, error)
	DeleteUser(ctx context.Context, userID int64) error
	UpdateUser(ctx context.Context, userID int64, u *user.User) (*user.User, error)
}

func NewUserRepository(db *sqlx.DB) UserRepository {
	return &userRepository{
		db: db,
	}
}

type userRepository struct {
	db *sqlx.DB
}

func (userRep *userRepository) SaveUser(ctx context.Context, user *user.User) error {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	_, err := userRep.db.ExecContext(ctx,
		`
		insert into system_users (id, first_name, last_name, email, phone_number, birthday, department, description, avatar)
		values ($1, $2, $3, $4, $5, $6, $7, $8, $9);
		`,
		user.ID,
		user.FirstName,
		user.LastName,
		user.Email,
		user.PhoneNumber,
		user.Birthday,
		user.Department,
		user.Description,
		user.Avatar,
	)
	if err != nil {
		return errors.WithStack(err)
	}

	return nil
}

func (userRep *userRepository) GetUser(ctx context.Context, userID int64) (*user.User, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	var err error
	u := &user.User{}
	err = userRep.db.GetContext(ctx,
		u,
		`
		select id, first_name, last_name, email, phone_number, birthday, department, description, avatar
		from system_users
		where id=$1;
		`,
		userID,
	)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return u, nil
}

func (userRep *userRepository) GetUsersByIDs(ctx context.Context, userIDs []int64) ([]user.User, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	var err error
	queryBase := "select id, first_name, last_name, email, phone_number, birthday, department, description, avatar from system_users where id in (?);"
	query, params, err := sqlx.In(queryBase, userIDs)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	query = userRep.db.Rebind(query)

	var users []user.User
	err = userRep.db.SelectContext(ctx, &users, query, params...)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return users, nil
}

func (userRep *userRepository) GetAllUsers(ctx context.Context) ([]user.User, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	query := "select id, first_name, last_name, email, phone_number, birthday, department, description, avatar from system_users;"

	var users []user.User
	err := userRep.db.SelectContext(ctx, &users, query)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return users, nil
}

func (userRep *userRepository) DeleteUser(ctx context.Context, userID int64) error {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	_, err := userRep.db.ExecContext(ctx,
		`
		delete from system_users
		where id=$1;
		`,
		userID,
	)
	if err != nil {
		return errors.WithStack(err)
	}

	return nil
}

func (userRep *userRepository) UpdateUser(ctx context.Context, userID int64, u *user.User) (*user.User, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()

	_, err := userRep.db.ExecContext(ctx,
		`
		update system_users
		set
		    first_name = $2,
			last_name = $3,
			email = $4,
			phone_number = $5,
			department = $6,
			description = $7
		where id=$1;
		`,
		userID,
		u.FirstName,
		u.LastName,
		u.Email,
		u.PhoneNumber,
		u.Department,
		u.Description,
	)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return u, nil
}
