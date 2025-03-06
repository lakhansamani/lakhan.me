---
author: Lakhan Samani
pubDatetime: 2025-03-04T12:00:00Z
title: Defining gRPC APIs with Protobuf - Part 2
slug: distributed-system-api-definition-part-2
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
description: Learn distributed application api definition using proto file.
---

In [Part 1](https://www.lakhan.me/posts/introduction-to-distributed-system-part-1/), we set up our project structure. Now, we’ll:
✅ Define User and Order APIs
✅ Generate gRPC code from .proto files.

We have created `apis` folder so lets navigate to that folder and define our apis there.

```
cd ecom-grpc/apis
```

> Note: Please replace the github user name and repo in each of the following folder


## Step 1: Install Protobuf Compiler
Before writing .proto files, install protoc:

### 🔹 Mac (Homebrew)

```sh
brew install protobuf
```

### 🔹 Ubuntu/Linux

```sh
sudo apt update && sudo apt install -y protobuf-compiler
```

### 🔹 Windows
Download from protobuf releases.

Verify installation:

```sh
protoc --version
```

## Step 2: Define User Service API

create `user/v1/user.proto` file in `apis` repo

```sh
mkdir -p user/v1/
touch user/v1/user.proto
```

```proto
syntax = "proto3";

package user.v1;

option go_package = "github.com/lakhansamani/ecom-grpc-apis/user/v1";

// User Service definition
service UserService {
    // Register API to register a new user
    // Permission: none
    rpc Register(RegisterRequest) returns (RegisterResponse);
    // Login API to login a user
    // Permission: none
    rpc Login(LoginRequest) returns (LoginResponse);
    // Me API to get user details
    // Permission: authenticated user
    rpc Me(MeRequest) returns (MeResponse);
}

// User model
message User {
    string id = 1;
    string name = 2;
    string email = 3;
}
  
// Register API
message RegisterRequest {
    string name = 1;
    string email = 2;
    string password = 3;
}
  
message RegisterResponse {
    string user_id = 1;
}
  
// Login API
message LoginRequest {
    string email = 1;
    string password = 2;
}
  
message LoginResponse {
    string token = 1;
}
  
// Me API (token will be taken from gRPC metadata)
message MeRequest {}
  
message MeResponse {
    User user = 1;
}
```

### New API methods

- Register → Registers a new user and returns a JWT token.
- Login → Authenticates a user and returns a JWT token.
- Me → Returns user details using the JWT token.

## 🔹 Step 3: Define Order Service API

create `order/v1/order.proto` file in `apis` repo

```sh
mkdir -p order/v1/
touch order/v1/order.proto
```


```proto
syntax = "proto3";

package order.v1;

option go_package = "github.com/lakhansamani/ecom-grpc-apis/order/v1";

service OrderService {
    // CreateOrder API to create a new order
    // Permission: authenticated user
    rpc CreateOrder(CreateOrderRequest) returns (CreateOrderResponse);
    // GetOrder API to get order details
    // Permission: authenticated user who created the order
    rpc GetOrder(GetOrderRequest) returns (GetOrderResponse);
}

// Order model
message Order {
    string id = 1;
    string user_id = 2;
    string product = 3;
    int32 quantity = 4;
    double unit_price = 5;
}

// CreateOrder request API
message CreateOrderRequest {
    string product = 1;
    int32 quantity = 2;
}

// CreateOrder response API
message CreateOrderResponse {
    Order order = 1;
}

// GetOrder request API
message GetOrderRequest {
    string id = 1;
}

// GetOrder response API
message GetOrderResponse {
    Order order = 1;
}
```

### New API methods

- CreateOrder - to create order
- GetOrder - to get order information


## 🔹 Step 4: Generate gRPC Code

To simplify the process lets create a `Makefile` at the root of `apis` repo which we can run to generate the go-grpc code.

```
touch Makefile
```

```make
all: build
build:
	protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=require_unimplemented_servers=false:. --go-grpc_opt=paths=source_relative user/v1/user.proto
	protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=require_unimplemented_servers=false:. --go-grpc_opt=paths=source_relative order/v1/order.proto
```

Run `make` command to generate the files and push to github.

## Code Link

- [Github APIs repo](https://github.com/lakhansamani/ecom-grpc-apis)


## 🎯 Next Steps
- 🚀 Now that we have the User & Order Service protobuf, in Part 3, we will:
- ✅ Implement User Service.
- ✅ Implement Order Service.

Stay tuned! 🚀