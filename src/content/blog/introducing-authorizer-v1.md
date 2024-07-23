---
author: Lakhan Samani
pubDatetime: 2022-08-15T15:22:00Z
title: Introducing Authorizer 1.0
slug: introducing-authorizer-1.0
featured: true
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

We’re excited to announce the stable version of [https://authorizer.dev](https://authorizer.dev) with the most significant updates 🥳. The most complex part of your application, i.e. auth has never been this simple in the open-source space before. Bring your database and have auth layer ready for the application within minutes 🚀.

## You can get started in 3 easy steps

**Step 1:** [Deploy Authorizer Instance](https://docs.authorizer.dev/getting-started)

**Step 2:** [Setup the instance using built in dashboard](https://docs.authorizer.dev/getting-started)

**Step 3**: [Integrate universal login page with your application](https://docs.authorizer.dev/getting-started)

Let’s have a look at the amazing set of features 🚀

## Secure Session Management

Authorizer follows the best practices in the auth space and gives you secure session management using

- HTTP only cookies (Recommended for web)
- [Authorization Code Flow](https://oauth.net/2/pkce/) (Recommended for mobile applications)
- OAuth2 with Open ID compatible apis

## Multiple Auth Recipes

Authorizer comes with amazing set of auth recipes out of the box, which includes major social media logins, magic link login and basic authentication. You can easily configure this recipes using the dashboard that is shipped with every instance of Authorizer.

![authorizer-1.0-1.png](https://res.cloudinary.com/dcfpom7fo/image/upload/v1714862928/Authorizer/authorizer-1.0-1.png)

## **Myriad Database Support**

Authorizer now supports 11+ databases including major SQL, NoSQL and GraphDB with motive **Your Data Your Control**. Bring your database and it will just adds few tables / collection in your database to generates auth layer for you.

![authorizer-1.0-2.png](https://res.cloudinary.com/dcfpom7fo/image/upload/v1714862928/Authorizer/authorizer-1.0-2.png)

## Role Base Access Control

Secure your APIs and UI depending on various roles for your application. You can easily configure the user roles in your dashboard and have them validated in the JWT tokens.

![authorizer-1.0-3.png](https://res.cloudinary.com/dcfpom7fo/image/upload/v1714862928/Authorizer/authorizer-1.0-3.png)

## Integrate / Implement

Every instance of Authorizer comes with universal login page which you can integrate in your application with few lines of code. This page is rendered based on the configuration you have in the dashboard. Still if you need to build the custom UI then we have react SDK and JS SDK which you can leverage.

![authorizer-1.0-4.png](https://res.cloudinary.com/dcfpom7fo/image/upload/v1714862928/Authorizer/authorizer-1.0-4.png)

## Custom Emails

Now you can send emails for various Authorizer events with your own design and messaging. You can also give personal touch to this emails with the help of dynamic variables that will be replaced before sending emails

![authorizer-1.0-5.png](https://res.cloudinary.com/dcfpom7fo/image/upload/v1714862928/Authorizer/authorizer-1.0-5.png)

## Multi-factor Authentication

Now you can add one more layer of security by enabling multi-factor authentication which will send one time passwords (OTP) via emails to users and after entering that password only user will be able to access your application. This feature is enabled for basic authentication at the moment.

![authorizer-1.0-4.png](https://res.cloudinary.com/dcfpom7fo/image/upload/v1714862928/Authorizer/authorizer-1.0-4.png)

## Listen to events

Most advanced feature of Authorizer. You can now listen to various Authorizer events in your APIs with the help of webhooks and take further actions if required

![authorizer-1.0-6.png](https://res.cloudinary.com/dcfpom7fo/image/upload/v1714862928/Authorizer/authorizer-1.0-6.png)

With all this amazing set of features you can deploy Authorizer instance on your infrastructure using Docker, Kubernetes or Binaries. Also you can use the one click deployment options that we offer to get started quickly 🚀

<iframe height="315" src="https://www.youtube.com/embed/DFgo0TuA4c8?si=Zzs54Nz1B8Pez-1k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="width:100%"></iframe>

I hope you like it and give it a try. You can support our work by contributing to the project, sending Github sponsorship, buying us coffee or giving us a star on Github. For more information checkout the links below.

Website: [https://authorizer.dev](https://authorizer.dev)

Docs: [https://docs.authorizer.dev](https://docs.authorizer.dev)

Github: [https://github.com/authorizerdev/authorizer](https://github.com/authorizerdev/authorizer)

React SDK: https://github.com/authorizerdev/authorizer-react

Javascript SDK: https://github.com/authorizerdev/authorizer-js

Youtube: [https://youtube.com/playlist?list=PLSQGbUjHc6bpaAgCiQPzNxiUPr7SkDAFR](https://youtube.com/playlist?list=PLSQGbUjHc6bpaAgCiQPzNxiUPr7SkDAFR)

Examples: [https://github.com/authorizerdev/examples/](https://github.com/authorizerdev/examples/)

Discord: [https://discord.gg/Zv2D5h6kkK](https://discord.gg/Zv2D5h6kkK)

Github Sponsorship: https://github.com/sponsors/authorizerdev/

Buy me Coffee: [https://www.buymeacoffee.com/lakhansamani](https://www.buymeacoffee.com/lakhansamani)
