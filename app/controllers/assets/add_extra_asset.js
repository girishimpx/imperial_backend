const tickers = require("../../models/allTickers");
const { handleError } = require("../../middleware/utils");
const { imperialApiAxios } = require('../../middleware/ImperialApi/imperialApi');
const mongoose = require("mongoose");
const ASSETS = require("../../models/assets");

const add_extra_asset = async (req, res) => {
    try {
        console.log('entered');
        const response = await imperialApiAxios(
            "get",
            "https://www.okx.com/api/v5/asset/currencies",
            `/api/v5/asset/currencies`,
            {},
            "3df426fa-6b66-4060-aa50-86912071cca9",
            "324CE1EE13D0F39BC59381F011C1B490",
            "Z34pAnuLsX@",
        );

        const tokenArr = response.data;
        const assetList = await ASSETS.find();
        const processedAssets = [];

            var count = 1

        for (let i = 0; i < tokenArr.length; i++) {
            const token = tokenArr[i];

            if (processedAssets.includes(token.name.toLowerCase())) {
                console.log(`${token.name} has already been processed.`);
                continue; 
            }

            const existingAsset = assetList.find(asset => asset.coinname.toLowerCase() === token.name.toLowerCase());
            if (existingAsset) {
                console.log(`${token.name} already exists in the database.`);
            } else {
                console.log(`${token.name} does not exist in the database. Adding it...`);
            var assetData = {
                image : token.logoLink,
                coinname : token.name,
                chain : 'coin',
                symbol : token.ccy,
            }
                await ASSETS.create(assetData)
            console.log(assetData,count,'*******************');
            count++
            }

            // Add the asset name to the processedAssets list
            processedAssets.push(token.name.toLowerCase());
        }

        res.status(200).json({
            success: true,
            data: tokenArr,
            message: "Asset created or checked successfully"
        });
    } catch (error) {
        handleError(res, error);
    }
}

module.exports = { add_extra_asset };
