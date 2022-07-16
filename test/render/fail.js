// @ts-check
'use strict'

const { test } = require('tapzero')
const TestCommon = require('../../test-common.js')

test('example fail', async t => {
  await TestCommon.create()
  t.fail('example fail')
})
