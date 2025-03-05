---
author: Lakhan Samani
pubDatetime: 2025-03-05T12:00:00Z
title: Implementing User Service with Golang, gRPC and PostgreSQL - Part 3
slug: implementing-userd-part-3
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

In [Part 2](https://www.lakhan.me/posts/distributed-system-api-definition-part-2/) we introduced apis for User service, this post walks through implementing a **User Service** in Go using **gRPC** with **PostgreSQL** as the database. The service provides user authentication with JWT-based authentication. The implementation includes:

- gRPC service definition
- Database integration using GORM
- JWT-based authentication
- A structured service layer

> Note: Please replace the github user name and repo in each of the following folder

## Project Structure

The folder structure for the service is as follows:
```
ecom-grpc/userd/
│-- db/
│   │-- db.go
│   │-- user.go
│-- service/
│   │-- service.go
│   │-- login.go
│   │-- register.go
│   │-- me.go
│-- utils/
│   │-- jwt.go
│-- main.go
│-- .env
│-- Dockerfile
│-- .dockerignore
```

### Database Provider (`db/db.go`)
This file defines the interface for database operations and initializes the connection to PostgreSQL using GORM.
```go
package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Provider defines the interface for the database provider
type Provider interface {
	CreateUser(user *User) (*User, error)
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id string) (*User, error)
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
	db.AutoMigrate(&User{})

	return &provider{db}
}
```

### Database User Methods (`db/user.go`)
This file implements the methods to interact with the `users` table.

```go
package db

import (
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	user "github.com/lakhansamani/ecom-grpc-apis/user/v1"
)

// User represents the User model in DB
type User struct {
	ID       string `gorm:"primaryKey"`
	Name     string
	Email    string `gorm:"unique"`
	Password string
}

// AsAPIUser converts the User model to API User
func (u *User) AsAPIUser() *user.User {
	return &user.User{
		Id:    u.ID,
		Name:  u.Name,
		Email: u.Email,
	}
}

// BeforeSave GORM hook to hash password only if it's changed
func (u *User) BeforeSave(tx *gorm.DB) (err error) {
	// Hash the new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// Before create
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	// Generate UUID
	u.ID = uuid.NewString()
	return
}

// CreateUser creates a new user in the database
func (p *provider) CreateUser(u *User) (*User, error) {
	err := p.db.Create(u).Error
	return u, err
}

// GetUserByEmail fetches a user by email from the database
func (p *provider) GetUserByEmail(email string) (*User, error) {
	var u User
	err := p.db.Where("email = ?", email).First(&u).Error
	return &u, err
}

// GetUserByID fetches a user by ID from the database
func (p *provider) GetUserByID(id string) (*User, error) {
	var u User
	err := p.db.Where("id = ?", id).First(&u).Error
	return &u, err
}
```

### User Service (`service/service.go`)
This file defines the service layer for user operations. It holds configurations and dependencies.

```go
package service

import (
	user "github.com/lakhansamani/ecom-grpc-apis/user/v1"
	"github.com/lakhansamani/ecom-grpc-userd/db"
)

type Config struct {
	JWTSecret string
}

type Dependencies struct {
	DBProvider db.Provider
}

// Service implements the User service.
type Service interface {
	user.UserServiceServer
}

type service struct {
	Config
	Dependencies
}

// New creates a new User service.
func New(cfg Config, deps Dependencies) Service {
	return &service{
		Config:       cfg,
		Dependencies: deps,
	}
}
```

### Register API (`service/register.go`)
Handles user registration.

```go
package service

import (
	"context"
	"errors"
	"strings"

	user "github.com/lakhansamani/ecom-grpc-apis/user/v1"

	"github.com/lakhansamani/ecom-grpc-userd/db"
)

// Register API to register a new user
// Permission: none
func (s *service) Register(ctx context.Context, req *user.RegisterRequest) (*user.RegisterResponse, error) {
	name := req.GetName()
	email := req.GetEmail()
	password := req.GetPassword()

	if strings.TrimSpace(name) == "" {
		return nil, errors.New("name is required")
	}

	if strings.TrimSpace(email) == "" {
		return nil, errors.New("email is required")
	}

	if strings.TrimSpace(password) == "" {
		return nil, errors.New("password is required")
	}

	resUser, err := s.DBProvider.CreateUser(&db.User{
		Name:     name,
		Email:    email,
		Password: password,
	})
	if err != nil {
		return nil, err
	}

	return &user.RegisterResponse{
		UserId: resUser.ID,
	}, nil
}

```

### Login API (`service/login.go`)
Handles user login and JWT generation.

```go
package service

import (
	"context"
	"errors"
	"strings"

	"golang.org/x/crypto/bcrypt"

	user "github.com/lakhansamani/ecom-grpc-apis/user/v1"

	"github.com/lakhansamani/ecom-grpc-userd/utils"
)

// Login API to login a user
// Permission: none
func (s *service) Login(ctx context.Context, req *user.LoginRequest) (*user.LoginResponse, error) {
	email := req.GetEmail()
	password := req.GetPassword()

	if strings.TrimSpace(email) == "" {
		return nil, errors.New("email is required")
	}

	if strings.TrimSpace(password) == "" {
		return nil, errors.New("password is required")
	}

	// Get user by email
	resUser, err := s.DBProvider.GetUserByEmail(email)
	if err != nil {
		return nil, err
	}

	// Match password
	if err := bcrypt.CompareHashAndPassword([]byte(resUser.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid password")
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(s.JWTSecret, resUser.ID)
	if err != nil {
		return nil, err
	}

	return &user.LoginResponse{
		Token: token,
	}, nil
}

```

### Me API (`service/me.go`)
Retrieves the currently authenticated user.

```go
package service

import (
	"context"
	"errors"
	"strings"

	user "github.com/lakhansamani/ecom-grpc-apis/user/v1"
	"github.com/lakhansamani/ecom-grpc-userd/utils"
	"google.golang.org/grpc/metadata"
)

// Me API to get user details
// Permission: authenticated user
func (s *service) Me(ctx context.Context, req *user.MeRequest) (*user.MeResponse, error) {
	// Get the Authorization bearer token from the context
	// Extract the token from the header
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, errors.New("missing metadata")
	}

	authHeader, exists := md["authorization"]
	if !exists || len(authHeader) == 0 {
		return nil, errors.New("missing authorization token")
	}

	token := authHeader[0]
	// Make sure the token is not empty and is bearer token
	if token == "" {
		return nil, errors.New("missing token")
	}
	tokenSplit := strings.Split(token, " ")
	if len(tokenSplit) != 2 {
		return nil, errors.New("invalid token")
	}
	if strings.ToLower(tokenSplit[0]) != "bearer" {
		return nil, errors.New("invalid token")
	}
	token = tokenSplit[1]
	userID, err := utils.VerifyJWT(s.JWTSecret, token)
	if err != nil {
		return nil, err
	}
	// Fetch the user from the database
	resUser, err := s.DBProvider.GetUserByID(userID)
	if err != nil {
		return nil, err
	}
	// Return the user details
	return &user.MeResponse{
		User: resUser.AsAPIUser(),
	}, nil
}

```

### JWT Utility (`utils/jwt.go`)
Handles JWT generation and verification.

```go
package utils

import (
	"time"

	"github.com/golang-jwt/jwt"
)

// Generate JWT token
func GenerateJWT(secret, userID string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})
	return token.SignedString([]byte(secret))
}

// VerifyJWT verifies the JWT token
func VerifyJWT(secret, tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return "", err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", err
	}
	// Check if token is valid
	if !token.Valid {
		return "", err
	}
	return claims["user_id"].(string), nil
}

```

### Main File (`main.go`)
Starts the gRPC server and initializes dependencies.

```go
package main

import (
	"log"
	"net"
	"os"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"

	userpb "github.com/lakhansamani/ecom-grpc-apis/user/v1"

	"github.com/lakhansamani/ecom-grpc-userd/db"
	"github.com/lakhansamani/ecom-grpc-userd/service"
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
	// JWT Secret
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET is required")
	}
	// Initialize database
	dbProvider := db.New(dbURL)

	// Create a new gRPC server
	server := grpc.NewServer()

	// Register UserService with gRPC
	userService := service.New(
		service.Config{
			JWTSecret: jwtSecret,
		},
		service.Dependencies{
			DBProvider: dbProvider,
		})
	userpb.RegisterUserServiceServer(server, userService)

	// Start gRPC server
	listener, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	log.Println("gRPC Server is running on port 50051...")
	if err := server.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
```

### Dockerfile (Dockerfile)
This file helps in creating `userd` container image that we can use in future with kubernetes.

```dockerfile
# Build Stage
FROM golang:1.23 AS builder

WORKDIR /app

# Copy go.mod and go.sum and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the Go binary with static linking (Alpine compatible)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o userd ./main.go

# Final Runtime Stage (Alpine)
FROM alpine:latest

WORKDIR /app

# Install certificates (required for HTTPS calls)
RUN apk add --no-cache ca-certificates

# Copy binary from builder
COPY --from=builder /app/userd .

# Expose gRPC port
EXPOSE 50051

# Run the application
CMD ["./userd"]
```

### Docker ignore file (.dockerignore)
This file helps ignoring development files example .env in production build

```
.env
```

### Running the Service
```sh
docker run --name postgres-cluster -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
go run main.go
```

Now, your **User Service** is live with **gRPC, PostgreSQL, and JWT authentication**! 🚀

You can try following commands with correct `.proto` file path

```
grpcurl -plaintext -d '{ "name": "John Doe", "email": "john@example.com", "password": "securepass" }' -proto=apis/user/v1/user.proto localhost:50051 user.v1.UserService/Register

grpcurl -plaintext -d '{ "email": "john@example.com", "password": "securepass" }' -proto=apis/user/v1/user.proto localhost:50051 user.v1.UserService/Login

grpcurl -plaintext -H "authorization: bearer JWT_TOKEN" -proto=apis/user/v1/user.proto localhost:50051 user.v1.UserService/Me
```

## Code Link

- [Github APIs repo](https://github.com/lakhansamani/ecom-grpc-userd)


## 🎯 Next Steps
- 🚀 Now that we have the User Service implemented, in Part 4, we will:
- ✅ Implement Order Service.
