const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 3001;
var prng = require("./src/utility/generator")
app.use(cors());
app.use(express.json());
app.use(require("./src/gateway"));
// get driver connection
const mongo = require("./src/database/mongo_wrapper");
const gen_data = require("./src/utility/test_data_gen")

for(let i = 0; i < 20; i++) {
    console.log( gen_data( "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", i ) );
}
/*

mongo.connect_to_database( "protocol" ,err => {
    if( err ) {
        console.log(err);
        return
    }
    
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`)
    })
    
})*/