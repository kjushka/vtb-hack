package user_service

import (
	"encoding/json"
	"fmt"
	"github.com/pkg/errors"
	"io"
	"net/http"
	"strconv"
	"strings"
)

type UserService interface {
	GetUserByID(userID int64) (*User, error)
	GetUsersByIDs(usersIDs []int64) ([]*User, error)
}

type userService struct {
	userServiceAPIURL string
}

func NewUserService(userServiceAPIURL string) UserService {
	return &userService{
		userServiceAPIURL: userServiceAPIURL,
	}
}

func (userServ *userService) GetUserByID(userID int64) (*User, error) {
	resp, err := http.Get(fmt.Sprintf("%s/users/%v", userServ.userServiceAPIURL, userID))
	if err != nil {
		return nil, errors.WithStack(err)
	}

	buf, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	defer resp.Body.Close()

	var user User
	err = json.Unmarshal(buf, &user)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return &user, nil
}

func (userServ *userService) GetUsersByIDs(usersIDs []int64) ([]*User, error) {
	usersIDsStr := make([]string, 0, len(usersIDs))
	for _, id := range usersIDs {
		idStr := strconv.FormatInt(id, 10)
		usersIDsStr = append(usersIDsStr, idStr)
	}

	resp, err := http.Get(fmt.Sprintf("%s/users?ids=%v", userServ.userServiceAPIURL, strings.Join(usersIDsStr, ",")))
	if err != nil {
		return nil, errors.WithStack(err)
	}

	buf, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	defer resp.Body.Close()

	users := make([]*User, 0)
	err = json.Unmarshal(buf, &users)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return users, nil
}
