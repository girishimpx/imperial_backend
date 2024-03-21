const Wallet = require("../../models/wallet");
const User = require("../../models/user");
const asset = require("../../models/assets");
const {
  imperialApiAxios,
} = require("../../middleware/ImperialApi/imperialApi");
const axios = require("axios");
const { handleError } = require('../../middleware/utils')
const CryptoJS = require("crypto-js");
const getBalance = require('./getBalanceUsdt')

const WalletBAlanceUpdateCron = async (req, res) => {
  const date = new Date()
  console.log(req.user._id)
  let total_price = 0
  const users = await User.find()
  const walletsDetial = await Wallet.aggregate([
    { $match: {} },
    {
      $lookup:
      {
        from: "copytrades",
        localField: 'user_id',
        foreignField: 'user_id',
        as: 'userDetails'
      }
    },
    { $unwind: '$userDetails' }
  ])

  if (walletsDetial.length > 0) {
    for (let i = 0; i < walletsDetial.length; i++) {

      let app = await imperialApiAxios(
        "get",
        `https://www.imperialx.exchange/api/v5/account/balance?ccy=${walletsDetial[i].symbol}`,
        `/api/v5/account/balance?ccy=${walletsDetial[i].symbol}`,
        date,
        "93975967-ed47-4070-a436-329e22e14a1b",
        "CBB7D9C9B6426A6562D2741A1E8AC9A6",
        "Pass@123",
      );
      if (app.data[0]?.details[0]?.availBal) {

        // console.log(usdtBalance,"Final")
        Wallet.findByIdAndUpdate(
          { _id: walletsDetial[i]._id },
          {
            balance: app.data[0]?.details[0]?.availBal,
            escrow_balance: app.data[0]?.details[0]?.frozenBal,
          },
          (err, done) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`${walletsDetial[i].symbol} balance updated`);
            }
          }
        );

      }
    }
    for (let i = 0; i < walletsDetial.length; i++) {


      let app1 = await imperialApiAxios(
        "get",
        `https://www.imperialx.exchange/api/v5/account/max-loan?instId=${walletsDetial[i].symbol}-USDT&mgnMode=cross&mgnCcy=${"USDT"}`,
        `/api/v5/account/max-loan?instId=${walletsDetial[i].symbol}-USDT&mgnMode=cross&mgnCcy=${"USDT"}`,
        "",
        "93975967-ed47-4070-a436-329e22e14a1b",
        "CBB7D9C9B6426A6562D2741A1E8AC9A6",
        "Pass@123",
      );
      if (app1.code == 0) {
        Wallet.findByIdAndUpdate(
          { _id: walletsDetial[i]._id },
          {
            max_loan: app1.data,
          },
          (err, done) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`${walletsDetial[i].symbol} MAX_LOAN updated`);
            }
          }
        );
      }

    }
    // if(users.length > 0){
    // for(k=0;k<users.length;k++){
    //   console.log(users.length)
    //   total_price = 0

    //    const userUsdWallet = await Wallet.findOne({user_id:users[k]._id,symbol:"USD"})
    //    console.log(userUsdWallet)
    //    if(userUsdWallet){
    //     console.log("Present")
    //     const userWallet = await Wallet.find({user_id:users[k]._id})
    //     for(j=0;j<userWallet.length;j++){
    //       let usdtBalance = getBalance.getBalanceUsdt(userWallet[j].symbol,userWallet[j].balance)
    //            console.log(k,userWallet[j].balance,userWallet[j].symbol)

    //      total_price = total_price + usdtBalance  
    // console.log(usdtBalance,total_price)
    // }
    //    }
    //    else{


    //               req.balance = 0;
    //               req.escrow_balance = 0;
    //               req.mugavari = [];
    //               req.symbol = "USD";
    //               req.max_loan=[];
    //               req.Entry_bal="0";
    //               req.Exit_bal="0";
    //               req.asset_id ="";
    //               req.user_id = users[k]._id
    //               Wallet.create(req);
    //               const userWallet = await Wallet.find({user_id:users[k]._id})

    //    }
    //    console.log(users[k]._id,total_price,"ID")
    //    const UsdUpdate = await Wallet.findOneAndUpdate({user_id:users[k]._id,symbol:"USD"},{total_balance:total_price})

    // }
    // }
    // else {
    //   console.log("USER Collection is empty");
    // }
    res.status(200).json({
      success: true,
      result: "",
      message: 'Data found succesfully'
    })
  } else {
    console.log("Wallet Collection is empty");
  }

};

module.exports = { WalletBAlanceUpdateCron };
