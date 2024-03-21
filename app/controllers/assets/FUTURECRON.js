const tickers = require("../../models/allTickers");
const { handleError } = require("../../middleware/utils/handleError");

const axios = require("axios");

const AllTickersUpdate = async (req, res) => {
  try {
    let finaldata = [];
    let count = 0;
    // let pair = ["SPOT", "FUTURES", "SWAP"];
    let pair = ["FUTURES"];
    // let pair = ["SPOT"];

    finaldata = [];
    for (let i = 0; i < pair.length; i++) {
      let url;

      if (pair[i] == "FUTURES") {
        url = `https://www.imperialx.exchange/api/v5/public/instruments?instType=${pair[i]}`;
      } else {
        url = `https://www.imperialx.exchange/api/v5/market/tickers?instType=${pair[i]}`;
      }

      axios
        .get(url)
        .then(async (response) => {

          for (let a = 0; a < response.data.data.length; a++) {
            let { alias, lever, instType, instId, last, instFamily } =
              response.data.data[a];

            const updateindb = await tickers.aggregate([
              {
                $unwind: "$data",
              },
              {
                $match: {
                  "data.instFamily": instFamily,
                  "data.alias": alias,
                },
              },
            ]);

            if (updateindb.length > 0) {
              const filter = {
                _id: updateindb[0]._id,
                "data._id": updateindb[0].data._id,
              };
              const update = { $set: { "data.$.instId": instId} };

              await tickers.findOneAndUpdate(filter, update, (err, doc) => {
                if (err) {
                  console.log("Error:", err);
                } else {
                  count = count + 1;

                  if(count == response.data.data.length){
                    // console.log("future updated successfully")
                  }
                }
              });
            }
          }
        })
        .catch((error) => {
          // console.log(error);
        });
    }
  } catch (error) {
    // handleError(res, error);
  }
};

module.exports = { AllTickersUpdate };
