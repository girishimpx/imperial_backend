const users = require('../../models/user')
const { handleError } = require('../../middleware/utils')
const { listInitOptions } = require("../../middleware/db/listInitOptions");


const userLastLogin = async (req, res) => {
    const { limit, page } = req.query
    try {
        const user = await users.aggregate([
            {
                $lookup: {
                    from: "useraccesses",
                    localField: "email",
                    foreignField: "email",
                    as: "usersaccess",
                }
            },
            {
                $unwind: '$usersaccess',
            },
            {
                $lookup: {
                    from: "kycs",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "assests",
                }
            },
            {
                $unwind: "$assests"
            },
            {
                $sort: { "usersaccess.email": 1, "usersaccess.updatedAt": -1 }
            },
            {
                $group: {
                    _id: "$email",
                    name: { $first: "$name" },
                    email: { $first: "$email" },
                    latestAccess: { $first: "$usersaccess" },
                    country: { $first: "$assests" }
                }
            },
            {
                $project: {
                    "name": 1,
                    "email": 1,
                    "latestAccess.updatedAt": 1,
                    "country.country": 1
                    // "$count": 1
                }
            },
            { $skip: Number((page - 1) * limit) },
            { $limit: Number(limit) },
        ])
        const totalPages = Math.ceil(user.length / limit)
        const option = await listInitOptions(req);
        const userCounts = await users.countDocuments()
        if (user) {
            res.status(200).json({
                success: true,
                message: "Data Fetched Successfully",
                result: user, userCounts, totalPages
            })
        }
        else {
            res.status(201).json({
                success: false,
                message: "No Data Found",
                result: '',
            })
        }

    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { userLastLogin }