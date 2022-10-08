package user_service

type UserService interface {
}

type userService struct {
	userServiceAPIURL string
}

func NewUserService(userServiceAPIURL string) UserService {
	return &userService{
		userServiceAPIURL: userServiceAPIURL,
	}
}
