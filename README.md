# socket test

How do I test the application I'm making?

There are **two key elements** -- the path you choose for building the tests, and the arugments you call the final application with. You must must build the tests to the right path, and you must call the compiled program with an argument,
```
--test=1
```

## install

```
npm i -D @nichoth/socket-test
```

## Write some tests
You must build this file to the right path, and call [loadTest](#call-load-test-in-application-code) in the app code.

```js
// test/render/index.js
const { test } = require('tapzero')
const TestCommon = require('@nichoth/socket-test/test-common.js')

test('app-container exists', async (t) => {
  const common = await TestCommon.create()
  // `container` is whatever you passed in to `loadTest` in the
  // application code
  const container = common.container

  t.ok(container, 'the container exists')
  // ...
})
```

## call `load-test` in application code
`load-test.js` should be called in your appliceation code

**Note that this depends on the [build step](#1---build-the-application-and-tests). You must build the tests with a target of path.join(target, 'test.js')**

```js
const loadTest = require('@nichoth/socket-test/load-test')

class AppContainer extends Tonic {
    // ...
}

window.onload = () => {
  const app = new AppContainer()
  app.id = 'root'
  document.body.appendChild(app)
  loadTest(AppContainer)
}
```

## use the tests

### 1 - build the application and tests
Create a build script that will compile your app and also the tests

**Note that the tests depend on the target path defined here. You must build the tests with a target of `path.join(target, 'test.js')`**

```js
// in build.js (your build script) ...
  const target = path.resolve(process.argv[2]);

  // build tests
  await esbuild.build({
    entryPoints: ['test/render/index.js'],
    bundle: true,
    keepNames: true,
    // target is something like `dist/TestExample-dev.app/Contents/Resources`
    outfile: path.join(target, 'test.js'),
    platform: 'browser'
  })

  // build app
  await esbuild.build({
    entryPoints: ['src/render/index.js'],
    bundle: true,
    keepNames: true,
    // minify: true,
    outfile: path.join(target, 'render.js'),
    platform: 'browser'
  })
```

### 2 - reference the build script in `ssc.config`
```
#
# Build Settings
#
input: src
build: node build.js
output: dist
executable: test-example
linux_icon: src/icons/icon.png
mac_icon: src/icons/icon.icns
win_icon: src/icons/icon.ico

```

### 3 - compile the app
```
ssc compile .
```

### 4 - run tests

**Note the argument passed in: `--test=1`**

```
./dist/TestExample-dev.app/Contents/MacOS/test-example-dev --test=1
```
