const tickers = require("../../models/allTickers");
const { handleError } = require("../../middleware/utils");
const  mongoose  = require("mongoose");

// TO ADD THE PAIRS TO THE FAVORITE LIST

const addFavPairsFuture = async (req,res) => {

   try {
    
    const id = req.user._id 
    const  { pairs , add } = req.body 

console.log(pairs,add,typeof(add),'********************');
    if (!add) {
        var futurepaisdata
        // console.log('jgfv ytkdf uykf uyf luyfg luykg liyg yg ly');
        futurepaisdata = await tickers.aggregate([
                    {
                        $unwind: '$data',
                    },
                    {
                        $match: {
                            'data.instType':  "FUTURES",
                        },
                    },
                    // {
                    //     $match : {
                    //         'data.instId' : pairs 
                    //     }
                    // },
         
                ]);

                // console.log(futurepaisdata[0]._id,'futurepaisdata********************************');
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
                            'data.instType':  "FUTURES",
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
                        message: `Added To Favorites`
                    })
                }else{
                    res.status(200).json({
                        success: false,
                        result: '',
                        message: `Error Adding`
                    })
                }
    }  
    else{
        var futurepaisdata
       
        futurepaisdata = await tickers.aggregate([
                    {
                        $unwind: '$data',
                    },
                    {
                        $match: {
                            'data.instType':  "FUTURES",
                        },
                    },
                    {
                        $match : {
                            'data.instId' : pairs 
                        }
                    },
         
                ]);

                console.log(futurepaisdata,'futurepaisdata');
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
                            'data.instType':  "FUTURES",
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
                        message: `Removed From Favorites`
                    })
                }else{
                    res.status(200).json({
                        success: false,
                        result: futurepaisdata,
                        message: `Error Adding`
                    })
                }
    }


   } catch (error) {
    handleError(res, error);
   }

}


module.exports = { addFavPairsFuture };
