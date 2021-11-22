const typeDefs = /* GraphQL */ `

  type Interface {
    type: String
    address: String
    ref: String
  }

  type Light {
    id: ID!
    title: String
    interface: Interface
    state: LightState
  }

  input InterfaceInput {
    type: String
    address: String
    ref: String
  }

  type LightState {
    on: Boolean
  }

  input LightInput {
    title: String!
    interfaceInput: InterfaceInput
  }

  type Mutation {
    addLight(lightInput: LightInput): Light
  }

  type Query {
    lights(id: ID): [Light]
  }

  type Subscription {
    test: String!
  }

`

export default typeDefs
