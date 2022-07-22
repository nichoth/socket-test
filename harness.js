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

    // /**
    //  * Wait for an async render() to hopefully complete.
    //  */
    await sleep(1)
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
  }
}

module.exports = TestHarness












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
