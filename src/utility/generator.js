
const crypto = require("crypto-js");
var seedrandom = require("seedrandom")

class PRNG 
{
    constructor( address, epoch ) {

        let date = new Date()
        var sha256_hash = crypto.algo.SHA256.create();
        sha256_hash.update( address )
        sha256_hash.update( epoch.toString() )
        var hash = sha256_hash.finalize( )
        this.base_rng =  new seedrandom( hash.toString() )
    }

    int( val ) {
        return Math.floor(this.base_rng() * val)
    }
}

module.exports = PRNG