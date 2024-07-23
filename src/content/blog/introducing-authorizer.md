---
author: Lakhan Samani
pubDatetime: 2021-12-02T15:22:00Z
title: Introducing Authorizer
slug: introducing-authorizer
featured: false
draft: false
tags:
  - arangodb
  - authorization
  - automation
  - cassandradb
  - golang
  - graphql
  - mongodb
  - mysql
  - opensource
  - postgres
  - sqlite
description: Introducing open source authentication and authorization tool
---

[Authorizer](https://authorizer.dev/) is an open-source authentication and authorization solution for your applications. Bring your database and have complete control over the user information. You can self-host authorizer instance and connect to SQL databases like postgres, mysql, sqlite, mongodb, arangodb, cassandradb, mariadb, planetsql.

![https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ksjsy0lbcspfcowoz09n.png](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ksjsy0lbcspfcowoz09n.png)

# Why you should consider using [Authorizer](https://authorizer.dev/) ❓

✅ It is open source and free to use 😅

✅ Supports role based authentication & Authorization

✅ Supports secure session management with HTTP only Cookies & JWT tokens

✅ Supports multiple auth recipies

- Social media login (Google, Facebook, Github, more to come)
- Basic login using email & password
- Passwordless login via the magic link

✅ Supports database of your choice

✅ Supports multiple integrations and implementations

- [JS SDK](https://docs.authorizer.dev/authorizer-js/getting-started/) that can be used in Backend (NodeJS) and Frontend
- [React Component Library](https://docs.authorizer.dev/authorizer-react/getting-started/) for React specific projects
- More to come soon...

✅ Comes with Builtin Login Solution

- A login page where you can directly redirect your users and get the login state in your web application using JS SDK

✅ Comes with Multiple Deployment Options

- [Heroku](https://docs.authorizer.dev/deployment/heroku/)
- [Kubernetes](https://docs.authorizer.dev/deployment/kubernetes/)
- [Binaries](https://docs.authorizer.dev/deployment/binary/)

✅ Supports custom scripting for advanced use cases like modifying JWT token payload

✅ Developed using modern stack

- GoLang with high performant [Gin Server](https://github.com/gin-gonic/gin)
- Exposes GraphQL API

## Check how it works!

<iframe height="315" src="https://www.youtube.com/embed/uQka5O2RwpU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="width:100%"></iframe>

## Motivation behind [Authorizer](https://authorizer.dev/)

- Didn't want to implement the same logic again and again
- Needed single source of data. If I use 3rd party services user data might be at different places and application data might be at a different place.
- Didn't want to pay for services like [auth0](https://auth0.com/) based on user count. This model is painful as application scales.
- Needed authorization service always running as it can add more latency if implemented with serverless architecture, which will put service to sleep when not used. Also, it can come with the complexity of more open DB connections as the app scales
- Needed a graphical representation of user data, that is the reason I used GraphQL which will help us link user information with other application data and generate the linked graph (Helpful when the application is using GraphQL under the hood)

## Check how you can integrate this with React Application

<iframe height="315" src="https://www.youtube.com/embed/2aOTuwkfYvM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="width:100%"></iframe>

Please share your feedback, issues on [discord](https://discord.gg/Zv2D5h6kkK) or [Github](https://github.com/authorizerdev/authorizer).

Also, don't forget to share the love for [authorizer](https://github.com/authorizerdev/authorizer) by adding a star to [Github]
