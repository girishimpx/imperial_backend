const { handleError } = require('../../middleware/utils')
const ASSETS = require('../../models/assets')



const listCoins = async (req, res) => {
    try {
   
        const assetList = await ASSETS.find();


        if(assetList.length > 0){
            res.status(200).json({
                success : true,
                result : assetList,
                message : "AssetList Found SuccessFully"
            })
        } else{
            res.status(200).json({
                success : false,
                result : [],
                message : "Asset Not Found"
            })
        }


    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { listCoins };
