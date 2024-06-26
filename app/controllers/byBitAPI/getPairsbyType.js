const { handleError } = require('../../middleware/utils');
const pairlist = require('../../models/newPairs');


const getPairsbyType = async (req, res) => {
    const id = req.user._id
    try {
        const category = req.body.category ? req.body.category.toUpperCase() : ''
        const type = req.body.type.toLowerCase();
        console.log(type, category, '*******************');
        if (type == 'spot') {
            // pairs = await pairlist.find({ quoteCoin: category, category: "spot" }).sort({ users_id: -1 });
            pairs = await pairlist.aggregate([
                {
                    $match: {
                        quoteCoin: category,
                        category: "spot"
                    }
                },
                {
                    $addFields: {
                        userIndex: {
                            $indexOfArray: ['$users_id', id]
                        }
                    }
                },
                {
                    $sort: {
                        userIndex: -1,
                        // 'users_id': 1,
                    }
                }
            ])
            // console.log(pairs, 'spottttttttt');
            if (pairs.length > 0) {
                res.status(200).json({
                    success: true,
                    result: pairs,
                    message: "Pairs Found SuccessFully",
                });
            } else {
                res.status(200).json({
                    success: false,
                    result: [],
                    message: "Pairs Not Found",
                });
            }
        } else if (type == 'margin') {
            console.log('elseif*******************');
            // pairs = await pairlist.find({ quoteCoin: category, marginTrading: 'both' }).sort({ users_id: -1 });
            pairs = await pairlist.aggregate([
                {
                    $match: {
                        quoteCoin: category,
                        marginTrading: 'both'
                    }
                },
                {
                    $addFields: {
                        userIndex: {
                            $indexOfArray: ['$users_id', id]
                        }
                    }
                },
                {
                    $sort: {
                        userIndex: -1,
                        // 'users_id': 1,
                    }
                }
            ])
            pairs1 = await pairlist.countDocuments({ quoteCoin: category, marginTrading: 'both', });

            if (pairs.length > 0) {
                res.status(200).json({
                    success: true,
                    result: pairs,
                    pairs1: pairs1,
                    message: "Margin Pairs Found SuccessFully",
                });
            } else {
                res.status(200).json({
                    success: false,
                    result: [],
                    message: "Pairs Not Found",
                });
            }

        } else if (type == 'linear') {
            // pairs = await pairlist.find({ category: 'linear' }).sort({ users_id: -1 });
            pairs = await pairlist.aggregate([
                {
                    $match: {
                        category: 'linear'
                    }
                },
                {
                    $addFields: {
                        userIndex: {
                            $indexOfArray: ['$users_id', id]
                        }
                    }
                },
                {
                    $sort: {
                        userIndex: -1,
                        // 'users_id': 1,
                    }
                }
            ])

            if (pairs.length > 0) {
                res.status(200).json({
                    success: true,
                    result: pairs,
                    count: pairs.length,
                    message: "Future Pairs Found SuccessFully",
                });
            } else {
                res.status(200).json({
                    success: false,
                    result: [],
                    message: "Pairs Not Found",
                });
            }
        }



    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { getPairsbyType };
