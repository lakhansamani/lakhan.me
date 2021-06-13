---
title: How to use React Suspense and lazy for code splitting
date: "2020-07-07T22:40:32.169Z"
excerpt: How you can optimize suspended state for lazily loaded component.
tags: reactjs, splitting, suspense, lazyload
author:
  name: Lakhan Samani
  picture: '/images/profile.jpg'
ogImage:
  url: '/images/profile.jpg'
---

React `Suspense` and `lazy` is a great way to split your code 🚀. It does all the magic and splits your codes into smaller bundle files. This would help in reducing the load time on the frontend and will load chunk only when the component/page is rendered. I am writing this post to share my learning about the `Suspense` and `lazy`, which can add flickers to your UI if not used correctly.

I have been using it with various other projects where I had to split code into chunks based on the routes. So a common practice to do that would be

```jsx
const Home = React.lazy(() => import("./Home"))
const Messages = React.lazy(() => import("./Messages"))

const App = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/messages">
        <Messages />
      </Route>
    </Switch>
  </Suspense>
)
```

and that works completely fine. It will create 2 `.js` chunks, one for `Home` component and another one for the `Messages` component.

But what happens when you start importing components lazily in the `Home` component or `Messages` component. It would still work but you might see UI keeps flickering with the `Loading` component. If the generated chunks are smaller in size, the UI flickers look bad, as before even rendering the `Loader` component, it would hide that and render the new component.

**Example**

<iframe src="https://codesandbox.io/embed/reverent-fog-fx837?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="reverent-fog-fx837"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Click on individual buttons in the above example and observe the flickers that occur to the previously loaded Messages.

### Why it flickers?

With the help of my friend [Divyanshu](https://twitter.com/divyanshu013) I was able to learn and debug the reason behind this flicker. It happens because we have wrapped the Messages component in single Suspense which is at the root level, i.e. `App.js`. So whenever a child component is lazily loaded, the entire Messages component is suspended.

Since the loading happens pretty fast the fallback is rendered very briefly which causes a flicker (entire Messages component is suspended and then resumed back).

### How to stop UI flickers?

There are 2 approaches to this.

1. Use Suspense with each of the lazily loaded components, this means it will only suspend the state for that particular component

   **Example**

<iframe src="https://codesandbox.io/embed/practical-jones-j56dy?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="practical-jones-j56dy"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

2. While discussing this issue with another friend [Yash Joshi](https://twitter.com/jyash97) one more solution came up, i.e. to preload a component in `componentDidMount` or `useEffect`.

   **Example**

<iframe src="https://codesandbox.io/embed/peaceful-payne-gtlef?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="peaceful-payne-gtlef"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Great learning over the weekend 🎉 #reactjs #optimizations #learninpublic
