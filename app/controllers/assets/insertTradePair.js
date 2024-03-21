const Asset = require('../../models/assets')
const { createItem } = require('../../middleware/db')
const { handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { assetExists } = require('./helpers/assetExists')
const tradepair = require('../../models/tradePairs')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const insertTradepair = async (req, res) => {
    try {
      req = matchedData(req)
      
      const data1 = await Asset.findOne({coinname:req.coinname1})
      const data2 = await Asset.findOne({coinname:req.coinname2})



      if(data1 && data2){
        req.market_asset = data1._id
        req.base_asset = data2._id
        const response = await tradepair.create(req,(err,done)=>{
          if(err){
            res.status(400).json({
              success : false,
              result:  "",
              message: "Trade pair didn't created"
            })
          }else{
            res.status(200).json({
              success : true,
              result:  "",
              message: 'Trade pair created successfully'
            })
          }
        })
        
      }else{
        res.status(400).json({
          success : false,
          result:  null,
          message: `${!data1 ? `${req.coinname1} not exist`   :!data2 ? `${req.coinname2} not exist`:"" }`
        })
      }


      }catch (error) {
      handleError(res, error)
    }
    } 
  
  module.exports = { insertTradepair }
