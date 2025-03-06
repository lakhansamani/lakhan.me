---
author: Lakhan Samani
pubDatetime: 2025-03-05T12:00:00Z
title: Implementing Order Service with Golang, gRPC and PostgreSQL - Part 4
slug: implementing-orderd-part-3
featured: true
draft: false
tags:
  - Microservices
  - SoftwareArchitecture
  - Scalability
  - TechTrends
  - Golang
  - SoftwareDevelopment
  - DevOps
  - CloudComputing
  - Programming
  - APIs
  - ModernArchitecture
  - SoftwareEngineering
  - TechInnovation
  - MicroservicesArchitecture
  - Concurrency
  - CloudNative
  - SystemDesign
  - TechCommunity
  - CodeNewbie
  - DistributedSystem
  - E-commerce
  - Grpc
  - proto
description: Learn distributed application api implementation
---

## Introduction

In [Part 3](https://www.lakhan.me/posts/implementing-userd-part-3/) we implemented user service. In this post, we will implement an **Order Service** using **Golang, gRPC, PostgreSQL, and GORM**.

> Note: We are using static price here for product passed in create order request and we will be connecting to user service via grpc to authorize user.

## Project Structure
The folder structure for the service is as follows:
```
ecom-grpc/orderd/
│-- db/
│   │-- db.go
│   │-- order.go
│-- service/
│   │-- service.go
│   │-- create_order.go
│   │-- get_order.go
│-- main.go
│-- .env
│-- Dockerfile
│-- .dockerignore
```
Each file serves a specific purpose in maintaining a clean and modular design.

## Setting Up the Database
We'll use **PostgreSQL** as our database. If you don’t have PostgreSQL installed, you can run it using Docker:

```sh
docker run --name postgres-cluster -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
docker exec -it postgres-cluster psql -U postgres -c "CREATE DATABASE orderdb;"
```

## Database Layer (`db/`)
The **db package** handles all interactions with PostgreSQL.

### `db/db.go` - Database Connection
```go
package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Provider defines the interface for the database provider
type Provider interface {
	CreateOrder(order *Order) (*Order, error)
	GetOrderById(id string) (*Order, error)
}

// provider implements the Provider interface
type provider struct {
	db *gorm.DB
}

// New creates new database provider
// connects to db and returns the provider
func New(dbURL string) Provider {
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate User model
	db.AutoMigrate(&Order{})

	return &provider{db}
}

```

### `db/order.go` - Order Model
```go
package db

import (
	"github.com/google/uuid"
	"gorm.io/gorm"

	order "github.com/lakhansamani/ecom-grpc-apis/order/v1"
)

// Order represents the Order model in DB
type Order struct {
	ID        string `gorm:"primaryKey"`
	UserID    string
	Product   string
	Quantity  int32
	UnitPrice float64
}

// AsAPIOrder converts the Order model to API Order
func (o *Order) AsAPIOrder() *order.Order {
	return &order.Order{
		Id:        o.ID,
		UserId:    o.UserID,
		Product:   o.Product,
		Quantity:  o.Quantity,
		UnitPrice: o.UnitPrice,
	}
}

// Before create
func (o *Order) BeforeCreate(tx *gorm.DB) (err error) {
	// Generate UUID
	o.ID = uuid.NewString()
	return
}

// CreateOrder creates a new order in the database
func (p *provider) CreateOrder(o *Order) (*Order, error) {
	err := p.db.Create(o).Error
	return o, err
}

// GetOrderById fetches a order by ID from the database
func (p *provider) GetOrderById(id string) (*Order, error) {
	var o Order
	err := p.db.Where("id = ?", id).First(&o).Error
	return &o, err
}

```

## Service Layer (`service/`)
This layer implements the gRPC server and business logic.

### `service/service.go` - Service Dependencies
```go
package service

import (
	"context"
	"errors"

	"google.golang.org/grpc/metadata"

	order "github.com/lakhansamani/ecom-grpc-apis/order/v1"
	user "github.com/lakhansamani/ecom-grpc-apis/user/v1"

	"github.com/lakhansamani/ecom-grpc-orderd/db"
)

type Config struct {
	UserServiceAddress string
}

type Dependencies struct {
	// Add dependencies here
	DBProvider db.Provider
	// UserService user.Service
	UserService user.UserServiceClient
}

// Service implements the Order service.
type Service interface {
	order.OrderServiceServer
}

type service struct {
	Config
	Dependencies
}

// New creates a new Order service.
func New(cfg Config, deps Dependencies) Service {
	return &service{
		Config:       cfg,
		Dependencies: deps,
	}
}

// authorize verifies user using the user service and gets userID
func (s *service) authorize(ctx context.Context) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", errors.New("missing metadata")
	}

	authHeader, exists := md["authorization"]
	if !exists || len(authHeader) == 0 {
		return "", errors.New("missing authorization token")
	}
	token := authHeader[0]

	// add token to outgoing context
	ctx = metadata.AppendToOutgoingContext(ctx, "authorization", token)

	// Call user service to get user
	userResp, err := s.UserService.Me(ctx, &user.MeRequest{})
	if err != nil {
		return "", err
	}
	return userResp.GetUser().GetId(), nil
}

```

### `service/create_order.go` - Create Order API
```go
package service

import (
	"context"
	"errors"

	order "github.com/lakhansamani/ecom-grpc-apis/order/v1"
	"github.com/lakhansamani/ecom-grpc-orderd/db"
)

// CreateOrder API to create a new order
// Permission: authenticated user
func (s *service) CreateOrder(ctx context.Context, req *order.CreateOrderRequest) (*order.CreateOrderResponse, error) {
	// Authorizer user
	userID, err := s.authorize(ctx)
	if err != nil {
		return nil, err
	}
	// Validate request
	product := req.GetProduct()
	quantity := req.GetQuantity()
	if product == "" {
		return nil, errors.New("product is required")
	}
	if quantity <= 0 {
		return nil, errors.New("quantity should be greater than 0")
	}
	// Static Price
	price := float64(10.5)
	// Save order to database
	resOrder, err := s.DBProvider.CreateOrder(&db.Order{
		UserID:    userID,
		Product:   product,
		Quantity:  quantity,
		UnitPrice: price,
	})
	if err != nil {
		return nil, err
	}
	return &order.CreateOrderResponse{
		Order: resOrder.AsAPIOrder(),
	}, nil
}

```

### `service/get_order.go` - Get Order API
```go
package service

import (
	"context"
	"errors"

	order "github.com/lakhansamani/ecom-grpc-apis/order/v1"
)

// GetOrder API to get order details
// Permission: authenticated user who created the order
func (s *service) GetOrder(ctx context.Context, req *order.GetOrderRequest) (*order.GetOrderResponse, error) {
	// Authorizer user
	userID, err := s.authorize(ctx)
	if err != nil {
		return nil, err
	}
	// Get order from database
	orderID := req.GetId()
	if orderID == "" {
		return nil, errors.New("order id is required")
	}
	resOrder, err := s.DBProvider.GetOrderById(orderID)
	if err != nil {
		return nil, err
	}
	// Check if user is authorized to get the order
	if resOrder.UserID != userID {
		return nil, errors.New("unauthorized")
	}
	return &order.GetOrderResponse{
		Order: resOrder.AsAPIOrder(),
	}, nil
}

```

## Main Entry Point (`main.go`)
```go
package main

import (
	"log"
	"net"
	"os"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	order "github.com/lakhansamani/ecom-grpc-apis/order/v1"
	user "github.com/lakhansamani/ecom-grpc-apis/user/v1"

	"github.com/lakhansamani/ecom-grpc-orderd/db"
	"github.com/lakhansamani/ecom-grpc-orderd/service"
)

func main() {
	// Read .env file as environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println(".env file not found, using environment variables")
	}

	// DB URL
	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL is required")
	}
	// Initialize database
	dbProvider := db.New(dbURL)

	// Get User Service URL
	userServiceURL := os.Getenv("USER_SERVICE_URL")
	if userServiceURL == "" {
		log.Fatal("USER_SERVICE_URL is required")
	}

	// Create UserServiceClient using grpc
	grpcConn, err := grpc.NewClient(userServiceURL, grpc.WithTransportCredentials(
		insecure.NewCredentials(),
	))
	if err != nil {
		log.Fatalf("Failed to dial UserService: %v", err)
	}
	defer grpcConn.Close()

	userServiceClient := user.NewUserServiceClient(grpcConn)

	// Create a new gRPC server
	server := grpc.NewServer()

	// Register OrderService with gRPC
	orderService := service.New(
		service.Config{},
		service.Dependencies{
			DBProvider:  dbProvider,
			UserService: userServiceClient,
		})
	order.RegisterOrderServiceServer(server, orderService)

	// Start gRPC server
	listener, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	log.Println("gRPC Server is running on port 50052...")
	if err := server.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}

```

## Environment Configuration (`.env`)
```
DB_URL=postgres://postgres:postgres@localhost:5432/orderdb
USER_SERVICE_URL=0.0.0.0:50051
```

## Docker Setup
### `.dockerignore`
```
/bin
/pkg
```

### `Dockerfile`
```dockerfile
FROM golang:1.23 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o orderd ./main.go

FROM alpine:latest
WORKDIR /app
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/orderd .
EXPOSE 50052
CMD ["./orderd"]
```

## Running the Service
```sh
go run main.go
```
OR
```sh
docker build -t order-service .
docker run --env-file .env -p 50052:50052 order-service
```

Here are the commands to test it

```sh
grpcurl -plaintext -H "authorization: bearer JWT_TOKEN"  -d '{ "product": "book 1", "quantity": 1  }' -proto=apis/order/v1/order.proto localhost:50052 order.v1.OrderService/CreateOrder

grpcurl -plaintext -H "authorization: bearer JWT_TOKEN"  -d '{ "id": "ID"  }' -proto=apis/order/v1/order.proto localhost:50052 order.v1.OrderService/GetOrder
```

## Conclusion
- Built an **Order Service** with authentication.
- Used **gRPC metadata** for authorization.
- Stored orders in **PostgreSQL** with **GORM**.

Next: We will learn Logging & Tracing!

Stay Tuned

