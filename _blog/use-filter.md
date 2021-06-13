---
title: React useFilter Hook
date: "2021-05-01T22:40:32.169Z"
excerpt: A React hook to filter large amount of data using  Web Worker. A perfomant way to filter data with inbuilt filter & search options.
tags: react,hook,webworker,filter,data
author:
  name: Lakhan Samani
  picture: '/images/profile.jpg'
ogImage:
  url: '/images/profile.jpg'
---

There are times when we need to process and filter data in frontend. Writing the search and filter logic can be an overhead and repeating task. With the help of [`useFilter`](https://github.com/promise-learning/useFilter) hook you don't need to write the filter/search logic.

Also, while dealing with large amount of data, it often takes up lot memory and keeps the main thread blocked till the filtering process is completed. This results into bad user experience. In order to keep the main thread free and run the web application without any glitches we can leverage the use of [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) which runs on a separate thread and can share the messages with main thread.

I, along with my friend [Yash Joshi](https://twitter.com/jyash97) developed a react hook [`useFilter`](https://github.com/promise-learning/useFilter) that lets you filter and search data using webworker.

## Live Demo

<iframe src="https://codesandbox.io/embed/usefilter-demo-comlink-mdfz8?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useFilter-demo1"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## How to use?

### Installation

- Yarn: `yarn add @promise_learning/usefilter`
- NPM: `npm install @promise_learning/usefilter`

### Usage

> We recommend using [react-window](https://www.npmjs.com/package/react-window) for rendering large data set. Also use [`useDebounce`](https://www.npmjs.com/package/use-debounce) hook with search so that with every hit a search query is not triggered.

```jsx

  import { useFilter } from '@promise_learning/usefilter';
  import from './data.json';


  ///////////////////////////////////////////
  // handle this using the state in your app
  //////////////////////////////////////////

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

- `data`: __Type:__ Array of Objects  | __Required:__ true
- `search`: __Type:__ Object -> `{query: '', fields: []}`. `query` is the search term and `fields` is the object keys to search on | __Required:__ `false`
- `filters`: __Type:__ Object -> Key Value Pair. Where `key` is a field from object in array and value could be possible value   | __Required:__ `false`

## Data Returned

Object with following data is returned by the `useFilter` hook.

- `loading`: __Type:__ boolean | __Description:__ Worker processing state
- `data`: __Type:__ Array of objects | __Description:__ filtered response based on the input

## When to use?

- Filter / Search large list in frontend
- Filter / Search large data table in frontend

Enjoy using `@promise_learning/usefilter` and shower some love to [github repo](https://github.com/promise-learning/useFilter) 🎉
