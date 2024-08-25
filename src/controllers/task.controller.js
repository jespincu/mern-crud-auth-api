import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id}).populate('userId');
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('userId');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const newTask = new Task({ 
        title, 
        description, 
        date,
        completed: false,
        createdAt: new Date(),
        userId: req.user.id
    });
    const taskSaved = await newTask.save();

    res.status(201).json({
        message: 'Task saved successfully',
        data: {
            id: taskSaved._id,
            title: taskSaved.title,
            description: taskSaved.description,
            date: taskSaved.date,
            completed: taskSaved.completed,
            userId: taskSaved.userId,
            createdAt: taskSaved.createdAt,
        }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTask = async (req, res) => {
    try {
      console.log(req.body);
      const task = await Task.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true });
        
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
};

export const deleteTask = async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.sendStatus(204);
      /* res.json({ 
        message: "Task deleted successfully",
        data: {
            id: task._id,
            title: task.title,
            description: task.description,
            date: task.date,
            completed: task.completed,
            userId: task.userId,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        }
      }); */
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  
};
