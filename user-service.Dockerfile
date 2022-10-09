FROM golang:1.19-alpine
WORKDIR /user_service
COPY /user-service ./
RUN go mod download
RUN go build -o ./bin/user_service ./cmd/user_service

CMD [ "./bin/user_service" ]