const { gql } = require('apollo-server')

module.exports = gql`
type Asset {
  id: ID
  brand: String
  model: String
  year: Int
}

type Query {
  assets: [Asset]
}

type Subscription {
  assetAdded: Asset
  assetRemoved: ID
}

type Mutation {
  addAsset(brand: String, model: String): Asset
  removeAsset(id: ID): ID
}
`
