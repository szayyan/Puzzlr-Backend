const express = require("express");
const puzzle = require('./puzzles/slider')
const prng = require('./utility/generator')
const { ObjectId } = require('mongodb')
const validate_eth_address = require('./utility/validate_address')
const { index_puzzle } = require('./utility/puzzle_indexing');
const slider = require("./puzzles/slider");
const Web3 = require("web3")
require("dotenv").config()
const mongo = require("./database/mongo_wrapper");


const s_router = express.Router();

s_router.route("/api/generate").post(function(req,res)
{
    console.log(req.body.address)
    if( !(req.body.address && validate_eth_address( req.body.address )) ) {
        res.status(400).send("Invalid ethereum address")
        return
    }
    const [valid,] = index_puzzle()

    if( !valid ) {
        res.status(400).send("Puzzle updating on chain")
        return
    }

    mongo.get_database().collection("epoch").findOne( {"_id": ObjectId("61be75903e4e675732606910")}, 
        (err, result) => {
            if( err ) {
                res.status(400).send("Unable to find current puzzle epoch. Check our socials for status updates.")
                return
            }

            let generator = new prng( req.body.address, result.current )
            let slider_puzzle = new puzzle( result.current%7 , generator )
            slider_puzzle.generate( 20 ) // shuffled for 20 iterations
            res.send( JSON.stringify({ target_board: slider_puzzle.fetch_target() , shuffled_board: slider_puzzle.board }) )
        }
    )
});

s_router.route("/api/verify").post(function(req,res)
{
    // req.body.wallet_address
    // req.body.solution 

    if( !(req.body.address && validate_eth_address( req.body.address )) ) {
        res.status(400).send("Invalid ethereum address")
        return
    }
    
    const [valid,] = index_puzzle()
    if( !valid ) {
        res.status(400).send("Puzzle has expired.")
        return
    }

    mongo.get_database().collection("epoch").findOne( {"_id": ObjectId("61be75903e4e675732606910")}, 
        (err, result) => {
            if( err ) {
                res.status(400).send("Unable to find current puzzle epoch")
                return
            }
                    
            let generator = new prng(req.body.address, result.current)
            let slider_puzzle = new puzzle( result.current%7 , generator )
            slider_puzzle.generate( 20 ) // shuffled for 20 iterations

            if( !slider_puzzle.verify( req.body.solution ) ) {
                res.status(400).send("Invalid puzzle solution - puzzle may have expired")
                return
            }

            let web3 = new Web3();
            let hashed_message = web3.utils.keccak256(
                web3.eth.abi.encodeParameters(
                    ['address','uint32'],
                    [ req.body.address , result.current ]
                )
            )
            let super_secret_sign = web3.eth.accounts.privateKeyToAccount(process.env.VALIDATOR_KEY).sign(hashed_message);

            res.send( super_secret_sign.signature );

            // store solvers info for analytics - no problemo if we get an error here non critical system
            // important to do this after sending signarture back to user
            mongo.get_database().collection("user-data").updateOne( 
                { "epoch": result.current},
                { $addToSet: { "solvers": req.body.address } },
                { upsert: true } 
            )

            mongo.get_database().collection("user-data").updateOne(
                { "user": req.body.address},
                { $inc: { "solves": 1} },
                { upsert: true }
            )
        }
    )
})

s_router.route("/api/history").post( (req,res) => {

    mongo.get_database().collection("epoch").findOne({"_id": ObjectId("61be75903e4e675732606910")},
        (err,result) => {
            if( err ) {
                res.status(400).send("Error getting solve history")
                return
            }
            let current_epoch = parseInt(result.current)
            let data = mongo.get_database().collection("user-data").aggregate([
                { $project: {_id: 0, epoch: 1, num_solvers: {$size: "$solvers"} } },
                { $match: { epoch: {$gt: current_epoch-30,
                                    $lt: current_epoch+1}} }
            ]).toArray( (err,final) => {
                if( err ) {
                    res.status(400).send("Error getting solve history")
                    return
                } 
                res.send(final)
            })
        }
    )
})

/*
s_router.route("/api/epoch").post( (req,res) => {
    // fetches information about todays puzzle!.
    // further analytics could also go here
    mongo.get_database().collection("epoch").find({},
        (err, result) => {
            if( err ) {
                res.status(400).send("Unable to find epoch date")
                return
            }

            res.send( JSON.stringify( {date_set:result.date_set,difficulty: } );
        } 
    )
})
// databased approach to epoch
/*mongo.get_database().collection("epoch").findOne( {"_id": ObjectId("61be75903e4e675732606910")}, 
    (err, result) => {
        if( err ) {
            res.status(400).send("Unable to find current puzzle epoch")
            return
        }
        
        let generator = new prng(req.body.address)
        let slider_puzzle = new puzzle( result.current%7 , generator )
        slider_puzzle.generate( 20 ) // shuffled for 20 iterations
        res.send( JSON.stringify({ target_board: slider_puzzle.fetch_target() , shuffled_board: slider_puzzle.board }) )
})*/


/*
// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("records")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});
*/
module.exports = s_router;