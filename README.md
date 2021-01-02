# 🚃 react router _(WIP)_

React router API is inspired by [wouter](https://github.com/molefrog/wouter),
[router solidify](https://github.com/solid-js/solidify/blob/master/navigation/Router.ts) and
[vue router](https://router.vuejs.org/) API.

## Why another react router

Because manage routes transitions with React is always complicated, this router is build allow transitions flexibility.
It provides Stack component who render previous and current page component when route change.

## Components

- `<Router />` Wrap Link and stack component
- `<Link />` Trig current stack
- `<Stack />` Wrap previous and current page

## Hooks

- `useRouter` Get router instance from any component
- `useLocation` Get current location and set new location `[currentRoute.path + setLocationFn()]`
- `useRoutes` Get previous and current route `{ previousRoute, currentRoute }`
- `useStack` Register page component in stack

## Simple usage

```jsx
// create a route object
const routesList = [
  { path: "/foo", component: FooPage },
  { path: "/bar", component: BarPage },
];

// wrap render with <Router /> component
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

Page component need to be wrap by `React.forwardRef`. The `handleRef` allow to handle transitions, ref, etc. used by `<Stack />` component.

```jsx
const FooPage = forwardRef((props, handleRef) => {
  const componentName = "FooPage";
  const rootRef = useRef(null);

  // create custom page transitions (example with GSAP)
  const playIn = () => {
    return new Promise((resolve) => {
      gsap.from(rootRef.current, { autoAlpha: 0, onComplete: resolve });
    });
  };
  const playOut = () => {
    return new Promise((resolve) => {
      gsap.to(rootRef.current, { autoAlpha: 0, onComplete: resolve });
    });
  };

  // register page transition properties used by Stack component
  useStack({ componentName, handleRef, rootRef, playIn, playOut });

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
