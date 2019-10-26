const { PubSub } = require('apollo-server')
const { ObjectId } = require('mongodb')

const ASSET_ADDED = 'ASSET_ADDED'
const ASSET_REMOVED = 'ASSET_REMOVED'

const pubsub = new PubSub()

function prepare (o) {
  o.id = o._id.toString()
  return o
}

module.exports = {
  Query: {
    async assets (parent, args, { db }) {
      const assets = (await db.collection('assets').find({}).toArray()).map(prepare)
      return assets
    }
  },
  Mutation: {
    async addAsset (root, args, { db }) {
      const res = await db.collection('assets').insertOne(args)
      const asset = prepare(res.ops[0])

      pubsub.publish(ASSET_ADDED, {
        assetAdded: asset
      })

      return asset
    },
    async removeAsset (root, { id }, { db }) {
      await db.collection('assets').deleteOne({
        _id: ObjectId(id)
      })

      pubsub.publish(ASSET_REMOVED, {
        assetRemoved: id
      })

      return id
    }
  },
  Subscription: {
    assetAdded: {
      subscribe: () => pubsub.asyncIterator([ASSET_ADDED])
    },
    assetRemoved: {
      subscribe: () => pubsub.asyncIterator([ASSET_REMOVED])
    }
  }
}
