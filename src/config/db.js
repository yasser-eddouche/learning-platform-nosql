// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : Créer un module séparé pour les connexions aux bases de données permet de centraliser la gestion des connexions, de réutiliser le code plus facilement et de faciliter la maintenance.
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : Pour gérer proprement la fermeture des connexions, il est important d'utiliser des gestionnaires d'événements pour détecter les arrêts de l'application et fermer les connexions de manière appropriée.

const { MongoClient } = require("mongodb");
const redis = require("redis");
const config = require("./env");

let mongoClient, redisClient, db;

async function connectMongo() {
  try {
    mongoClient = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoClient.connect();
    console.log("Connected to MongoDB");
    db = mongoClient.db(dbName);
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    setTimeout(connectMongo, 5000);
  }
}

async function connectRedis() {
  try {
    redisClient = redis.createClient({ url: redisUri });
    redisClient.on("error", (err) => console.error("Redis Client Error", err));
    await redisClient.connect();
    console.log("Connected to Redis");
    return redisClient;
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    setTimeout(connectRedis, 5000);
  }
}

// Export des fonctions et clients
module.exports = {
  connectMongo,
  connectRedis,
  getMongoClient: () => mongoClient,
  getRedisClient: () => redisClient,
  getDb: () => db,
};
