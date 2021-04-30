---
title: useFilter Hook
date: '2021-04-29T22:40:32.169Z'
description: A React hook to filter large amount of data using  Web Worker.
tags: react, hook, webworker, filter, data
---

There are times when we need to process and filter data in frontend. While dealing with large amount of data, it often takes up lot memory and keeps the main thread block till the filtering process is completed. 

In order to keep the main thread free and run the web application without any glitches we can leverage the use of [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) which runs on a separate thread and can share the messages with main thread.

I, along with my friend [Yash Joshi](https://twitter.com/jyash97) developed a react hook [`useFilter`](https://github.com/promise-learning/useFilter) that lets you filter and search data using webworker. Internally it uses [`@koale/useworker`](https://github.com/alewin/useWorker) hook to use the webworker communication.

## Live Demo

<iframe src="https://codesandbox.io/embed/usefilter-demo-skp0g?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useFilter-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## How to use?

### Installation

- Yarn `yarn add @promise_learning/usefilter`
- NPM `npm install @promise_learning/usefilter`

### Usage

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

### Parameters

| Parameter | Type                                                                                                         | Required |
| --------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| data      | Array                                                                                                        | `true`   |
| search    | Object -> `{query: '', fields: []}`. `query` is the search term and `fields` is the object keys to search on | `false`  |
| filters   | Object -> Key Value Pair. Where `key` is a field from object in array and value could be possible value      | `false`  |

### Data Returned

Object with following data is returned by the `useFilter` hook.

| Key     | Values           | Description                          |
| ------- | ---------------- | ------------------------------------ |
| loading | `true` / `false` | Worker processing state              |
| data    | Array            | filtered response based on the input |


## When to use?

* Filter / Search large list in frontend
* Filter / Search large data table in frontend

Enjoy using `@promise_learning/usefilter` and shower some love to [github repo](https://github.com/promise-learning/useFilter) 🎉