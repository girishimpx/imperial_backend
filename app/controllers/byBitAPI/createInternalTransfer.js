
const { handleError } = require('../../middleware/utils')
const { RestClientV5 } = require('bybit-api');
const apiData = require('../../models/copytrade')
const uuid = require('uuid')
const internaltransfer = require('../../models/internalTransfer')


const createInternalTransfer = async (req, res) => {

    const user_id = req.user._id
    const { coin, amount, fromAccountType, toAccountType } = req.body
    console.log(req.body, 'req.body');
    const transfer_id = uuid.v4()
    console.log(transfer_id, 'transfer_id');
    try {

        const keyData = await apiData.findOne({ user_id: user_id })
        console.log(keyData, 'keyData');

        if (keyData) {

            const client = new RestClientV5({
                testnet: false,
                key: keyData.apikey,
                secret: keyData.secretkey,
            });


            const apiResponse = await client.createInternalTransfer(
                transfer_id,
                coin,
                amount,
                fromAccountType,
                toAccountType
            )
            console.log(apiResponse, 'apiResponse');
            if (apiResponse.retCode == 0) {
                var payload = {
                    user_id: user_id,
                    Amount: amount,
                    Currency: coin,
                    from: fromAccountType == "UNIFIED" ? "Trading" : "Funding",
                    to: toAccountType == "UNIFIED" ? "Trading" : "Funding"
                }
                await internaltransfer.create(payload)
                res.status(200).json({
                    success: true,
                    result: apiResponse.result.list,
                    // message: `Amount Transfer to ${toAccountType} Successfully`
                    message: `Amount Transfer Successfully`

                })
            } else {
                res.status(201).json({
                    success: false,
                    result: apiResponse,
                    message: apiResponse.retMsg
                })
            }


        }
        else {
            res.status(201).json({
                success: false,
                message: "Account Not Found",
                result: ''
            })
        }


    } catch (error) {
        handleError(res, error)
    }





}

module.exports = { createInternalTransfer }