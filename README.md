# React code challenge

A small React app that loads posts from [JSONPlaceholder](https://jsonplaceholder.typicode.com/) and filters their titles as you type.

[Wan Yau](https://github.com/WanCodes)

## What it does

Opening the app sends `GET https://jsonplaceholder.typicode.com/posts` and stores the JSON body. The endpoint returns 100 posts. Each post has `userId`, `id`, `title`, and `body`. The page shows a text field and an unordered list of titles.

The field is a controlled input. Each keystroke filters the posts already in memory with `title.includes(searchTerm)`:

- The query is a case-sensitive substring.
- An empty field matches every title, because every string contains the empty string.
- Titles in the current JSONPlaceholder fixture are lowercase. The substring `sunt` matches 7 of the 100 titles. `Sunt` matches none.

Each list item uses `post.id` as its React key. The list renders `title` only. `userId` and `body` stay on the objects in state. Until the response arrives, the list is empty. The document title in `public/index.html` is `React App`.

## Exercise

The brief is a short Create React App task:

1. Request `https://jsonplaceholder.typicode.com/posts` and keep the data.
2. Render an unordered list of titles.
3. Add an input that filters by title.

All three live in `src/containers/Books/Books.js`. `App` only mounts that screen.

## Stack

| Package | Version | Role |
| --- | --- | --- |
| [react](https://reactjs.org/) | 16.8.4 | UI. Class components, local `state`. |
| react-dom | 16.8.4 | `ReactDOM.render` into `#root`. |
| [react-scripts](https://github.com/facebook/create-react-app) | 2.1.8 | Create React App toolchain: Webpack 4.28.3, Babel 7, Jest 23.6. Declares Node.js `>= 8.10`. |
| [axios](https://github.com/axios/axios) | 0.18.0 | HTTP client for the posts request. |

UI state lives on the `Books` class. Styling is `src/App.css` and `src/index.css`. ESLint extends `react-app` (ESLint 5, via `react-scripts`).

`axios@0.18.0` is the version this repo installs. That release is deprecated; axios 0.21.1 later fixed a critical vulnerability in older axios. npm warns about it during install.

## Layout

```
public/index.html          HTML shell. Title "React App". Mount node #root.
public/manifest.json       Default Create React App manifest.
src/index.js               Renders <App>. Calls serviceWorker.unregister().
src/App.js                 Renders <Books> inside div.App.
src/containers/Books/Books.js
src/App.test.js            Mounts <App> and unmounts it.
src/App.css                Centers .App. Logo and header rules are unused.
src/index.css              System font on body.
src/serviceWorker.js       Create React App helper. index.js leaves it unregistered.
```

## How the screen works

`Books` starts with `books: []` and `searchTerm: ""`.

`componentDidMount` calls `loadData`, which runs `axios.get('https://jsonplaceholder.typicode.com/posts')`. The success handler logs the full axios response (`console.log(res)`, so the browser console shows status, headers, config, and data) and stores `res.data` on `books`. That promise has a success handler only. A rejection leaves `books` as `[]` and surfaces as an unhandled rejection. There is no loading flag and no error message.

The input is `value={searchTerm}`. `onChange` saves `event.target.value`. The element has no label, placeholder, or explicit `type`, so the browser treats it as text. Render filters with `book.title.includes(this.state.searchTerm)` and maps matches to `<li key={book.id}>`. Changing the query does not send another request.

`div.App` is `text-align: center`. Production builds do not register a service worker, so they do not cache the shell for offline use.

## Run

Requirements: Node.js 8.10 or newer, npm, and network access to `jsonplaceholder.typicode.com` when you open the UI. The test does not assert on that response.

Node.js 17 and later use OpenSSL 3. Webpack 4 (used by `npm start` and `npm run build` in react-scripts 2.1.8) requests an MD4 hash, which OpenSSL 3 refuses:

```
Error: error:0308010C:digital envelope routines::unsupported
```

Prefix those two scripts with `NODE_OPTIONS=--openssl-legacy-provider`. `npm test` does not need it.

Checked on Node.js 22.23.4 and npm 10.9.9: `npm install` and the test command below succeeded as written. `npm start` failed with the error above until the legacy provider was set, then compiled and served the app. `npm run build` compiled with the same variable.

### Install

From the repository root:

```bash
npm install
```

On this Linux setup, `npm install` finishes and prints an old-lockfile notice plus deprecation warnings (including the axios warning). npm 10 rewrites `package-lock.json` from lockfileVersion 1 to lockfileVersion 3. The dependency versions stay the same. The committed lockfile is the original version 1 file.

`npm ci` on the same machine exits `EBADPLATFORM`: the lockfile pins optional `fsevents@1.2.7` for `darwin`, and npm 10 treats that platform mismatch as a failed clean install. `npm install` is the command that completes here.

### `npm start`

Development server at [http://localhost:3000](http://localhost:3000). The page reloads when you save a source file.

On Node.js 17 and later:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

PowerShell:

```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"; npm start
```

### `npm test`

Jest 23 in interactive watch mode. `src/App.test.js` is the only test. It creates a `div`, renders `<App>` into it, and unmounts. Mounting `<App>` mounts `Books`, so the test fires the real posts request. It does not mock axios, wait for titles, or exercise the filter.

One non-interactive run:

```bash
CI=true npm test -- --watchAll=false
```

On Node.js 22.23.4 that reported 1 passed suite and 1 passed test.

### `npm run build`

Writes a minified, hashed bundle to `build/`. On Node.js 17 and later:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

The build compiled on Node.js 22 with that variable. react-scripts also prints a non-blocking warning that its bundled `caniuse-lite` data is outdated. `homepage` is unset, so the build expects to be hosted at the server root. `build/` is gitignored.

### `npm run eject`

Copies the Create React App configuration into the repo. The operation is one-way. Running and testing this app does not require it.

Further toolchain reference for this generation of the tool: [Create React App getting started](https://create-react-app.dev/docs/getting-started/).

## Browser targets

From `browserslist` in `package.json`:

```
>0.2%
not dead
not ie <= 11
not op_mini all
```

## Implementation details

- The component is named `Books`. The payload is posts.
- A successful fetch logs the entire axios response to the browser console.
- `src/App.css` still has the Create React App logo animation and header rules. The rule that affects the page is `.App { text-align: center; }`.
