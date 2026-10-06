const mongoose = require("mongoose");
const Todo = require("../models/Todo");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/todos
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/todos
const createTodo = async (req, res) => {
  try {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const todo = await Todo.create({ title });
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/todos/:id
const updateTodo = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    // Only allow known fields to be updated
    const updates = {};
    if (req.body?.title !== undefined) {
      const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
      if (!title) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      updates.title = title;
    }
    if (req.body?.completed !== undefined) {
      if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({ message: "Completed must be true or false" });
      }
      updates.completed = req.body.completed;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted", id: todo._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
