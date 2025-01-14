const { ObjectId } = require("mongodb");
const db = require("../config/db");
const mongoService = require("../services/mongoService");
const redisService = require("../services/redisService");

async function createStudent(req, res) {
  try {
    const studentData = req.body;
    const result = await mongoService.insertOne(
      db.getDb().collection("students"),
      studentData
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllStudents(req, res) {
  try {
    const students = await db.getDb().collection("students").find().toArray();
    res.status(200).json(students);
  } catch (error) {
    console.error("Error getting students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getStudentById(req, res) {
  try {
    const studentId = req.params.id;

    const cachedStudent = await redisService.getData(`student:${studentId}`);
    if (cachedStudent) {
      return res.status(200).json(cachedStudent);
    }

    const student = await mongoService.findOneById(
      db.getDb().collection("students"),
      studentId
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await redisService.cacheData(`student:${studentId}`, student, 3600); // Cache for 1 hour
    res.status(200).json(student);
  } catch (error) {
    console.error("Error getting student by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateStudent(req, res) {
  try {
    const studentId = req.params.id;
    if (!ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const updateData = req.body;
    const result = await db
      .getDb()
      .collection("students")
      .updateOne({ _id: new ObjectId(studentId) }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Invalidate cache
    await redisService.deleteData(`student:${studentId}`);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteStudent(req, res) {
  try {
    const studentId = req.params.id;
    if (!ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const result = await db
      .getDb()
      .collection("students")
      .deleteOne({ _id: new ObjectId(studentId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Invalidate cache
    await redisService.deleteData(`student:${studentId}`);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
