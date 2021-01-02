# 🚃 react router

*This repo is WIP*

React router API is inspired by [wouter](https://github.com/molefrog/wouter), 
[router solidify](https://github.com/solid-js/solidify/blob/master/navigation/Router.ts) and 
[vue router](https://router.vuejs.org/) API.

## Why another react router

Because manage routes transitions with React is always f****** complicated. This router provide a Stack component who provide previous and current page component when new page is requested. 

## Components

- `<Router />` Wrap Link and stack component
- `<Link />` Trigg current stack
- `<Stack />` Wrap previous and current page

## Hooks

- `useRouter` Get router instance from any component
- `useLocation` get current location and set new location `[currentRoute.path + setLocationFn()]`
- `useRoutes` get previous and current route `{ previousRoute, currentRoute }`
- `useStack` Register page component in stack

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


## How it's working

TODO


## Credits

Willy Brauner
