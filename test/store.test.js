const uuidV4= require('uuid')
var sync = require('synchronize')

const store = require('../lib/store')

describe('RESTHeart Operations Test', () => {
  it ('should insert a single document', done => {
    sync.fiber(() => {
      var doc = {
        "hello": "world",
        "foo": "bar"
      }
      
      var result = store.insert(doc)
      expect(result).toMatchObject({
        status: 200,
        data: {
          inserted: 1
        }
      })
      done()
    })
  })
  it ('should insert multiple documents', done => {
    sync.fiber(() => {
      var doc1 = {
        "hello": "world",
        "foo": "bar"
      }
      var doc2 = {
        "hello": "world2",
        "foo": "bar2"
      }
      
      var result = store.insert([ doc1, doc2 ])
      expect(result).toMatchObject({
        status: 200,
        data: {
          inserted: 2
        }
      })
      done()
    })
  })
  it ('should insert and update a document', done => {
    sync.fiber(() => {
      var doc = {
        "hello": "world",
        "foo": "bar"
      }
      
      var result = store.insert(doc)
      
      var docid = result.data.insertedIds[0]
      
      var selector = {
        "_id": docid
      }
      var updateDoc = {
        "foo": "weird",
        "new": "value"
      }
      
      result = store.update(selector, updateDoc)
      expect(result).toMatchObject({
        status: 200,
        data: {
          modified: 1,
          matched: 1
        }
      })
      done()
    })
  })
  it ('should find documents with just query no options', done => {
    sync.fiber(() => {
      var docs = [
        {
          "_id": uuidV4(),
          "key1": "value1",
          "key2": "value2"
        },
        {
          "_id": uuidV4(),
          "key1": "valueA",
          "key2": "valueB"
        }
      ]
      store.insert(docs)
      
      var response = store.find({
        "_id": docs[0]["_id"]
      })
      
      expect(response).toMatchObject({
        status: 200,
        data: {
          returned: 1
        }
      })
      
      done()
    })
  })
  it ('should delete documents using a query', done => {
    sync.fiber(() => {
      var val = uuidV4()
      var docs = [
        {
          "_id": uuidV4(),
          "key1": val,
          "key2": "value2"
        },
        {
          "_id": uuidV4(),
          "key1": val,
          "key2": "valueB"
        }
      ]
      store.insert(docs)
      var query = {
        "key1": val
      }
      var response = store.delete(query)
      expect(response).toMatchObject({
        status: 200,
        data: {
          deleted: 2
        }
      })
      
      var response = store.find(query)
      expect(response).toMatchObject({
        status: 200,
        data: {
          returned: 0
        }
      })
      
      done()
    })
  })
}) 



