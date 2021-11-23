require('dotenv').config()

import Express from 'express'
import WebSocket from 'ws'
import { execute, subscribe } from 'graphql';
const { ApolloServer, gql } = require('apollo-server-express');
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { PubSub } from 'graphql-subscriptions';



const HA_URL: string = process.env.HA_URL || ''
const HA_TOKEN: string = process.env.HA_TOKEN || ''


import schema from '../graphql/schema'
import configHandler from './utils/configHandler'
import HomeAssistant from './home-assistant/HomeAssistant'
import { initial } from 'lodash';

const homeAssistant = true

async function main() {

  const app = Express()

  const httpServer = createServer(app);

  const pubsub = new PubSub()

  const server = new ApolloServer({
    schema,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }]
  })


  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: () => ({ pubsub }),
    },
    { server: httpServer, path: server.graphqlPath }
  );

  await server.start();

  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );

  const config: any = configHandler.init()

  const homeAssistant: HomeAssistant = new HomeAssistant(HA_URL, HA_TOKEN)
  await homeAssistant.connect()
  await homeAssistant.subscribeEntities()

}

main()


