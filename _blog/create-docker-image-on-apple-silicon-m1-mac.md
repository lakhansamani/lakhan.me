---
title: Create docker image on Apple Silicon M1 Mac 
date: "2021-08-04T00:00:00.169Z"
excerpt: Demo to build docker on apple m1 which can work across various machines
tags: devops,docker,apple-m1
author:
  name: Lakhan Samani
  picture: '/images/profile.jpg'
ogImage:
  url: '/images/profile.jpg'
---

My biggest pain while moving to Apple Silicon M1 chip mac book was to create a docker build that would work on all the machines. It took some time for me to figure out how I can create docker images and share on docker hub that would work across different platforms.

By default Docker on M1 macbook would create `linux/arm64` images, which would work only on the machines that are using [ARM](https://en.wikipedia.org/wiki/ARM_architecture) architecture. But intel based machines uses [AMD](https://en.wikipedia.org/wiki/Advanced_Micro_Devices) architecture. As a result docker images built on m1 macbook might not work on intel based machines.

>It might not even work on gcloud / aws k8s clusters 😄

But the good part is that m1 chip macbook supports `linux/amd64` images, so we might only need to build docker images using `linux/amd64`.

Let me demonstrate an [example](https://github.com/lakhansamani/docker-demo) here:

Consider you have a Golang Application and you need Docker image for that

So your Dockerfile might look like

```docker
FROM golang:1.16-alpine as builder
WORKDIR /app
COPY . .

RUN go build && \
    chmod 777 docker-demo

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/docker-demo .
CMD [ "./docker-demo" ]
```

> Note this is just an example you can have any Dockerfile😄

Now the command to build should add `--platform` flag with the correct platform that you want to build docker image for.

Example

```shell
docker build --platform linux/amd64 -t lakhansamani/docker-demo .
```

Thats all 😅
Now you can publish your docker image on docker hub and share with people.

You can find demo code on this [github](https://github.com/lakhansamani/docker-demo) repository