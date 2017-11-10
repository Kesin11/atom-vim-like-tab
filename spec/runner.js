/** @babel */

import {createRunner} from 'atom-mocha-test-runner'

module.exports = createRunner({
  // for assign atom instance that build by configDirPath=process.env.ATOM_HOME to global.atom
  globalAtom: false,
  testSuffixes: ['test.js']
})
