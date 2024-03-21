const tickers = require("../../models/allTickers");
const { handleError } = require("../../middleware/utils");
const  mongoose  = require("mongoose");

// TO ADD THE PAIRS TO THE FAVORITE LIST

const addFavPairs = async (req,res) => {

    try {
    const id = req.user._id 
    const  { pairs , add } = req.body 
    // console.log(add,'add');
    // console.log(pairs,'PAIRS & TYPES');

    if (!add) {
        var futurepaisdata

        futurepaisdata = await tickers.aggregate([
                    {
                        $unwind: '$data',
                    },
                    {
                        $match: {
                            'data.instType':  "SPOT",
                        },
                    },
                    {
                        $match : {
                            'data.instId' : pairs 
                        }
                    },
         
                ]);

                // console.log(futurepaisdata[0]._id,'futurepaisdata');
                // futurepaisdata[0]._id,
                // futurepaisdata.user.push(arraynew); 

                const findData = {
                   _id: mongoose.Types.ObjectId(futurepaisdata[0]._id), 'data.instId': pairs
                  }
                
                const fav =  await tickers.findOneAndUpdate(findData,  { $push : {'data.$.users_id': mongoose.Types.ObjectId(id)  }})

              const updatedfuturepaisdata = await tickers.aggregate([
                    {
                        $unwind: '$data',
                    },
                    {
                        $match: {
                            'data.instType':  "SPOT",
                        },
                    },
                    {
                        $match : {
                            'data.instId' : pairs 
                        }
                    },
         
                ]);
                
                if(futurepaisdata.length > 0){
                    res.status(200).json({
                        success: true,
                        result: updatedfuturepaisdata,
                        message: `${pairs} Added To Favorites `
                    })
                }else{
                    res.status(200).json({
                        success: false,
                        result: '',
                        message: `Error Adding ${pairs}`
                    })
                }
    }  
    if(add){
        var futurepaisdata
       
        futurepaisdata = await tickers.aggregate([
                    {
                        $unwind: '$data',
                    },
                    {
                        $match: {
                            'data.instType':  "SPOT",
                        },
                    },
                    {
                        $match : {
                            'data.instId' : pairs 
                        }
                    },
         
                ]);

                // console.log(futurepaisdata[0]._id,'futurepaisdata');
                // futurepaisdata[0]._id,
                // futurepaisdata.user.push(arraynew); 
                const findData = {
                   _id: mongoose.Types.ObjectId(futurepaisdata[0]._id), 'data.instId': pairs
                  }

               await tickers.findOneAndUpdate(findData,  { $pull : {'data.$.users_id': id  }})

               const updatedfuturepaisdata = await tickers.aggregate([
                    {
                        $unwind: '$data',
                    },
                    {
                        $match: {
                            'data.instType':  "SPOT",
                        },
                    },
                    {
                        $match : {
                            'data.instId' : pairs 
                        }
                    },
         
                ]);
                
                if(futurepaisdata.length > 0){
                    res.status(200).json({
                        success: true,
                        result: updatedfuturepaisdata,
                        message: `${pairs} Removed From Favorites`
                    })
                }else{
                    res.status(200).json({
                        success: false,
                        result: futurepaisdata,
                        message: `Error Adding ${pairs}`
                    })
                }
    }
    }catch (error) {
        handleError(res,error);
    }

}


module.exports = { addFavPairs };
