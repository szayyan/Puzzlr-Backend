

from random import choice
grid_size = 5
number_flows = 5
minimum_size = 3
iterations = 1
directions = [[0,1],[1,0],[-1,0],[0,-1]]
# when refactoring make cells a class of flows
flows = [[] for i in range(grid_size)]
cells = [[-1]*grid_size for i in range(grid_size)]

def populate_flows():
    for i in range(number_flows):
        for j in range(grid_size):
            flows[i].append([j,i])

def in_bounds(pos):
    return pos[0] >= 0 and pos[0] < grid_size and pos[1] >= 0 and pos[1] < grid_size

def flows_into_cells():
    index = 0
    for i in flows:
        for j in i:
            cells[j[0]][j[1]] = index
        index += 1

def find_neighbouring_heads( pos ):
    neighbour_heads = []
    for i in range(len(flows)):
        neighbour_head = flows[i][0]
        neighbour_tail = flows[i][-1]

        head_diff = (pos[0] - neighbour_head[0]) + (pos[1] - neighbour_head[1])
        if abs(head_diff) == 1:
            neighbour_heads.append([i,0])
        tail_diff = (pos[0] - neighbour_tail[0]) + (pos[1] - neighbour_tail[1])
        if abs(tail_diff) == 1:
            neighbour_tail.append([i,len(flows[i])-1])

    return neighbour_heads


def mutate_cells():
    for i in range(len(flows)):
        #print( i[0] )
        #print( find_neighbouring_heads(flows[i][0]) )

        if( len(flows[i]) <= minimum_size ):
            continue
        # shrink blossom
        neighbours = find_neighbouring_heads(flows[i][0])

        if len(neighbours) <= 0:
            continue
        
        r_neighbour = choice(neighbours)
        #flows[rand_neighbour[0]][neighbours[1]] # ref to actual object
        flows[i].insert(0, flows[r_neighbour[0]][r_neighbour[1]].pop(0) )
        
        # fetch neighouring heads
        # i[0] -> head of this flow


        #i[0][0] #  refers to one of the things of the head
        #finf a neighbour of the head
        
def generate_puzzle():
    for i in range(iterations):
        mutate_cells()
def verify_solution():
    return

populate_flows()
#print(flows)
generate_puzzle()
flows_into_cells()
for i in cells:
    for j in i:
        print(j, end = ' ')
    print("/n")
#print(flows)
