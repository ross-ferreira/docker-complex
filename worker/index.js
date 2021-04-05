const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// any time we recieve a message run this message, 2nd arg is a function
// sub is Redis method
sub.on('message', (channel, message) => {
	// hset means hash
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');