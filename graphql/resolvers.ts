import { IResolvers } from '@graphql-tools/utils';
import { GraphQLResolveInfo } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { loggers } from 'winston';
const logger = loggers.get('logger')
const resolvers: IResolvers = {

  Mutation: {
    addLight: async (_, __, context) => {
      logger.info(context)

      // const haLightData: any = await homeAssistantApi.get('/states/light.skyler_room')
      //   .then(({ data }) => data)
      //   .catch(error => {
      //     logger.info(error)
      //   });

      // const light: Light = {
      //   id: Math.floor(Math.random() * 1000),
      //   title: lightInput.title,
      //   interface: lightInput.interfaceInput,
      //   state: {
      //     on: haLightData.state === 'on' ? true : false
      //   }
      // }

      // state.lights.push(light)

      // saveConfig()

      // return light
    }
  },

  Query: {
    lights: (id: number) => {
      return 'ssss'
    }
  },

  Subscription: {
    test: {
      subscribe: (_, __, context) => {
        const { pubsub } = context
        logger.info(_, __, context)
        logger.info('pubsub:', pubsub)
        return pubsub.asyncIterator(['TEST_WORKS'])
      },
    }
  }

}

export default resolvers