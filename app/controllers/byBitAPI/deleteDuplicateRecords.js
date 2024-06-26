const { handleError } = require("../../middleware/utils");
const mongoose = require("mongoose");
const assets = require('../../models/wallet');

const deleteDuplicateRecords = async (req, res) => {
    try {
        const duplicates = await assets.aggregate([
            {
                $match: {
                    // user_id: mongoose.Types.ObjectId('6663843fae566b00281bc833') 
                }
            },
            {
                $group: {
                    _id: "$coinname",
                    count: { $sum: 1 },
                    docs: { $push: "$_id" }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);

        // Remove duplicates
        for (const group of duplicates) {
            const [firstDoc, ...duplicateDocs] = group.docs;

            await assets.deleteMany({
                _id: { $in: duplicateDocs }
            });

            console.log(`Removed ${duplicateDocs.length} duplicate(s) for coinname: ${group._id}`);
        }

        res.status(200).json({ message: "Duplicate records deleted successfully" });
    } catch (error) {
        handleError(res, error);
    }
}

module.exports = { deleteDuplicateRecords };
