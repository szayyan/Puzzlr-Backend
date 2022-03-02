var copy2d = require("../utility/copy2d")
// 0  _|
// 1  |_
// 2  |¯¯
// 3  ¯¯| 
// 4   |
// 5  --
// 6 empty

const puzzle_data = [
    [[4,6,4],[4,6,4],[4,6,4]],
    [[4,6,4],[4,6,4],[4,6,4]],
    [[4,6,4],[4,6,4],[4,6,4]],
    [[4,6,4],[4,6,4],[4,6,4]],
    [[4,6,4],[4,6,4],[4,6,4]],
    [[4,6,4],[4,6,4],[4,6,4]],
    [[4,6,4],[4,6,4],[4,6,4]],
]

class slider
{
    constructor(index, prng) {
        this.index = index
        this.board = copy2d( puzzle_data[index] )
        this.rng = prng
    }

    fetch_target() {
        return puzzle_data[this.index]
    }

    permute_row( board, index, direction ) {

        let len = board[index].length
        let start, end
        if( direction == 1 ) {
            start = 0
            end = len-1
        } else {
            start = len - 1
            end = 0
        }
        let i = start
        let stored_element = board[index][start]
    
        while( true ) {
            if( i == end ) {
                board[index][i] = stored_element
                break
            } else {
                board[index][i] = board[index][i+direction]
            }
            i += direction
        }
    }
    
    permute_column( board, index, direction ) {
        
        let len = board.length
        let start, end
        if( direction == 1 ) {
            start = 0
            end = len-1
        } else {
            start = len - 1
            end = 0
        }
        let i = start
        let stored_element = board[start][index]
        
        while( true ) {
            if( i == end ) {
                board[i][index] = stored_element
                break
            } else {
                board[i][index] = board[i+direction][index]
            }
            i += direction
        }
    }

    generate( iterations ) {
        for(let i =0; i < iterations; i++ ) {
            if( this.rng.int(2) == 0 ) {
                let row_length = this.board[0].length
                this.permute_row( this.board, this.rng.int(row_length), 1 )
            } else {
                let col_length = this.board.length
                this.permute_column( this.board, this.rng.int(col_length), 1 )
            }
        }

        return this.board
    }

    compare_boards( b1, b2 ) {
        for( let i =0; i < b1.length; i++ ) {
            for( let j = 0; j < b2.length; j++ ) {
                if( b1[i][j] != b2[i][j] ) {
                    return false
                }
            }
        }
        return true
    }
    
    verify( solution ) {
        if( solution.length%2 == 1 || solution.length > 500 ) {
            return false
        }

        for(let i = 0; i+1 < solution.length; i+=2) {
            if( solution[i] < 0 || solution[i] > 3 ) {
                return false
            }
            let rc_len = solution[i] < 2 ? this.board[0].length : this.board.length
            if( solution[i+1] >= rc_len ) {
                return false;
            }
            let dir = [1,-1]

            if( solution[i] < 2 ) {
                this.permute_row( this.board, solution[i+1], dir[solution[i]])
            } else {
                this.permute_column( this.board, solution[i+1], dir[solution[i]-2])
                
            }
        }
        console.log(this.board)
        console.log( puzzle_data[this.index] )
        return this.compare_boards( this.board, puzzle_data[this.index] )
    }
}

module.exports = slider