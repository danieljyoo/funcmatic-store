'use strict';

const request = require('funcmatic-request')
const uuidV4 = require('uuid')

class Store {
  constructor(config) {
    this.config = config || {}
    request.setConfig({
      baseURL: `http://${this.config.host}/${this.config.db}/${this.config.collection}`
    })
  }
  
  // POST /db/coll [ { "seq": 1 }, { "seq": 2 }, { "seq": 3 }, { "seq": 4 } ]
  insert(docs, options) {
    if (typeof docs !== 'object' && !Array.isArray(docs)) {
      throw 'Invalid value for insert'
    }
    if (typeof docs === 'object' && !Array.isArray(docs)) {
      docs = [ docs ]  
    }
    for (var i=0; i<docs.length; i++) {
      var doc = docs[i]
      if (!doc["_id"]) {
        doc["_id"] = uuidV4()
      }
    }
    var response = request.post('/', docs)
    var doclinks = response.data['_links']['rh:newdoc']
    var docids = [ ]
    for (var i=0; i<doclinks.length; i++) {
      var splits = doclinks[i].href.split('/')
      docids.push(splits[splits.length-1])
    }
    response.data.insertedIds = docids
    delete response.data['_links']
    return response  
  }
  
  //PATCH /db/coll/*?filter={<filter_query>}
  update(selector, doc, options) {
    if (typeof selector !== 'object') {
      throw 'Invalid selector for update'
    }  
    if (typeof doc !== 'object') {
      throw 'Invalid value for update'
    }
    
    var response = request.patch('/*', doc, {
      params: {
        filter: JSON.stringify(selector)
      }
    })
    return response
  }
  
  find(query, options) {
    options = options || { }
    var keys = options.keys || { }
    var sort = options.sort || { }
    var limit = options.limit || 1000
    var page = options.page || 1
    
    var params = {
      keys: JSON.stringify(keys),
      sort: JSON.stringify(sort),
      page: page,
      pagesize: limit,
      count: true
    }
    
    if (query && Object.keys(query).length > 0) {
      params.filter = JSON.stringify(query)
    }
    
    var response = request.get('/', { params })
    var result = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: {
        docs: response.data["_embedded"],
        returned: response.data["_returned"],
        count: response.data["_size"],
        page: page,
        pages: response.data["_total_pages"],
        pagesize: limit
      }
    }
    return result
  }
  
  //DELETE /db/coll/*?filter={<filter_query>}
  delete(query, options) {
    if (typeof query !== 'object') {
      throw 'Invalid selector for delete'
    }  
    var params = {
      filter: JSON.stringify(query)
    }
    
    var response = request.delete('/*', { params })
    return response
  }
}

var store = new Store({
  host: "dbapi.io",
  db: "db",
  collection: "coll"
})

module.exports = store