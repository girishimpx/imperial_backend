const { handleError } = require('../../middleware/utils');
const WALLET = require('../../models/wallet');
const { RestClientV5 } = require('bybit-api');



const getSubAccInfo = async (req, res) => {
    try {

const client = new RestClientV5({
  testnet: false,
  key: 'HVPhkizCVOLKz4I2yX',
  secret: 'Gph8gnMlKRpwF4kRwCp3YQPXo806KXz8yDyr',
});

const data =  await client
  .getAccountInfo()
  .then((response) => {
    console.log(response.headers,'HEADDER');
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });

    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { getSubAccInfo };
