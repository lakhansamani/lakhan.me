---
author: Lakhan Samani
pubDatetime: 2025-03-07T12:00:00Z
title: Implementing tracing in distributed systems - Part 5
slug: implementing-tracing-part-5
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
  - tracing
  - logging
  - observability
description: Learn distributed application tracing
---

## Introduction

In Part 4, we implemented the orderd service. In a distributed system, tracking what happens across multiple services is crucial. Logging provides insights into what occurred, while tracing helps follow a request's journey across services.

In this post, we will set up distributed tracing in our e-commerce system [userd](https://github.com/lakhansamani/ecom-grpc-userd) and [orderd](https://github.com/lakhansamani/ecom-grpc-orderd) services using OpenTelemetry and Jaeger. This will help us visualize the flow of requests and debug performance bottlenecks.

![img](/assets/distributed-tracing.png)

> Check when get order service is called how the trace is made to user service and db methods.

## Why OpenTelemetry and Jaeger?

OpenTelemetry (OTel) is a vendor-neutral observability framework that provides standardized tools for metrics, logs, and traces. Jaeger, originally developed at Uber, is a distributed tracing tool that helps monitor and troubleshoot transactions in microservices-based systems.

## Why not just logs?

- Logs capture discrete events but do not provide a structured way to see how a request moves across multiple services.
- Tracing provides an end-to-end view of a request and shows where delays occur.

Benefits of OpenTelemetry and Jaeger:

- ✅ End-to-end tracing: Tracks requests across microservices.
- ✅ Root cause analysis: Helps find performance bottlenecks.
- ✅ Open standard: Works with multiple backends like Jaeger, Zipkin, Prometheus, and Datadog.
- ✅ Automatic instrumentation: Hooks into gRPC, HTTP, and database calls without major code changes.

## Implementing Tracing in [userd](https://github.com/lakhansamani/ecom-grpc-userd)

We update [userd](https://github.com/lakhansamani/ecom-grpc-userd) to send traces using OpenTelemetry.

### Step 1: Configure OpenTelemetry in main.go
Check the exporter here, we will exporting trace to Jaeger endpoint that way it can collect all the traces.

```go
ctx := context.Background()
exporter, err := otlptracegrpc.New(ctx, otlptracegrpc.WithInsecure(), otlptracegrpc.WithEndpoint("localhost:4317"))
if err != nil {
    log.Fatalf("failed to create OTLP trace exporter: %v", err)
}

tracerProvider := trace.NewTracerProvider(
    trace.WithBatcher(exporter),
    trace.WithResource(resource.NewWithAttributes(
        semconv.SchemaURL,
        semconv.ServiceNameKey.String("userd"),
    )),
)

otel.SetTracerProvider(tracerProvider)
```

### Step 2: Add Tracing to gRPC Server

```go
serverHandler := otelgrpc.NewServerHandler(
    otelgrpc.WithTracerProvider(tracerProvider),
)
server := grpc.NewServer(
    grpc.StatsHandler(serverHandler),
)
```

### Step 3: Add Trace Spans in UserService methods

example, adding trace span to `Register` service in `service/register.go`

```
ctx, span := s.trace.Start(ctx, "Register")
defer span.End()
```

### Step 4: Add trace to db calls.

In order to achieve this, we need to add plugin and call db methods with context

Updated `db/db.go` db provider

```go
// New creates new database provider
// connects to db and returns the provider
func New(dbURL string) Provider {
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := db.Use(tracing.NewPlugin()); err != nil {
		log.Fatalf("Failed to use tracing plugin: %v", err)
	}
	// Auto-migrate User model
	db.AutoMigrate(&User{})

	return &provider{db}
}
```

---

## Implementing Tracing in [orderd](https://github.com/lakhansamani/ecom-grpc-orderd)

[orderd](https://github.com/lakhansamani/ecom-grpc-orderd) needs both server-side and client-side tracing since it calls [userd](https://github.com/lakhansamani/ecom-grpc-userd).

### Step 1,2,3,4 remains same as userd service.

### Step 5: Add gRPC Client Tracing for userd

```go
openTelemetryClientHandler := otelgrpc.NewClientHandler(
    otelgrpc.WithTracerProvider(tracerProvider),
)
grpcConn, err := grpc.NewClient(
    userServiceURL,
    grpc.WithTransportCredentials(insecure.NewCredentials()),
    grpc.WithStatsHandler(openTelemetryClientHandler),
)
userServiceClient := user.NewUserServiceClient(grpcConn)
```

## Setting Up Jaeger

### Step 1: Run Jaeger using Docker

```sh
docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest
```
### Step 2: View Traces in Jaeger UI

Open http://localhost:16686 in your browser to visualize traces.

## Code Links

For complete change log, pls check

- [userd commit](https://github.com/lakhansamani/ecom-grpc-userd/commit/927cb2d46250d87957c4754419aa5e16baf391f6)
- [orderd commit](https://github.com/lakhansamani/ecom-grpc-orderd/commit/d72ad99ad1af3803dab414abbef5b0305de14461)

Conclusion

We successfully added OpenTelemetry tracing to our userd and orderd services. By using Jaeger, we can visualize request flows, diagnose bottlenecks, and improve performance in our distributed system.

## Next Steps:

Explore monitoring and metrics collection using Prometheus.

Stay tuned for the next post! 🚀