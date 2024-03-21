const tickers = require("../../models/allTickers");
const { handleError } = require("../../middleware/utils/handleError");
const axios = require("axios");

const allTickers = async (req, res) => {
  try {
    let finaldata = [];
    let count = 0;
    let pair = ["SPOT", "FUTURES", "SWAP"];
    // let pair = ["FUTURES"];
    // let pair = ["SPOT"];


    finaldata = [];
    for (let i = 0; i < pair.length; i++) {
      let url

      finaldata = [];
      for (let i = 0; i < pair.length; i++) {
        let url

        if (pair[i] == "FUTURES") {
          url = `https://www.imperialx.exchange/api/v5/public/instruments?instType=${pair[i]}`
        } else {
          url = `https://www.imperialx.exchange/api/v5/market/tickers?instType=${pair[i]}`
        }

        axios.get(url)
          .then((response) => {
            for (let a = 0; a < response.data.data.length; a++) {
              let { alias, lever, instType, instId, last, instFamily } = response.data.data[a];
              let updatedate = { instType, instId, last: last ? last : "", alias: alias ? alias : "", lever: lever ? lever : "", instFamily: instFamily ? instFamily : "" };
              finaldata = finaldata.concat(updatedate);
            }
            count = count + 1
            if (count == pair.length) {

              tickers.create({ data: finaldata }, (errs, dones) => {
                if (errs) { console.log(errs) }
                if (dones) { console.log("future data updated") }
              })
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { allTickers };
