function loadTest (AppContainer/*, Tonic*/) {
  const isTest = process.argv.includes('--test')
  if (!isTest) return false

  //
  // We have two bundles, src & test. to avoid duplicate classes
  // shared between two bundles, expose important things as global
  // variables.
  //

  // Reflect.set(window, 'TEST_AppContainer', AppContainer)
  Reflect.set(window, 'TEST_AppContainer', () => {
    return new AppContainer()
  })
  // Reflect.set(window, 'TEST_Tonic', Tonic)

  // add a script tag to the html here
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', 'test.js')

  document.body.appendChild(script)

  return true
}

module.exports = loadTest
