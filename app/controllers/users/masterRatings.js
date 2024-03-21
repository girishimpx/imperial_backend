const User = require("../../models/user");
const Trade = require("../../models/trade");
const masterRating = require("../../models/Rating")
const { matchedData } = require("express-validator");
const { isIDGood, handleError } = require("../../middleware/utils");
const { getItemById } = require("../../middleware/db");
const { listInitOptions } = require("../../middleware/db/listInitOptions");

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const masterRatings = async (req, res) => {
    try {

        const masterId = req.body._id
        const rating = req.body.rating
        const mastersList = await User.findOne({ _id: masterId });

        if (mastersList) {
            const rateList = await masterRating.findOne({ master_id: masterId });
            if (rateList) {
                const masterRate = await masterRating.findOne({ $and: [{ 'user_id._id': req.user._id }, { master_id: masterId }] })
                console.log(masterRate, "master")
                if (masterRate) {
                    res.status(400).json({
                        success: false,
                        result: {},
                        message: "You Already give the rating for this Master"
                    })
                }
                else {
                    usersRating = {
                        _id: req.user._id,
                        rating: rating
                    }
                    console.log(req.user._id)
                    const total_rating = rateList.total_ratings + Number(rating)
                    const average_rating = total_rating / (rateList.user_id.length + 1)
                    console.log(usersRating, total_rating, average_rating, "ratings")
                    const updateData = {
                        $push: { user_id: usersRating },
                        total_ratings: total_rating,
                        average_ratings: average_rating
                    }
                    console.log(updateData)
                    const updateRatings = await masterRating.findOneAndUpdate({ _id: rateList._id }, updateData);
                    const user = await User.findOneAndUpdate({ _id: masterId }, { rating: average_rating })
                    res.status(200).json({
                        success: true,
                        result: updateRatings,
                        message: "You gave Rating to the master"
                    })
                }
            }

            else {
                const userIds = {
                    _id: req.user._id,
                    rating: rating
                }
                const Ratings = {
                    master_id: masterId,
                    user_id: userIds,
                    total_ratings: rating,
                    average_ratings: rating,
                }
                await masterRating.create(Ratings)
                const user = await User.findOneAndUpdate({ _id: masterId }, { rating: rating })
                res.status(200).json({
                    success: true,
                    result: masterRating,
                    message: "You gave Rating to the master"
                })
            }

        } else {
            res.status(200).json({
                success: false,
                result: "",
                message: "Masters not found",
            });
        }
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { masterRatings };
