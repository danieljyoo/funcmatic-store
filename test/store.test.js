var sync = require('synchronize')

const store= require('../lib/store')

describe('Basic DB Test', () => {
  it ('should do something', done => {
    sync.fiber(() => {
      done()
    })
  })
}) 



