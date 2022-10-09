FROM golang:1.19-alpine
WORKDIR /user_service
COPY /user-service ./
RUN go mod download
RUN go build -o ./bin/article_service ./cmd/article_service

CMD [ "./bin/user_service" ]