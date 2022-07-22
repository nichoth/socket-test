function loadTest (getAppContainer) {
  const isTest = process.argv.includes('--test')

  console.log('***is test***', isTest)

  if (!isTest) return false

  //
  // We have two bundles, src & test. to avoid duplicate classes
  // shared between two bundles, expose important things as global
  // variables.
  //

  Reflect.set(window, 'TEST_AppContainer', getAppContainer())

  // add script tag to the html
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', 'test.js')

  document.body.appendChild(script)

  return true
}

module.exports = loadTest
