#!/usr/bin/env node
const { spawn } = require('node:child_process');
const run = require('comandante')
const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)

const configFile = fs.readFileSync(path.resolve(args[0], 'ssc.config'),
    'utf8')

const config = Object.fromEntries(configFile
  .split('\n')
  .filter((line) => line.length && !/^#/.test(line))
  .map((line) => line.split(/:(.*)$/).map(s => s.trim()))
)

const sscCmd = spawn('ssc', ['compile', args[0]])

// TODO -- handle more cases of platform
let dir = ''
switch (process.platform) {
    case 'darwin':
        dir = 'MacOS'
}

sscCmd.on('exit', () => {
    // now run the tests
    // './dist/TestExample-dev.app/Contents/MacOS/test-example-dev'

    // TODO -- why is '-dev' appended to the end of the executable name???
    
    // TODO -- can use ssc command to print the dir instead of constructing
    //   a string like we are doing here

    const exeName = config.executable
    
    run('./dist/TestExample-dev.app/Contents/' + dir + '/' + exeName + '-dev',
        ['--test'])
        .pipe(process.stdout)
})
