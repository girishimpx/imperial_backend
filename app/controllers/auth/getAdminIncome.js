const copytrade = require('../../models/copytrade')
const { handleError } = require('../../middleware/utils')

const getAdminIncome = async (req, res) => {
    try {
        const data = await copytrade.aggregate([
            { $unwind: "$follower_user_id" },
            { $group: { _id: null, totalAmount: { $sum: { $toDouble: "$follower_user_id.amount" } } } }
        ]);
        // console.log(data,'data');
        const totalIncome = data.length > 0 ? data[0].totalAmount : 0;
        // console.log(totalIncome, 'totalIncome');

        if (totalIncome > 0) {
            res.status(200).json({
                success: true,
                message: "Data Found",
                result: totalIncome
            });
        }
        else {
            res.status(201).json({
                success: false,
                message: "Data not Found",
                result: ''
            });
        }

    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { getAdminIncome }
