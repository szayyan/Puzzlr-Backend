const start_day = 1 // start_day == monday
const update_length = 4 // update length is 5 minutes LONG

function index_puzzle() {
    let day = new Date()
    let current_day = day.getUTCDay()
    let valid = day.getUTCHours() > 0 || day.getUTCMinutes() > update_length

    let offset = current_day - start_day
    if( offset < 0 ) {
        offset = 7 + offset
    }
    return [valid, offset ]
}

module.exports = { index_puzzle }

