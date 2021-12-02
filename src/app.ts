require('dotenv').config()


import Express from 'express'
import WebSocket from 'ws'
import { execute, subscribe } from 'graphql';
const { ApolloServer, gql } = require('apollo-server-express');
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { PubSub } from 'graphql-subscriptions';
import './utils/logger'
import {loggers} from 'winston'

const HA_URL: string = process.env.HA_URL || ''
const HA_TOKEN: string = process.env.HA_TOKEN || ''

import schema from '../graphql/schema'
import HomeAssistant from './home-assistant/HomeAssistant'
import Store from './store';

const homeAssistant = true

const logger = loggers.get('logger')


async function main() {

  const app = Express()

  //add Winston logging as middleware to express
  app.use( (req, res, done) => {
    logger.debug(req.originalUrl);
    done();
});
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
    logger.info(`Server is now running on http://localhost:${PORT}/graphql`)
  );


  const store: any = new Store('../config.json')
  await store.loadConfig()

  // const homeAssistant: HomeAssistant = new HomeAssistant(HA_URL, HA_TOKEN)

  // homeAssistant.subscribeStore(store)

  // await homeAssistant.connect()
  // await homeAssistant.stateInit()

}

main()


