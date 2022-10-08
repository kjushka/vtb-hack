package user_service

type User struct {
	ID        int64  `json:"id" db:"owner_id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Avatar    string `json:"avatar"`
}
