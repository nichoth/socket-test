function loadTest (AppContainer, Tonic) {
  //
  // We have two bundles, src & test. to avoid duplicate classes
  // shared between two bundles, expose important things as global
  // variables.
  //
  Reflect.set(window, 'TEST_AppContainer', AppContainer)
  Reflect.set(window, 'TEST_Tonic', Tonic)

  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', 'test.js')

  document.body.appendChild(script)
}

module.exports = loadTest
