---
author: Lakhan Samani
pubDatetime: 2025-03-03T12:00:00Z
title: Building a Distributed E-commerce App with Go and gRPC – Part 1
slug: introduction-to-distributed-system-part-1
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
description: Learn distributed application development using golang and grpc.
---

## Introduction & Project Overview

### 🚀 Why Build a Distributed System with Go & gRPC?
Modern applications need to be scalable, fast, and efficient. A monolithic approach may work initially, but as your app grows, it becomes hard to maintain. This is where microservices come in!

In this series, we’ll build a simple distributed e-commerce system using Go, gRPC, PostgreSQL, and Kubernetes. By the end of this series, you’ll understand how to:

- ✅ Design gRPC APIs for communication between services.
- ✅ Implement services with Go and handle user authentication.
- ✅ Use middleware for logging, monitoring, and security.
- ✅ Deploy services to Kubernetes and scale them dynamically.

---

## 📌 Project Overview: What Are We Building?
We’ll build a simplified e-commerce backend with two core services:

User Service 🧑‍💻
    - Create users
    - Authenticate users with JWT
    - Retrieve user details

Order Service 📦
    - Place an order (linked to a user)
    - Get order details

### 🛠 Tech Stack
| Technology |	Purpose |
| --- | --- |
| Go |	Backend services |
| gRPC |	Communication between services|
| PostgreSQL|	Database for users & orders|
| Redis	| Caching & rate-limiting |
| Prometheus & Grafana |	Monitoring & metrics |
| Prometheus & Alertmanager |	Setting up alerts for failures |
| Kubernetes (K8s) |	Deployment & auto-scaling |

### 🌍 System Architecture
Here’s how the services interact:

![services-architecture](/assets/distributed-system-p1-tech.png)

- The User Service stores user data in PostgreSQL.
- The Order Service processes orders and links them to users.
- Both services communicate via gRPC instead of REST for high performance.

---

##📝 Step 1: Setting Up the Project

### 1️⃣ Install Dependencies
Make sure you have Go installed (v1.23+ recommended). Then install proto buff:

```sh
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

Now add them to your `PATH`:

```sh
export PATH="$PATH:$(go env GOPATH)/bin"
```

### 2️⃣ Create the Project Structure
Run the following to set up the project:

> Note: please replace github.com/lakhansamani with your github or go package URL.

```sh
mkdir ecom-grpc
cd ecom-grpc
mkdir apis userd orderd
cd apis # common repo for all the service apis 
go mod init github.com/lakhansamani/ecom-grpc-apis
cd ..
cd userd # user service
go mod init github.com/lakhansamani/ecom-grpc-userd
cd ..
cd orderd # order service
go mod init github.com/lakhansamani/ecom-grpc-orderd
```

🎯 Next Steps
In Part 2, we’ll define our gRPC APIs using Protobuf and implement the User Service in Go. Stay tuned! 🚀