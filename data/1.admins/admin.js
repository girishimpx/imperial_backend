const faker = require('faker')
const ObjectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')

module.exports = [
  {
    name: 'Super Administrator',
    email: 'admin@bet365.com',
    password: bcrypt.hashSync('admin@123', 5),
    role: 'admin',
    verified: false,
    verification: 'RKUHZMSA64X7DCOQ',
    city: 'Bucaramanga',
    country: 'Colombia',
    phone: '123123',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]
