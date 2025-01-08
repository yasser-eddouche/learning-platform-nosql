// Question: Pourquoi créer des services séparés ?
// Réponse: Créer des services séparés permet de structurer le code de manière modulaire, de réutiliser les fonctions utilitaires à travers l'application, et de faciliter la maintenance et les tests.

const { ObjectId } = require("mongodb");

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }
    const objectId = ObjectId.createFromHexString(id);
    const result = await collection.findOne({ _id: objectId });
    return result;
  } catch (error) {
    console.error("Error finding document by ID:", error);
    throw error;
  }
}

async function insertOne(collection, data) {
  try {
    const result = await collection.insertOne(data);
    return result;
  } catch (error) {
    console.error("Error inserting document:", error);
    throw error;
  }
}

// Export des services
module.exports = {
  findOneById,
  insertOne,
};
