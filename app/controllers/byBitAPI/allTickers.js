const tickers = require("../../models/allTickers");
const { handleError } = require("../../middleware/utils/handleError");
const axios = require("axios");
const CryptoJS = require("crypto-js");

const allTickers = async (req, res) => {
    try {
        let finaldata = [];
        let count = 0;
        let check = 0;
        var alllist;
        const pair = ["SPOT","FUTURES"];
        const apiKey = "0l0RFNXVkw0F0YfhDY";
        const apiSecret = "vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei";

        for (let i = 0; i < pair.length; i++) {
            const endpoint = `https://api.bybit.com/v5/market/instruments-info?category=${pair[i] == "FUTURES" ? 'linear' : pair[i]}`;
            const recvWindow = 50000;
            const Timestamp = new Date().getTime();
            const UrlObject = new URL(endpoint);
            const SearchParams = UrlObject.searchParams;
            const QueryString = Timestamp + apiKey + recvWindow + SearchParams;
            const Signature = CryptoJS.HmacSHA256(QueryString, apiSecret).toString(CryptoJS.enc.Hex);

            const headers = {
                "Host": "api.bybit.com",
                "X-BAPI-SIGN": Signature,
                "X-BAPI-API-KEY": apiKey,
                "X-BAPI-TIMESTAMP": Timestamp,
                "X-BAPI-RECV-WINDOW": recvWindow,
                'Content-Type': 'application/json',
            };

            try {
                const response = await axios.get(endpoint, { headers: headers });
                 alllist = response.data.result.list;
                if (response.data.retCode === 0) {
                    const allPairs = response.data.result.list;
                    const totallength = allPairs.length;

                    for (let ii = 0; ii < totallength; ii++) {
                        let updatedata = {
                            alias: allPairs[ii].alias || "",
                            lever: allPairs[ii].leverageFilter?.minLeverage || "",
                            instType: pair[i],
                            instId: allPairs[ii].symbol,
                            last: allPairs[ii].lotSizeFilter.minOrderAmt || ""
                        };
                        finaldata.push(updatedata);
                        check++;
                    }
                }
            } catch (error) {
                console.error('Address API Error:', error.message);
            }
            count++;
        }

        if (count === pair.length && check === finaldata.length) {

            tickers.create({ data: finaldata }, (errs, dones) => {
                if (errs) { console.log(errs) }
                if (dones) { console.log("future data updated") }
              })

            res.status(200).json({
                success: true,
                result: finaldata,
                message: "Pairs Created Successfully",
            });
        } else {
            res.status(200).json({
                success: false,
                result: [],
                message: "Error While Creating Pairs",
            });
        }
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { allTickers };
