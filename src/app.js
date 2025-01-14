// Question: Comment organiser le point d'entrée de l'application ?
// Réponse : Le point d'entrée de l'application doit initialiser les connexions aux bases de données, configurer les middlewares, monter les routes et démarrer le serveur.
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
// Réponse : La meilleure façon de gérer le démarrage de l'application est d'utiliser une fonction asynchrone pour gérer les connexions aux bases de données et les erreurs, et de s'assurer que toutes les ressources sont correctement fermées lors de l'arrêt de l'application.

const express = require("express");
const config = require("./config/env");
const db = require("./config/db");

const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

async function startServer() {
  try {
    await db.connectMongo();
    await db.connectRedis();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/courses", courseRoutes);
    app.use("/students", studentRoutes);
    // Démarrer le serveur
    const port = config.port;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  // Implémenter la fermeture propre des connexions
  if (mongoClient) {
    await mongoClient.close();
    console.log("MongoDB connection closed");
  }
  if (redisClient) {
    await redisClient.quit();
    console.log("Redis connection closed");
  }
  process.exit(0);
});

startServer();
