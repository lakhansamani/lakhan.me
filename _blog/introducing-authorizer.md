---
title: Introducing Authorizer
date: '2021-12-01T22:40:32.169Z'
excerpt: Open source authentication and authorization solution
tags: auth0, authentication, authorization, go, graphql, react, js
author:
  name: Lakhan Samani
  picture: '/images/profile.jpg'
ogImage:
  url: '/images/profile.jpg'
---

[Authorizer](https://authorizer.dev/) is an open-source authentication and authorization solution for your applications. Bring your database and have complete control over the user information. You can self-host authorizer instance and connect to SQL databases like postgres, mysql, sqlite.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ksjsy0lbcspfcowoz09n.png)

# Why you should consider using [Authorizer](https://authorizer.dev/) ❓

✅  It is open source and free to use 😅

✅  Supports role-based authentication & Authorization

✅  Supports secure session management with HTTP only Cookies & JWT tokens

✅  Supports multiple auth recipes

- Social media login (Google, Facebook, Github, more to come)
- Basic login using email & password
- Passwordless login via the magic link

✅  Supports database of your choice

✅  Supports multiple integrations and implementations

- [JS SDK](https://docs.authorizer.dev/authorizer-js/getting-started/) that can be used in Backend (NodeJS) and Frontend
- [React Component Library](https://docs.authorizer.dev/authorizer-react/getting-started/) for React specific projects
- More to come soon...

✅  Comes with Builtin Login Solution

- A login page where you can directly redirect your users and get the login state in your web application using JS SDK

✅  Comes with Multiple Deployment Options

- [Heroku](https://docs.authorizer.dev/deployment/heroku/)
- [Kubernetes](https://docs.authorizer.dev/deployment/kubernetes/)
- [Binaries](https://docs.authorizer.dev/deployment/binary/)

✅  Supports custom scripting for advanced use cases like modifying JWT token payload

✅  Developed using modern stack

- GoLang with high performant [Gin Server](https://github.com/gin-gonic/gin)
- Exposes GraphQL API

## Check how it works!

<div class="video-container">
<iframe frameborder="0" src="https://www.youtube.com/embed/uQka5O2RwpU" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Motivation behind [Authorizer](https://authorizer.dev)

- Didn't want to implement the same logic again and again
- Needed single source of data. If I use 3rd party services user data might be at different places and application data might be at a different place.
- Didn't want to pay for services like [auth0](https://auth0.com/) based on user count. This model is painful as application scales.
- Needed authorization service always running as it can add more latency if implemented with serverless architecture, which will put service to sleep when not used. Also, it can come with the complexity of more open DB connections as the app scales
- Needed a graphical representation of user data, that is the reason I used GraphQL which will help us link user information with other application data and generate the linked graph (Helpful when the application is using GraphQL under the hood)

## Check how you can integrate this with React Application

<div class="video-container">
<iframe frameborder="0" src="https://www.youtube.com/embed/2aOTuwkfYvM" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Please share your feedback, issues on [discord](https://discord.gg/bSPgHKZR) or [Github](https://github.com/authorizerdev/authorizer).

Also, don't forget to share the love for [authorizer](https://github.com/authorizerdev/authorizer) by adding a star to [Github](https://github.com/authorizerdev/authorizer) projects!
