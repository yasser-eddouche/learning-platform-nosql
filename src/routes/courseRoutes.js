// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : Séparer les routes dans différents fichiers permet de mieux organiser le code, de le rendre plus lisible et plus facile à maintenir. Cela permet également de séparer les préoccupations et de faciliter le travail en équipe.
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: Organiser les routes de manière cohérente peut se faire en regroupant les routes par fonctionnalité ou par module.

const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// Routes pour les cours
router.post("/", courseController.createCourse);
router.get("/stats", courseController.getCourseStats);
router.get("/:id", courseController.getCourse);

module.exports = router;
