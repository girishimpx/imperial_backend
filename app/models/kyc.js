const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const KycSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            required: true,
            default: "",
            ref:'User'
        },
        status: {
            type: String,
            enum: ['0', '1', '2'],
            default: '0'
        },
        reason: {
            type: String,
            default: ''
        },
        first_name: {
            type: String,
            required: true,
            default: ""
        },
        last_name: {
            type: String,
            required: true,
            default: ""
        },
        phone_no: {
            type: String,
            required: true,
            default: ""
        },
        gender: {
            type: String,
            required: true,
            default: ""
        },
        dob: {
            type: String,
            required: true,
            default: ""
        },
        country: {
            type: String,
            required: true,
            default: ""
        },
        state: {
            type: String,
            required: true,
            default: ""
        },
        city: {
            type: String,
            required: true,
            default: ""
        },
        zipcode: {
            type: String,
            required: true,
            default: ""
        },
        telegram: {
            type: String
        },
        account_no: {
            type: String,
            default: ""
        },
        ifsc_code: {
            type: String,
            default: ""
        },
        bank_name: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            required: true,
            default: ""
        },
        document_type: {
            type: String,
            required: true,
            default: ""
        },
        document_num: {
            type: String,
            required: true,
            default: ""
        },
        document_image: {
            type: String,
            required: true,
            default: ""
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)
KycSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('kycs', KycSchema)