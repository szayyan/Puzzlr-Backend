
function validate_eth_address( address ) {
    // starts with 0x -> followed by 40 hex chars
    return /^0x[a-fA-F0-9]{40}$/.test( address )
}

module.exports = validate_eth_address
