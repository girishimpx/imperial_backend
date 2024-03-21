const faker = require('faker')
const ObjectID = require('mongodb').ObjectID

module.exports = [  
  {
    source: 'ETH',
    coinname: 'Ethereum',
    chain: 'coin',
    withdraw: 0,
    maxwithdraw: 15,
    minwithdraw: 0.001,
    point_value: 8,
    decimalvalue: 8,
    netfee: 0.00042,
    orderlist: 1,
    image: 'eth.svg',
    url: 'https://etherscan.io/address/',
    status: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]
