const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const dao = require('./dao')

require('dotenv').config()

const notFound = res => res.status(404).jsonp({ error: 'Resource Not Found' })
const app = express()

app.use(cors())
app.use(bodyParser())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', function createUserHandler (req, res) {
  const { username } = req.body
  const user = dao.createUser({ username })

  res.status(201).jsonp(user)
})

app.get('/api/users', function allUsersHandler (_, res) {
  res.jsonp(dao.getUsers())
})

app.post('/api/users/:userId/exercises', function addExerciseHandler (req, res) {
  const { description, duration, date } = req.body
  const { userId } = req.params

  const exercise = dao.createExercise(userId, { description, duration, date })
  if (!exercise) { return notFound(res) }
  
  const user = dao.findUser(userId)
  if (!user) { return notFound(res) }
  
  res.status(201).jsonp(user.toJSON({ withExercise: true }))
})

app.get('/api/users/:userId/logs', function getLogs (req, res) {
  const { from, to, limit } = req.query
  const { userId } = req.params

  const user = dao.findUser(userId)
  if (!user) { return notFound(res) }

  const log = user.getLog({ from, to, limit }) ?? []
  res.jsonp(log)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
