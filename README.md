# 🚃 react router _(WIP)_

React router API is inspired by [wouter](https://github.com/molefrog/wouter),
[router solidify](https://github.com/solid-js/solidify/blob/master/navigation/Router.ts) and
[vue router](https://router.vuejs.org/) API.

## Why another react router

Because manage routes transitions with React is always complicated. This router provide a Stack component who render previous and current page component when new page is requested.

## Components

- `<Router />` Wrap Link and stack component
- `<Link />` Trigg current stack
- `<Stack />` Wrap previous and current page

## Hooks

- `useRouter` Get router instance from any component
- `useLocation` get current location and set new location `[currentRoute.path + setLocationFn()]`
- `useRoutes` get previous and current route `{ previousRoute, currentRoute }`
- `useStack` Register page component in stack

## How it's working

```jsx
// List your routes
const routesList = [
  { path: "/foo", component: FooPage },
  { path: "/bar", component: BarPage },
];

function App() {
  return (
    <Router routes={routesList} base={"/"}>
      <nav>
        <Link href={"/foo"} />
        <Link href={"/bar"} />
      </nav>
      <Stack manageTransitions={manageTransitions} />
    </Router>
  );
}

// manage transitions function is a Stack props
const manageTransitions = ({ previousPage, currentPage }) =>
  new Promise(async (resolve) => {
    if (previousPage) await previousPage.playOut();
    if (currentPage) await currentPage.playIn();
    resolve();
  });
```

In page component:
```jsx
const FooPage = forwardRef((props, handleRef) => {
  const rootRef = useRef(null);
  
  useStack({
    componentName: "FooPage",
    handleRef,
    rootRef,
    // add custom page transitions 
    playIn: () => new Promise(resolve => { 
      gsap.from(rootRef.current, { autoAlpha: 0, onComplete: resolve })  
    }),
    playOut: () => new Promise(resolve => { 
      gsap.to(rootRef.current, { autoAlpha: 0, onComplete: resolve })  
    }),
  });

  return (
    <div className={componentName} ref={rootRef}>
      {componentName}
    </div>
  );
}); 
```

## Example

Install dependencies

```shell
$ npm i
```

Start dev server

```shell
$ npm run dev
```

## Installation

TODO

## Credits

Willy Brauner
