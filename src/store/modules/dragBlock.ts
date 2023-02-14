type BlockType = {
    id: number,
    position: {
        top: number,
        left: number
    }
    circleStart: {
        isActive: boolean,
    }
}

type lineType = {
    id: Number,
    from: {
        top: Number,
        left: Number
    },
    to: {
        top: Number,
        left: Number
    }
}

type dragBlockStateType = {
    blocks: Array<BlockType>
    lines: []
}


export const dragBlock: any = {
    state: (): dragBlockStateType  => ({
        blocks: [{
            id: 1,
            position: {
                top: 0,
                left: 50,
            },
            circleStart: {
                isActive: false
            }
        },
        {
            id: 2,
            position: {
                top: 300,
                left: 300,
            },
            circleStart: {
                isActive: false
            }
        }],
        lines: []
    }),
    mutations: {
        ADD_LINE(state: any, payload: any) {
            state.LINES.push(payload)
        },
        changePosition(state: any, payload: any) {
            state.blocks = state.blocks.map((block: BlockType) => {
                if(block.id === payload.id){
                    block.position.top = payload.newTop;
                    block.position.left = payload.newLeft;
                }
                return block;
            })
        }
    },
    namespaced: true
}