---
title: First node module - skype-chat-parser
date: '2016-09-11T12:12:03.284Z'
---

## What is [skype-chat-parser](https://www.npmjs.com/package/skype-chat-parser) ?

Skype chat parser will help you to convert your skype chat history into json model. An example is given below.

```
[13/07/16, 4:56:42 PM] Mr x: Hello world
```

### TO

```
{
	"timestamp":1342341231,
	"username":"MR x",
	"chatData":"Hello world"
}
```

This tool will help you model your skype chat history so that you can do chat analysis. One of my friend [Samyak Bhuta](https://github.com/samyakbhuta) inspired me to solve this problem.

## How skype chat parser works ?

Skype chat parser is a command line tool developed using Javascript and published as a node module. It will take skype chat history `txt` file as a input and will give a `json` file which contains array of model shown above.

### How to get text file out of skype chat?

- Select the chat, copy and paste in your favourite text editor and save it with `.txt` extension

### Installation step

`npm install -g skype-chat-parser`

### Usage

`skype-chat-parser [textfilepath].txt`

### Sample output

```
JSON saved to skypeChat.json
```

So yes, I am excited about announcing my first `npm module` which is published on [npmjs.com](https://www.npmjs.com/package/skype-chat-parser). Also this is an open source project so you can find source code on [github repo](https://github.com/lakhansamani/skype-chat-parser) and create Issues/PR.

> References: [npmjs.com video tutorial](https://docs.npmjs.com/getting-started/publishing-npm-packages)
