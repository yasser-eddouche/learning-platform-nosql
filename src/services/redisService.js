// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : Pour gérer efficacement le cache avec Redis, il est important de définir des TTL (Time-To-Live) appropriés pour les données mises en cache, d'invalider le cache lorsque les données sous-jacentes changent, et de surveiller les performances et l'utilisation de la mémoire de Redis. Utiliser des stratégies de cache comme le cache-aside, write-through, ou write-back peut également aider à maintenir la cohérence des données.
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Les bonnes pratiques pour les clés Redis incluent l'utilisation de noms de clés descriptifs et hiérarchiques, l'utilisation de préfixes pour regrouper les clés par fonctionnalité ou module, et l'évitement des clés trop longues ou trop courtes.

const redis = require("redis");
const client = redis.createClient({ url: process.env.REDIS_URI });

client.on("error", (err) => console.error("Redis Client Error", err));

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl) {
  try {
    await connectRedis();
    await client.set(key, JSON.stringify(data), { EX: ttl });
    console.log(`Data cached with key: ${key}`);
  } catch (error) {
    console.error("Error caching data:", error);
    throw error;
  }
}

async function getData(key) {
  try {
    await connectRedis();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting cached data:", error);
    throw error;
  }
}

async function deleteData(key) {
  try {
    await connectRedis();
    await client.del(key);
    console.log(`Data deleted with key: ${key}`);
  } catch (error) {
    console.error("Error deleting cached data:", error);
    throw error;
  }
}

module.exports = {
  cacheData,
  getData,
  deleteData,
  connectRedis,
};
