# 🚃 react router _(WIP)_

React router API is inspired by [wouter](https://github.com/molefrog/wouter),
[router solidify](https://github.com/solid-js/solidify/blob/master/navigation/Router.ts) and
[vue router](https://router.vuejs.org/) API.

## Why another react router

Because manage routes transitions with React is always complicated, this router is build allow transitions flexibility.
It provides Stack component who render previous and current page component when route change.

## Components

- [`<Router />`](#Router) Wrap Link and stack component
- [`<Link />`](#Link) Trig current stack
- [`<Stack />`](#Stack) Wrap previous and current page

## Hooks

- [`useRouter`](#useRouter) Get router instance from any component
- [`useLocation`](#useLocation) Get current location and set new location `[currentRoute.path + setLocationFn()]`
- [`useRoutes`](#useRoutes) Get previous and current route `{ previousRoute, currentRoute }`
- [`useStack`](#useStack) Register page component in stack

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

## API

### <a name="Router"></a>Router

Create a new router instance.

```jsx
<Router routes={} base={} id={} fakeMode={}>
  // can now use <Link /> and <Stack /> component
</Router>
```

### <a name="Link"></a>Link

Trig new route

params:

- href `string`
- className `string`

example:

```jsx
<Link href={""} className={""} />
```

### <a name="Stack"></a>Stack

Returns previous and current page.

params:

- manageTransitions `()=> void`
- className `string`

example:

```jsx
<Stack manageTransitions={} className={""} />
```

### <a name="useRouter"></a>useRouter()

Get current router instance.

example:

```jsx
const router = useRouter();
```

### <a name="useLocation"></a>useLocation()

returns:

- `location` Get current location
- `setLocation` trig new route

example:

```jsx
const [location, setLocation] = useLocation();
setLocation("/bar");
```

### <a name="useRoutes"></a>useRoutes()

Get previous and current route properties (TRoute)

returns:

- currentRoute `TRoute`
- previousRoute `TRoute`

```js
{
  path: string;
  component: React.ComponentType<any>;
  parser?: Path;
  props?: { [x: string]: any };
  children?: TRoute[];
}
```

example:

```jsx
const { currentRoute, previousRoute } = useRoutes();
```

### <a name="useStack"></a>useStack()

params:

- componentName `string`
- handleRef `MutableRefObject<any>`
- rootRef `MutableRefObject<any>`
- playIn `?() => Promise<any>`
- playOut `?() => Promise<any>`
- isReady `?boolean`

returns:

nothing

example:

```jsx
const useStack({
  componentName, handleRef, rootRef, playIn, playOut, isReady
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
