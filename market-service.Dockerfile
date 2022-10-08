FROM golang:1.19-alpine
WORKDIR /market_service
COPY /market-service ./
RUN go mod download
RUN go build -o ./bin/market_service ./cmd/market_service

CMD [ "./bin/market_service" ]