---
author: Lakhan Samani
pubDatetime: 2025-03-17T12:00:00Z
title: Deploying Our Distributed System on Kubernetes with Kind - Part 7
slug: deploying-distributed-system-k8s-part-7
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
  - k9s
  - k8s
  - kubernetes
  - Docker
description: Learn deploying distributed systems using kubernetes and kind.
---

In the previous blog posts, we designed and implemented a distributed system comprising **User Service (userd)** and **Order Service (orderd)** with observability using **OpenTelemetry**, **Jaeger**, **Prometheus**, and **Alertmanager**. In this final part, we'll deploy the entire system on **Kubernetes (Kind)** and demonstrate how it benefits distributed systems.

---

## Why Deploy on Kubernetes?
Deploying our distributed system on **Kubernetes** offers several benefits:
- **Scalability**: Easily scale services as traffic grows.
- **Fault Tolerance**: Kubernetes ensures services restart on failure.
- **Observability**: Seamless monitoring using **Prometheus** and **Jaeger**.
- **Portability**: Deploy the same stack in any cloud or local environment.

---

## Setting Up the Kind Cluster
We'll use **Kind** (Kubernetes in Docker) to set up a local Kubernetes cluster.

### **Step 1: Install Kind & kubectl**
Ensure **Kind** and **kubectl** are installed:
```sh
# Install Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x kind
mv kind /usr/local/bin/

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/
```

### **Step 2: Create a Kind Cluster**
```sh
kind create cluster --name distributed-system --config kind.yaml
```

`kind.yaml`:
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    extraPortMappings:
      - containerPort: 5432 # postgres
        hostPort: 5432
      - containerPort: 50051 # userd grpc
        hostPort: 50051
      - containerPort: 50052 # orderd grpc
        hostPort: 50052
      - containerPort: 9091 # userd metrics
        hostPort: 9091
      - containerPort: 9092 # orderd metrics
        hostPort: 9092
      - containerPort: 16686 # jaeger ui
        hostPort: 16686
      - containerPort: 4317 # jaeger grpc
        hostPort: 4317
      - containerPort: 4318 # jaeger http
        hostPort: 4318
      - containerPort: 9090 # prometheus
        hostPort: 9090
      - containerPort: 9093 # alertmanager
        hostPort: 9093
```

---

## Deploying Databases (PostgreSQL)
We need **userdb** and **orderdb** for our services.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:latest
          env:
            - name: POSTGRES_USER
              value: postgres
            - name: POSTGRES_PASSWORD
              value: postgres
          ports:
            - containerPort: 5432
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  ports:
    - protocol: TCP
      port: 5432
      targetPort: 5432
  selector:
    app: postgres
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: userdb-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: batch/v1
kind: Job
metadata:
  name: create-userdb
spec:
  template:
    spec:
      containers:
        - name: create-userdb
          image: postgres:latest
          command: ["/bin/sh", "-c", "psql -U postgres -h postgres -c 'CREATE DATABASE userdb;'" ]
          env:
            - name: PGPASSWORD
              value: postgres
      restartPolicy: Never
---
apiVersion: batch/v1
kind: Job
metadata:
  name: create-orderdb
spec:
  template:
    spec:
      containers:
        - name: create-orderdb
          image: postgres:latest
          command: ["/bin/sh", "-c", "psql -U postgres -h postgres -c 'CREATE DATABASE orderdb;'" ]
          env:
            - name: PGPASSWORD
              value: postgres
      restartPolicy: Never
```

Apply the database setup:
```sh
kubectl apply -f postgres.yaml
```

---

## Deploying the User and Order Services
Each service will be exposed via a **Kubernetes Service**.

### **userd Deployment & Service `userd.yaml`**

Before deploying this service, we have created docker image and pushed to docker hub

```sh
# build image
docker build --platform linux/amd64 -t lakhansamani/ecom-grpc-userd:0.1.0 .

#push image
docker push lakhansamani/ecom-grpc-userd:0.1.0
```

> Note you can use your docker hub account or any other container registry to  push image.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: userd
spec:
  replicas: 1
  selector:
    matchLabels:
      app: userd
  template:
    metadata:
      labels:
        app: userd
    spec:
      containers:
        - name: userd
          image: lakhansamani/ecom-grpc-userd:0.1.0
          env:
            - name: DB_URL
              value: "postgres://postgres:postgres@postgres:5432/userdb"
            - name: JWT_SECRET
              value: "secret"
            - name: JAEGER_URL
              value: "jaeger:4317"
          ports:
            - containerPort: 50051
            - containerPort: 9091
---
apiVersion: v1
kind: Service
metadata:
  name: userd
spec:
  ports:
    - name: grpc
      port: 50051
      targetPort: 50051
    - name: metrics
      port: 9091
      targetPort: 9091
  selector:
    app: userd
```
Apply the deployment:
```sh
kubectl apply -f userd.yaml
```

### **orderd Deployment & Service `orderd.yaml`**

Before deploying this service, we have created docker image and pushed to docker hub

```sh
# build image
docker build --platform linux/amd64 -t lakhansamani/ecom-grpc-orderd:0.1.0 .

#push image
docker push lakhansamani/ecom-grpc-orderd:0.1.0
```
> Note you can use your docker hub account or any other container registry to  push image.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orderd
spec:
  replicas: 1
  selector:
    matchLabels:
      app: orderd
  template:
    metadata:
      labels:
        app: orderd
    spec:
      containers:
        - name: orderd
          image: lakhansamani/ecom-grpc-orderd:0.1.0
          env:
            - name: DB_URL
              value: "postgres://postgres:postgres@postgres:5432/orderdb"
            - name: USER_SERVICE_URL
              value: "userd:50051"
            - name: JAEGER_URL
              value: "jaeger:4317"
          ports:
            - containerPort: 50052
            - containerPort: 9092
---
apiVersion: v1
kind: Service
metadata:
  name: orderd
spec:
  ports:
    - name: grpc
      port: 50052
      targetPort: 50052
    - name: metrics
      port: 9092
      targetPort: 9092
  selector:
    app: orderd
```
Apply the file:
```sh
kubectl apply -f orderd.yaml
```

---

## Deploying Observability Stack
### **Jaeger (Tracing) `jaeger.yaml`**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
        - name: jaeger
          image: jaegertracing/all-in-one:latest
          ports:
            - containerPort: 16686
            - containerPort: 4317
            - containerPort: 4318
          env:
            - name: COLLECTOR_OTLP_ENABLED
              value: "true"
---
apiVersion: v1
kind: Service
metadata:
  name: jaeger
spec:
  selector:
    app: jaeger
  ports:
    - name: ui
      port: 16686
      targetPort: 16686
    - name: grpc
      port: 4317
      targetPort: 4317
    - name: http
      port: 4318
      targetPort: 4318
```
```sh
kubectl apply -f jaeger.yaml
```

### **Prometheus (Metrics) `prometheus.yaml`**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 5s

    alerting:
      alertmanagers:
        - static_configs:
            - targets: ["alertmanager:9093"]

    rule_files:
      - alert_rules.yaml

    scrape_configs:
      - job_name: "userd"
        static_configs:
          - targets: ["userd:9091"]

      - job_name: "orderd"
        static_configs:
          - targets: ["orderd:9092"]

  alert_rules.yaml: |
    groups:
      - name: userd
        rules:
          - alert: HighInvalidLoginAttempts
            expr: increase(userd_service_login_handler{result="invalid_password"}[1m]) > 3
            for: 1m
            labels:
              severity: warning
            annotations:
              summary: "High Invalid Login Attempts"
              description: "More than 3 invalid login attempts detected in the last minute."
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
        - name: prometheus
          image: prom/prometheus:v2.37.0
          args:
            - "--config.file=/etc/prometheus/prometheus.yml"
            - "--storage.tsdb.path=/prometheus"
            - "--web.enable-lifecycle"
          ports:
            - name: http
              containerPort: 9090
          volumeMounts:
            - name: prometheus-config-volume
              mountPath: /etc/prometheus/prometheus.yml
              subPath: prometheus.yml
            - name: prometheus-config-volume
              mountPath: /etc/prometheus/alert_rules.yaml
              subPath: alert_rules.yaml
      volumes:
        - name: prometheus-config-volume
          configMap:
            name: prometheus-config
---
apiVersion: v1
kind: Service
metadata:
  name: prometheus
spec:
  selector:
    app: prometheus
  ports:
    - name: http
      port: 9090
      targetPort: 9090
```

```sh
kubectl apply -f prometheus.yaml
```

### **Alertmanager (Alerts) `alertmanager.yaml`**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: alertmanager-config
data:
  alertmanager.yml: |
    global:
      resolve_timeout: 5m

    route:
      receiver: "slack-notifications"

    receivers:
      - name: "slack-notifications"
        slack_configs:
          - channel: "#alerts"
            send_resolved: true
            username: "prometheus"
            api_url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alertmanager
spec:
  replicas: 1
  selector:
    matchLabels:
      app: alertmanager
  template:
    metadata:
      labels:
        app: alertmanager
    spec:
      containers:
        - name: alertmanager
          image: prom/alertmanager:v0.25.0
          args:
            - "--config.file=/etc/alertmanager/alertmanager.yml"
          ports:
            - containerPort: 9093
          volumeMounts:
            - name: config-volume
              mountPath: /etc/alertmanager
      volumes:
        - name: config-volume
          configMap:
            name: alertmanager-config
---
apiVersion: v1
kind: Service
metadata:
  name: alertmanager
spec:
  selector:
    app: alertmanager
  ports:
    - name: http
      port: 9093
      targetPort: 9093
```

```sh
kubectl apply -f alertmanager.yaml
```

---

## Accessing Services
After deployment, access services on localhost:
- **User Service**: `grpcurl -plaintext localhost:50051 list`
- **Order Service**: `grpcurl -plaintext localhost:50052 list`
- **Jaeger UI**: [http://localhost:16686](http://localhost:16686)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **Alertmanager**: [http://localhost:9093](http://localhost:9093)

> Note: if it does not work, try port forwarding those port to local ports. eg `kubectl port-forward svc/jaeger 16686:16686`

## Repository

All configuration files has been published here:

[Github Repo](https://github.com/lakhansamani/ecom-k8s)

---

## Conclusion
With **Kubernetes and Kind**, we've successfully deployed our distributed system with observability and monitoring. This setup provides scalability, resilience, and detailed insights into system health. From here, you can:
- **Scale the services** using `kubectl scale deployment userd --replicas=3`
- **Deploy to the cloud** using Kubernetes clusters like GKE or EKS.

This marks the end of our distributed system journey. Happy coding! 🚀

