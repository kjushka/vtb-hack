package user_repository

import (
	"context"
	"database/sql"
	"github.com/pkg/errors"
	"time"
	"user-service/pkg/user"
)

type UserRepository interface {
	SaveUser(ctx context.Context, user *user.User) error
	GetUser(ctx context.Context, userID int64) (*user.User, error)
	DeleteUser(ctx context.Context, userID int64) error
	UpdateUser(ctx context.Context, userID int64, u *user.User) (*user.User, error)
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{
		db: db,
	}
}

type userRepository struct {
	db *sql.DB
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
	row := userRep.db.QueryRowContext(ctx,
		`
		select id, first_name, last_name, email, phone_number, birthday, department, description, avatar
		from system_users
		where id=$1;
		`,
		userID,
	)
	if err = row.Err(); err != nil {
		return nil, errors.WithStack(err)
	}
	u := &user.User{}
	err = row.Scan(
		&u.ID,
		&u.FirstName,
		&u.LastName,
		&u.Email,
		&u.PhoneNumber,
		&u.Birthday,
		&u.Department,
		&u.Description,
		&u.Avatar,
	)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return u, nil
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
			description = $7,
		where id=$1;
		`,
		userID,
	)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return u, nil
}
