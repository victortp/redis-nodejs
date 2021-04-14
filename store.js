import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient(process.env.REDIS_URL || 6379);

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', error => {
  console.log(error);
});

const get = promisify(client.get).bind(client);
const setex = promisify(client.setex).bind(client);

export default { get, setex };
