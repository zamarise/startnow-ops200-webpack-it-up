# Webpack Workshop

## Prerequisites

Make sure you download the base project from the Origin App.

Also make sure to install `webpack` globally.

```sh
npm install -g webpack

# You can confirm it's installed by running
webpack -v

# output
# 3.5.1
```

## Overview

We're going to use a tool called `webpack` to bundle and compile (or transpile) multiple javascript and React files into a single file that can be pulled into an HTML file.

### What is Webpack?

> `webpack` is a module bundler for modern JavaScript applications. When `webpack` processes your application, it recursively builds a dependency graph that includes every module your application needs, then packages all of those modules into a small number of bundles - often only one - to be loaded by the browser.

This allows us to split programs and logic into multiple files. As well as use code, or modules, authored by other developers and teams. The process of making into one file is usually referred to as **module bundling** or just bundling.

`webpack` also allows us to transform files as it puts them together through tools called **loaders**. This is most commonly used for transforming newer ES6 code into the more compatible ES5 syntax. And for transforming JSX in React files into regular javascript.

## Getting Started

Don't forget to run `npm install`.

### Basic Setup

Let's review the project files.

#### File Structure
```git
  startnow-ops200-webpack-workshop
  |- package.json
  |- public/
    |- index.html
    |- demo.js
```

The `public/` directory will be used to serve our files. Any static files (files that won't be generated) we can place in `public/`. Any built or generated files will be placed in `dist/`, more on that later.

Inside of `public/` we have an `demo.js` that relies on jQuery, and a simple html file, that loads both jQuery and the `demo.js` file.

#### public/demo.js

```js
// append the text to the root div
$('#root').text('Demo is Working!');
```

#### public/index.html
```html
<html>
  <head>
    <title>Getting Started</title>
    <script src="https://unpkg.com/jquery@3.2.1"></script>
  </head>
  <body>
    <div id="root"></div>
    <script src="demo.js"></script>
  </body>
</html>
```

With this example there is implicit dependency between the `<script>` tags. Our `demo.js` file depends on `jQuery` being included in the page before it runs. This is because `demo.js` never declared a need for `jQuery`, it just assumes that the global variable `$` exists.

This causes a few issues:
- It's not immediately apparent that `demo.js` is dependant on an external library.
- If a dependency is missing or in loaded in the wrong order the page may break.
- We could be including dependencies we not need, increasing the load time of the site.

Now let's see how we can use `webpack` to solve these issues for this example.

### Creating A Bundle

First, we need to change the directory structure, separating the "source" code from the "distribution" code. The "source" code will go in `src/`and will contain all the code we'll write and edit. The "distribution" code will go in `dist/` and hold the output from the build process.

#### File Structure
```git
  startnow-ops200-webpack-workshop
  |- package.json
+ |- dist/
+ |- src/
+   |- index.js
  |- public/
    |- index.html
    |- demo.js
```

Inside of `src/` we'll create a new `index.js` and we'll make sure to import the library from the `index.js` file instead of the `index.html`.

#### src/index.js
```js
import $ from 'jquery';
// var $ = require('jquery');

$('div').text('Webpack is working!');

```

This file represents the **entry point**. This is the only file that we will have `webpack` load directly, from here every other module must be loaded by using the special `import` syntax, which is very similar to the `require` used in Node as shown in the commented line.

Another similarity to node is that we'll need to use `npm` to install these external libraries.
> Note: Not all libraries on `npm` will run in the browser, `express` for example runs in node exclusively and `jquery` is made for the browser. It is up to you as a developer to read about the packages, usually through the [npmjs.com website](https://www.npmjs.com)

#### installing jquery

```sh
# Note that jquery is all lower case
# the package "jQuery" is deprecated
npm install jquery
```

Now since we'll be bundling our scripts, we have to update the `index.html` to only have one `<script>` tag.

#### public/index.html
```html
<html>
  <head>
    <title>Getting Started</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

In this setup `index.js` explicitly requires `jquery` to be present. By stating what dependencies a module needs, webpack can use this information to generate an optimized bundle where scripts will be executed in the correct order.

Let's run webpack to get actually generate the file.

#### webpack
```sh
$ webpack src/index.js dist/bundle.js

Hash: 77faeab8663c2f5c2ab5
Version: webpack 3.5.1
Time: 578ms
    Asset    Size  Chunks                    Chunk Names
bundle.js  543 kB       0  [emitted]  [big]  main
   [0] ./src/index.js 95 bytes {0} [built]
   [1] multi ./src/index.js ./src/index.js ./dist/bundle.js 52 bytes {0} [built]
   [3] ./dist/bundle.js 272 kB {0} [built]
    + 1 hidden module
```
> Note: output should look similar to this, but it doesn't have to be exact.

In the command you can see the first argument `src/index.js` is the **entry point**, and the last argument `dist/bundle.js` is the **output**

Now when you load the page, you should see "Webpack is working!" and if you open the dev tools you'll see only one file was downloaded.

#### Modules

The `import` and `export` statements have been standardised in ES6. Although they are not supported in most browsers yet, webpack does support them out of the box. `webpack` actually "transpiles" the code behind the scenes so that older browsers can also run it.
> Note: By default webpack will not alter any code other than `import` and `export` statements.

#### Using a Configuration File

Most projects will need a more complex setup, which is why webpack supports a configuration file. This is much more efficient than having to type in a lot of commands in the terminal, so let's create one to replace the command used above.

Create `webpack.config.js` file at the root of the project.

#### File Structure
```git
  startnow-ops200-webpack-workshop
  |- package.json
+ |- webpack.config.js
  |- dist/
  |- src/
    |- index.js
  |- public/
    |- index.html
    |- demo.js
```

####  webpack.config.js
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

Now we can run the same process, but instead of placing the extra arguments. We can just use a much more simple command from the project root.

```sh
webpack

Hash: a80dabce0cd4e8660676
Version: webpack 3.5.1
Time: 291ms
    Asset    Size  Chunks                    Chunk Names
bundle.js  271 kB       0  [emitted]  [big]  main
   [0] ./src/index.js 98 bytes {0} [built]
    + 1 hidden module
```
> Note: output should look similar to this, but it doesn't have to be exact.

If a `webpack.config.js` is present, the `webpack` command picks it up by default. We use the `--config` option here only to show that you can pass a config of any name. This will come in useful for more complex configurations that need to be split into multiple files.

A configuration file allows far more flexibility than simple CLI usage. We can specify loader rules, plugins, resolve options and many other enhancements this way.

#### NPM Scripts

Given it's not particularly best practice to run a local copy of webpack from the CLI, we can set up a little shortcut. Let's adjust our `package.json` by adding an npm script:

#### package.json
```json
{
  ...
  "scripts": {
    "build": "webpack"
  },
  ...
}
```

Now the `npm run build` command can be used in place of the longer commands we used earlier. Note that within `scripts` we can reference locally installed npm packages by name instead of writing out the entire path. This convention is the standard in most npm-based projects and allows us to directly call `webpack`, instead of `./node_modules/.bin/webpack`

Now run the following command and see if your script alias works:

```sh
npm run build

> startnow-ops200-webpack-workshop@1.0.0 build /Users/gus/projects/oca/startnow-ops200-webpack-workshop
> webpack

Hash: a80dabce0cd4e8660676
Version: webpack 3.5.1
Time: 316ms
    Asset    Size  Chunks                    Chunk Names
bundle.js  271 kB       0  [emitted]  [big]  main
   [0] ./src/index.js 98 bytes {0} [built]
    + 1 hidden module
```

## Working with React

Now that we have webpack working let's modify our config to be able to transform and bundle JSX React files.

In order to have webpack read and transform JSX we'll need to install and configure a webpack loader. A loader modifies individual files as they're being read and linked to other files.

  For React and the JSX we'll be using `babel-loader`.

#### Installing packages

```sh
npm install --save-dev react react-dom babel-loader babel-core babel-preset-env babel-preset-react babel-preset-stage-3
```

As a special case for the `babel-loader` package, the underlying tool `babel` requires it's own json-like configuration file called `.babelrc`. Remember it's intentionally missing anything before the `.` and it's filename is only a file extension.

Let's create it, for now we just need the `react` and `stage-3 ` preset, so that tool defaults to transforming react and some new js features.

#### .babelrc
```json
{
  "presets": ["react", "stage-3"]
}
```

And let's update the `webpack.config.js` files to use the new `babel-loader`.

#### webpack.config.js
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
```


We'll update the source file to use React.

#### src/index.js
```js
import React from 'react';
import ReactDOM from 'react-dom';

const rootElement = document.getElementById('root');
const sampleComponent = <div>React and webpack are working!</div>;

ReactDOM.render(sampleComponent, rootElement);

```

Great now we should have a page rendering using the react library.


## Production

The current setup is fine for when we're developing, but we need to make some modifications for pushing our code into a production environment. There are some easy optimizations that webpack can make for us.

### The Simple Way

The easiest way to run webpack in production mode

```sh
webpack -p

# which would be the same as running
webpack --optimize-minimize --define process.env.NODE_ENV="'production'"
```

#### Minification

The main optimization is minification, which the process of taking your code and removing all unnecessary parts.
This can range from removing all spaces and new lines, to renaming variables and functions to use less characters. The code usually becomes extremely hard to read and decipher but will run just as well, since a computer doesn't have to worry about names and functions making sense in english.

#### Source Maps
Now we need to create a *Source Map* file that can translate all the gibberish code back into readable code.
This will allow us to properly debug our code.

We can add a simple option into our webpack configuration for this.

#### webpack.config.js
```js
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
```

Now instead of seeing a single file in the source panel

![Devtools without source map](https://i.imgur.com/m3l0C3L.png)

You shoud see an entire directory matching your own

![Devtools with source map](https://i.imgur.com/Fb649c1.png)


## Exit Criteria

 - Make sure all tests pass

