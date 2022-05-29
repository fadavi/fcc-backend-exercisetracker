
const id = () => Math.random().toString(32).substr(2)
const users = []
const logs = []

const kLog = Symbol('userId')

function asDate (x) {
  if (x instanceof Date) { return x }
  if (typeof x === 'number') { return new Date(x) }
  if (typeof x !== 'string' || !x) { return new Date() }
  if (/^\d+$/.test(x)) { return new Date(Number(x)) }
  return new Date(x)
}

class User {
  constructor (props) {
    Object.assign(this, props)
    this.log = []
  }

  addExercise (exercise) {
    return this.log.push(exercise)
  }

  getExercise () {
    return this.log.at(-1)
  }

  toJSON ({ withExercise = false } = {}) {
    return {
      _id: this._id,
      username: this.username,
      ...(withExercise ? this.getExercise().toJSON() : null),
    }
  }

  getLog ({ from, to, limit } = {}) {
    const result = this.log

    from &&= asDate(from)
    if (from && !isNaN(from)) {
      result = result.filter(e => e.date >= from)
    }

    to &&= asDate(to)
    if (to && !isNaN(to)) {
      result = result.filter(e => e.date <= to)
    }

    limit &&= Number(limit)
    if (limit && Number.isSafeInteger(limit)) {
      result = result.slice(0, limit)
    }

    return result
  }
}

class Exercise {
  constructor (props) {
    Object.assign(this, props)
  }

  toJSON () {
    return {      
      description: this.description,
      duration: this.duration,
      date: this.date.toDateString(),
    }
  }
}

function createUser ({ username }) {
  const user = new User({
    _id: id(),
    username: String(username),
  })
  
  users.push(user)
  return user
}

function createExercise (userId, { description, duration, date }) {
  const user = findUser(userId)
  if (!user) { return null }
  
  const exercise = new Exercise({
    description: String(description),
    duration: Number(duration),
    date: asDate(date),
  })

  user.addExercise(exercise)
  return exercise
}

function findUser (id) {
  return users.find(u => u._id === id)
}

function getUsers () {
  return users
}

module.exports = {
  createUser,
  createExercise,
  findUser,
  getUsers,
}
