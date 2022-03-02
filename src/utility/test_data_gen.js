
const puzzle = require('../puzzles/slider')
const prng = require('../utility/generator')

function gen_data( address, epoch ) {   

    let generator = new prng( address, epoch )
    let slider_puzzle = new puzzle( epoch%7 , generator )
    slider_puzzle.generate( 20 ) // shuffled for 20 iterations
    return { target_board: slider_puzzle.fetch_target() , shuffled_board: slider_puzzle.board }
}

module.exports = gen_data;