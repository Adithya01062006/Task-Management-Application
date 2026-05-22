const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');

// In-memory task store (replace with DB in production)
const tasks = [];

router.use(auth);

router.get('/', (req, res) => {
  res.json(tasks.filter((t) => t.userId === req.user.id));
});

router.post('/', (req, res) => {
  const { title, description, status = 'todo', priority = 'medium' } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const task = { id: uuidv4(), userId: req.user.id, title, description, status, priority, createdAt: new Date().toISOString() };
  tasks.push(task);
  req.app.locals.broadcast({ type: 'TASK_CREATED', task });
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id && t.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...req.body, id: tasks[idx].id, userId: tasks[idx].userId };
  req.app.locals.broadcast({ type: 'TASK_UPDATED', task: tasks[idx] });
  res.json(tasks[idx]);
});

router.delete('/:id', (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id && t.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  const [removed] = tasks.splice(idx, 1);
  req.app.locals.broadcast({ type: 'TASK_DELETED', id: removed.id });
  res.json({ success: true });
});

module.exports = router;
