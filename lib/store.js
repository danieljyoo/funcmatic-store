'use strict';

const request = require('funcmatic-request')

class Store {
  constructor(config) {
    this.config = config || {}
  }
}

var store = new Store()

module.exports = store