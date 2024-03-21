const User = require('../../models/user')
const Plan = require('../../models/plans')
const { handleError } = require('../../middleware/utils')
const { getItemById } = require("../../middleware/db");
const Trade = require("../../models/copytrade")
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createPlan = async (req, res) => {
  try {
const user_id = req.user._id
const datas = req.body
const Users = await User.findOne({_id:user_id})
let isPlan =  await Plan.findOne({plan_name:req.body.plan_name})
if(isPlan){
     return res.status(400).json({
        success: false,
        result: null,
        message: "Plan is Already Registered"
    })
}else{
    let plans = await Plan.create(datas)
    // console.log(datas,"USERS")
      return  res.status(200).json({
                success: true,
                result: plans,
                message: "You Plan Selected"
            }  
        )
}


   
  } catch (error) {
    handleError(res, error)
  }
}

const getPlan = async (req, res) => {
    try {
  const user_id = req.user._id
  let finaldata = []
  let data = {}
  // console.log("USER ID",user_id)
  const totalPlan = await Plan.find()
  const findData = {
    'user_id': { $elemMatch: { '_id': req.user._id } }
  }
  
  let plans =  await Plan.find(findData)
// console.log(plans.length)


if(plans.length > 0){
  const filteredUserIds = plans[0]?.user_id.filter(user => {
    const endDate = new Date(user.endDate);
    return user._id.toString() === req.user._id.toString();
});
  // console.log(plans[0].plan_name,filteredUserIds,"Plans")
data.plans = totalPlan,
data.planType = plans[0].plan_name
data.planMode = filteredUserIds[0].plan
data.isActivate = true
finaldata.push(data)
// console.log("data",data)
}else{
  data.plans = totalPlan,
  data.isActivate = false
  data.planType = " "
  data.planMode = " "
  finaldata.push(data)
  // console.log("data1",data)
  }
  return res.status(200).json({
    success: true,
    result: finaldata,
    message: "Plan details are fetched sucessfully"
})
    } catch (error) {
      handleError(res, error)
    }
  }

  const getMyplan = async (req, res) => {
    try {
  const user_id = req.user._id
  let finaldata = []
  let data = {}
  // console.log("USER ID",user_id)
  const totalPlan = await Plan.find()
  const findData = {
    'user_id': { $elemMatch: { '_id': req.user._id } }
  }
  
  let plans =  await Plan.find(findData)
// console.log(plans)


if(plans.length > 0){
  const filteredUserIds = plans[0]?.user_id.filter(user => {
    const endDate = new Date(user.endDate);
    return user._id.toString() === req.user._id.toString();
});

data.plans = plans,
data.planType = plans[0].plan_name
data.planMode = filteredUserIds[0].plan
data.endDate = filteredUserIds[0].end
data.isActivate = true
finaldata.push(data)

}else{
  data.plans = plans,
  data.isActivate = false
  data.planType = " "
  data.planMode = " "
  data.endDate = " "
  finaldata.push(data)
  
  }
  return res.status(200).json({
    success: true,
    result: finaldata,
    message: "Plan details are fetched sucessfully"
})
    } catch (error) {
      handleError(res, error)
    }
  }

const updatePlan = async (req, res) => {
    try {
  const user_id = req.user._id
  const datas = req.body
  let findData = {
    plan_name:req.body.plan_name
}
let updateData = {
   plan_name:req.body.plan_name,
   per_month:req.body.per_month,
   per_year:req.body.per_year,
   limit:req.body.limit,
   features:req.body.features
}
  const Users = await User.findOne({_id:user_id})
  let isPlan =  await Plan.findOne(findData)
  if(!isPlan){
       return res.status(400).json({
          success: false,
          result: null,
          message: "Plan is Already Registered"
      })
  }else{
      let plans = await Plan.findOneAndUpdate(findData,updateData)
      // console.log(plans,"USERS")
        return  res.status(200).json({
                  success: true,
                  result: plans,
                  message: "You Plan Selected"
              }  
          )
  }
  
  
     
    } catch (error) {
      handleError(res, error)
    }
  }

  const deletePlan = async (req, res) => {
    try {
     
    //  console.log("deleteplan")
     const followers = []
      const date = Date.now()
      // console.log(date)
      const totalPlan = await Plan.find()
     //const findCondition = {  'user_id.end': { $gt: date  } }
      const findData = {
        'user_id.end': { $lt: date  }
      }
      
      let plans =  await Plan.find(findData)
//  console.log(date,"date",plans.length)
 let Ids = await Plan.find(findData)
//  console.log(date,"date",Ids.length)
 for(i=0;i<Ids.length;i++){
  // console.log("lenghth",Ids[i].user_id.length)
  for(j=0;j<Ids[i].user_id.length;j++){
    // console.log("lenghth",Ids[i].user_id[j].length)
    if(Ids[i].user_id[j].end < date){
let trades = await Trade.findOneAndUpdate({user_id:Ids[i].user_id[j]._id},{follower_user_id:followers})
    }
  }
 }
// let finaldata = await Plan.updateMany(findData, { $pull: { 'user_id': { 'end': { $lt: date } } } })
   
        } catch (error) {
          // handleError(res, error)
        }
  }

module.exports = { createPlan,updatePlan,getMyplan,getPlan,deletePlan }
