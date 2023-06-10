const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { getAsync: getCounter, setAsync: setCounter } = require('../redis/index')

const COUNTER_KEY = 'created_todos'

router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

router.get('/counter', async (_, res) => {
  const count = parseInt(await getCounter(COUNTER_KEY)) || 0
  res.send({ added_todos: count });
});

router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const currentCounter = parseInt(await getCounter(COUNTER_KEY))
  setCounter(COUNTER_KEY, currentCounter + 1)

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

singleRouter.get('/', async (req, res) => {
  res.send(req.todo)
});

singleRouter.put('/', async (req, res) => {
  const todo = req.todo

  if (req.body.text)
    todo.text =  req.body.text

  if (req.body.done)
    todo.done = req.body.done === 'true'

  todo.save()
  res.send(todo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
