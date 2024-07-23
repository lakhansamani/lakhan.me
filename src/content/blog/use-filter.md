---
author: Lakhan Samani
pubDatetime: 2021-05-2T15:22:00Z
title: React useFilter Hook
slug: use-file
featured: false
draft: false
tags:
  - React.js
  - filter
  - hook
  - useFilter
  - webworker
description: React use filter hook
---

There are times when we need to process and filter data in frontend. Writing the search and filter logic can be an overhead and repeating task. With the help of `[useFilter](https://github.com/promise-learning/useFilter)` hook you don't need to write the filter/search logic.

Also, while dealing with large amount of data, it often takes up lot memory and keeps the main thread blocked till the filtering process is completed. This results into bad user experience. In order to keep the main thread free and run the web application without any glitches we can leverage the use of [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) which runs on a separate thread and can share the messages with main thread.

I, along with my friend [Yash Joshi](https://twitter.com/jyash97) developed a react hook `[useFilter](https://github.com/promise-learning/useFilter)` that lets you filter and search data using webworker.

## Live Demo

<iframe referrerpolicy="strict-origin-when-cross-origin" src="https://codesandbox.io/embed/usefilter-demo-comlink-mdfz8?fontsize=14&hidenavigation=1&theme=dark" style="width:100%;height:500px"></iframe>

## How to use?

### Installation

- Yarn `yarn add @promise_learning/usefilter`
- NPM `npm install @promise_learning/usefilter`

### Usage

> We recommend using react-window for rendering large data set. Also use useDebounce hook with search so that with every hit a search query is not triggered.

```jsx
  import { useFilter } from '@promise_learning/usefilter';
  import from './data.json';

  /////////////////////////////////////////
  // handle this using the state in ur app
  ////////////////////////////////////////

  const searchData = {
    query: '',
    fields: ['name'],
  };

  const filtersData = {
    category: ['Sci Fiction'],
  };

  export const App = () => {
    const { loading, data: result } = useFilter({ data, search: searchData, filters: filterData });

    if (loading) {
      return <div>Loading..</div>
    }

    return (
      <>
          // render result
      </>
    )
  }

```

## Parameters

[Untitled Database](React%20useFilter%20Hook%207f247a2f27544ae787698dee8f13b6b1/Untitled%20Database%2076ee26cba6154892aa9cb16c4a894904.csv)

| Parameter | Type                                                                                               | Required |
| --------- | -------------------------------------------------------------------------------------------------- | -------- |
| data      | Array                                                                                              | true     |
| search    | Object => `{query: '', fields: []}`. `query` is the search term & `fields` are the object keys     | false    |
| filters   | Object => `{key:val}`. Where key is a field from object in array and value could be possible value | false    |

## Data Returned

Object with following data is returned by the `useFilter` hook.

| Key     | Value          | Description                          |
| ------- | -------------- | ------------------------------------ |
| loading | `true`/`false` | Worker processing state              |
| data    | Array          | filtered response based on the input |

## When to use?

- Filter / Search large list in frontend
- Filter / Search large data table in frontend

Enjoy using `@promise_learning/usefilter` and shower some love to [github repo](https://github.com/promise-learning/useFilter) 🎉
