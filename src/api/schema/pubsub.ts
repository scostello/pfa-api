import { KafkaPubSub } from 'graphql-kafka-subscriptions';

const defaultConfig = {
  topic: 'events',
  host: process.env.KAFKA_BROKER_LIST || 'kafka-cluster.default.svc',
  port: '9092',
  globalConfig: {},
};

export const fromConfig = (config = defaultConfig) => new KafkaPubSub({ ...config, });

export default fromConfig(defaultConfig);
