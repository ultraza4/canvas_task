type BlockType = {
    id: number,
    position: {
        top: number,
        left: number
    }
    circleStart: {
        isActive: boolean,
        lineIds: Array<Number>
    }
    circleConnect: {
        isActive: boolean,
        lineIds: Array<Number>
    }
}

type lineType = {
    id: string,
    from: {
        top: number,
        left: number
    },
    to: {
        top: number,
        left: number
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
                lineIds: []
            },
            circleConnect: {
                isActive: false,
                lineIds:[]
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
                lineIds: []
            },
            circleConnect: {
                isActive: false,
                lineIds: []
            }
        },
        {
            id: 3,
            position: {
                top: 500,
                left: 600,
            },
            circleStart: {
                isActive: false,
                lineIds: []
            },
            circleConnect: {
                isActive: false,
                lineIds: []
            }
        }],
        lines: [],
        currentLine: {
            id: '',
            from: {
                top: 0,
                left: 0
            },
            to: {
                top: 0,
                left: 0
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
            state.currentLine = payload
        },
        ADD_LINE(state: any, payload: any) {
            state.lines.push({
                ...state.currentLine,
                to: payload
            })
            state.currentLine = {
                id: '',
                from: {
                    top:0,
                    left:0
                },
                to: {
                    top:0,
                    left:0
                }
            }
        },
        ADD_CIRCLE_START(state: any, payload: {blockId: number, lineId: number}){
            state.blocks = state.blocks.map((block: BlockType) => {
                if(block.id === payload.blockId){
                    block.circleStart.isActive = true;
                    block.circleStart.lineIds.push(payload.lineId)
                }
                return block;
            })
        },
        ADD_CIRCLE_CONNECT(state: any, payload: {blockId: number, lineId: number}){
            state.blocks = state.blocks.map((block: BlockType) => {
                if(block.id === payload.blockId){
                    block.circleConnect.isActive = true;
                    block.circleConnect.lineIds.push(payload.lineId)
                }
                return block;
            })
        },
        CHANGE_LINE_FROM_POS(state: any, payload: {lineId: string, newTop: number, newLeft: number}){
            state.lines = state.lines.map((line: lineType) =>{
                if(line.id === payload.lineId){
                    line.from = {
                        top: line.from.top - payload.newTop,
                        left: line.from.left - payload.newLeft
                    }
                }
                return line;
            })
        },
        CHANGE_LINE_TO_POS(state: any, payload: {lineId: string, newTop: number, newLeft: number}){
            state.lines = state.lines.map((line: lineType) =>{
                if(line.id === payload.lineId){
                    line.to = {
                        top: line.to.top - payload.newTop,
                        left: line.to.left - payload.newLeft
                    }
                }
                return line;
            })
        }
    },
    getters: {
        getBlock: (state: any) => (id: Number) => {
            return state.blocks.find((block: BlockType) => block.id === id)
        }
    },
    namespaced: true
}