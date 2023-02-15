type BlockType = {
    id: number,
    position: {
        top: Number,
        left: Number
    }
    circleStart: {
        isActive: boolean,
        lineId: Number
    }
    circleConnect: {
        isActive: boolean,
        lineId: Number
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
    lines: [],
    currentLine: lineType
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
                isActive: false,
                lineId: 12
            },
            circleConnect: {
                isActive: false,
                lineId:24
            }
        },
        {
            id: 2,
            position: {
                top: 300,
                left: 300,
            },
            circleStart: {
                isActive: false,
                lineId: 2
            },
            circleConnect: {
                isActive: false,
                lineId: 4
            }
        }],
        lines: [],
        currentLine: {
            id: 1,
            from: {
                top: 12,
                left: 12
            },
            to: {
                top: 12,
                left: 12
            }
        } 
    }),
    mutations: {
        CAHNGE_POSITION(state: any, payload: any) {
            state.blocks = state.blocks.map((block: BlockType) => {
                if(block.id === payload.id){
                    block.position.top = payload.newTop;
                    block.position.left = payload.newLeft;
                }
                return block;
            })
        },
        ADD_CURRENT_LINE(state: any, payload: any) {
            state.currentLine = {
                ...state.currentLine,
                id: payload.id,
                from: {
                    top: payload.from.top,
                    left: payload.from.left
                }
            }
            console.log(state.currentLine.from.top, state.currentLine.from.left)
        },
        ADD_CURRENT_LINE_END(state: any, payload: any) {
            state.currentLine ={
                ...state.currentLine,
                to: {
                    top: payload.top,
                    left: payload.left
                }
            }
        },
        ADD_LINE(state: any) {
            state.lines.push(state.currentLine)
        },
    },
    namespaced: true
}