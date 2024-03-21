const User = require("../../models/user");
const { handleError } = require("../../middleware/utils");
const { listInitOptions } = require("../../middleware/db/listInitOptions");
const getBalance = require('../wallet/getBalanceUsdt');

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getUserslist = async (req, res) => {
  try {
    const {limit , page} = req.query
    const urs = await User.find()
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(urs.length / limit )
    const option = await listInitOptions(req);
    console.log(option, "listtt");

    const userlist = await User.aggregate([
      {
        $lookup: {
          from: "subaccounts",
          localField: "_id",
          foreignField: "user_id",
          as: "subaccounts",
        },
      },
      {$unwind : '$subaccounts'},
      {
        $lookup: {
          from: "wallets",
          localField: "_id",
          foreignField: "user_id",
          as: "wallets",
        },
      },
      {$skip : Number(skip)},
      {$limit : Number(limit) },
    ]);
    console.log(urs.length,"len")

    const balance = [];

    userlist.forEach(user => {
      let total_price_in_usd = 0;

      user.wallets.forEach(wallet => {
        let usdtBalance = getBalance.getBalanceUsdt(wallet.symbol, wallet.balance);
        total_price_in_usd += usdtBalance;

        let chain_balance = {
          symbol: wallet.symbol,
          bal: wallet.balance,
          usdtBalance: usdtBalance,
        };

        balance.push(chain_balance);
      });

      user.TotalBalance = total_price_in_usd;
    });

    if (userlist.length > 0) {
      res.status(200).json({
        success: true,
        result: userlist,totalPages,
        message: "Users found successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        result: "",
        message: "Users not found",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getUserslist };


// const getUserslist = async (req, res) => {
//   try {
//     const { limit, page } = req.query;
//     const options = await listInitOptions(req);

//     const count = await User.countDocuments();

//     const totalPages = Math.ceil(count / limit);
//     const skip = (page - 1) * limit;

//     const userlist = await User.aggregate([
//       {
//         $lookup: {
//           from: "subaccounts",
//           localField: "_id",
//           foreignField: "user_id",
//           as: "subaccounts",
//         },
//       },
//       { $unwind: "$subaccounts" },
//       {
//         $lookup: {
//           from: "wallets",
//           localField: "_id",
//           foreignField: "user_id",
//           as: "wallets",
//         },
//       },
//       { $skip: skip },
//       { $limit: Number(limit) },
//     ]);

//     const balance = [];

//     userlist.forEach((user) => {
//       let total_price_in_usd = 0;

//       user.wallets.forEach((wallet) => {
//         let usdtBalance = getBalance.getBalanceUsdt(wallet.symbol, wallet.balance);
//         total_price_in_usd += usdtBalance;

//         let chain_balance = {
//           symbol: wallet.symbol,
//           bal: wallet.balance,
//           usdtBalance: usdtBalance,
//         };

//         balance.push(chain_balance);
//       });

//       user.TotalBalance = total_price_in_usd;
//     });

//     if (userlist.length > 0) {
//       res.status(200).json({
//         success: true,
//         result: userlist,
//         totalPages,
//         message: "Users found successfully",
//       });
//     } else {
//       res.status(200).json({
//         success: false,
//         result: "",
//         message: "Users not found",
//       });
//     }
//   } catch (error) {
//     handleError(res, error);
//   }
// };

