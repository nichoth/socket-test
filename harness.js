// @ts-check
'use strict'

const { system } = window

const stringify = require('json-stringify-safe')
const sleep = require('./sleep')

class TestHarness {
  static async create () {
    const c = new TestHarness()
    await c.bootstrap()
    return c
  }

  constructor () {
    this.container = null
  }

  async bootstrap () {
    this.patchConsole()

    /**
     * AppContainer is the appContainer component created by the app process
     * and assigned to window
     */
    const AppContainer = Reflect.get(window, 'TEST_AppContainer')

    this.container = new AppContainer()
    this.container.id = 'app-container'

    document.body.appendChild(this.container)

    /**
     * Wait for an async render() to hopefully complete.
     */
    await sleep(1)
  }

  close () {
    if (this.container && document.body.contains(this.container)) {
      document.body.removeChild(this.container)
    }

    this.container = null
  }

  patchConsole () {
    // eslint-disable-next-line
    console.log = (...args) => {
      system.send({
        api: 'ssc-node',
        method: 'testConsole',
        arguments: [{
          args: stringify(args)
        }]
      })
    }

    window.addEventListener('error', handleWindowError)
    window.addEventListener('unhandledrejection', handleWindowUnhandled)
  }
}

module.exports = TestHarness



/**
 * @param {ErrorEvent} event
 */
function handleWindowError (event) {
  const err = {
    message: (event.error || event).message,
    stack: (event.error || event).stack
  }

  system.send({
    api: 'ssc-node',
    method: 'testUncaught',
    arguments: [{
      err: err,
      type: 'error'
    }]
  })
}


/**
 * @param {PromiseRejectionEvent} event
 */
function handleWindowUnhandled (event) {
  const err = {
    message: event.reason.message || event.reason,
    stack: event.reason.stack
  }

  system.send({
    api: 'ssc-node',
    method: 'testUncaught',
    arguments: [{
      err: err,
      type: 'unhandledrejection'
    }]
  })
}







// const stringify = require('json-stringify-safe')
// const sleep = require('./sleep')

// const system = window.system

// class TestHarness {
//     constructor () {
//         this.container = null
//     }

//     async bootstrap () {
//         /**
//          * AppContainer is the appContainer component created by the app process
//          * and assigned to window
//          */
//         const AppContainer = Reflect.get(window, 'TEST_AppContainer')

//         this.container = new AppContainer()
//         this.container.id = 'app-container'

//         document.body.appendChild(this.container)

//         // /**
//         //  * Wait for an async render() to hopefully complete.
//         //  */
//         await sleep(1)
//     }

//     patchConsole () {
//         console.log = (...args) => {
//             system.send({
//                 api: 'ssc-node',
//                 method: 'testConsole',
//                 arguments: [{
//                     args: stringify(args)
//                 }]
//             })
//         }
//     }

//     close () {
//         system.send({
//             api: 'app',
//             method: 'exit',
//             arguments: []
//         })
//     }
// }

// module.exports = TestHarness
