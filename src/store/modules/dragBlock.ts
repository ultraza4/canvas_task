type BlockType = {
    id: number,
    position: {
        top: number,
        left: number
    }
    circleStart: {
        lineIds: Array<Number>
    }
    circleConnect: {
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
    lines: Array<lineType>,
    currentLine: lineType,
    history: Array<any>,
    movedBlock: BlockType | undefined
}

export const dragBlock = {
    state: (): dragBlockStateType  => ({
        blocks: [{
            id: 1,
            position: {
                top: 10,
                left: 800,
            },
            circleStart: {
                lineIds: []
            },
            circleConnect: {
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
                lineIds: []
            },
            circleConnect: {
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
                lineIds: []
            },
            circleConnect: {
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
        },
        movedBlock: {} as BlockType,
        history: [] 
    }),
    mutations: {
        CHANGE_POSITION(state: dragBlockStateType, payload: {id: number, newTop: number, newLeft: number}) {
            state.movedBlock = state.blocks.find((block: BlockType) => block.id === payload.id)
            state.blocks = state.blocks.map((block: BlockType) => {
                if(block.id === payload.id){
                    block.position.top = payload.newTop;
                    block.position.left = payload.newLeft;
                }
                return block;
            })
        },
        ADD_CURRENT_LINE(state: dragBlockStateType, payload: lineType) {
            state.currentLine = payload
        },
        ADD_LINE(state: dragBlockStateType, payload: {top: number, left: number}) {
            state.lines.push({
                ...state.currentLine,
                to: payload
            })
            state.currentLine = {id:'',from: {top:0,left:0},to:{top:0,left:0}
            }
        },
        //добавляет id линий в блок 
        ADD_CIRCLE_START(state: dragBlockStateType, payload: {blockId: number, lineId: number}){
            state.blocks = state.blocks.map((block: BlockType) => {
                if(block.id === payload.blockId){
                    block.circleStart.lineIds.push(payload.lineId)
                }
                return block;
            })
        },
        //добавляет id линий в блок 
        ADD_CIRCLE_CONNECT(state: dragBlockStateType, payload: {blockId: number, lineId: number}){
            state.blocks = state.blocks.map((block: BlockType) => {
                if(block.id === payload.blockId){
                    block.circleConnect.lineIds.push(payload.lineId)
                }
                return block;
            })
        },
        //меняет позцицию связянных линий при перемещений блока
        CHANGE_LINE_FROM_POS(
            state: dragBlockStateType, 
            payload: {lineId: string, newTop: number, newLeft: number}
            ){
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
        //меняет позцицию связянных линий при перемещений блока
        CHANGE_LINE_TO_POS(state: dragBlockStateType, 
            payload: {lineId: string, newTop: number, newLeft: number}){
            state.lines = state.lines.map((line: lineType) =>{
                if(line.id === payload.lineId){
                    line.to = {
                        top: line.to.top - payload.newTop,
                        left: line.to.left - payload.newLeft
                    }
                }
                return line;
            })
        },
        ADD_HISTORY(state: dragBlockStateType, payload: any){
            if(payload.historyType === 'line'){
                const history = {
                    historyType: payload.historyType,
                    lineId: payload.lineId 
                }
                state.history.push(history)
            }
            if(payload.historyType === 'block'){
                const startLinePositions = [] as any
                const connectLinePositions = [] as any
                payload.block.circleStart.lineIds.map((lineId: string) =>{
                    startLinePositions[lineId] = state.lines.find(line => line.id === lineId )?.from
                 })
                payload.block.circleConnect.lineIds.map((lineId: string) =>{
                    connectLinePositions[lineId] = state.lines.find(line => line.id === lineId )?.to
                })
                const history = {
                    historyType: payload.historyType,
                    block: payload.block,
                    startLinePositions: startLinePositions,
                    connectLinePositions: connectLinePositions
                }
                state.history.push(history)
            }
        },
        UNDO_HISTORY(state: dragBlockStateType){
            if(state.history[state.history.length-1].historyType === 'line'){
                const lineId = state.history[state.history.length-1].lineId
                state.lines = state.lines.filter((line: lineType) => line.id !== lineId)
                state.blocks = state.blocks.map((block: BlockType) => {
                    block.circleConnect.lineIds = block.circleConnect.lineIds.filter((id) => id !== lineId)
                    block.circleStart.lineIds = block.circleStart.lineIds.filter((id) => id !== lineId)
                    return block;
                })
                state.history.pop()
            }else if((state.history[state.history.length-1].historyType === 'block')){
                const historyBlock = state.history[state.history.length-1]
                state.blocks = state.blocks.map((block: BlockType) => {
                    if(block.id === historyBlock.block.id){
                        return historyBlock.block
                    }
                    return block
                })
                //возвращает значения связанных линий к блоку
                state.lines = state.lines.map((line: lineType) => {
                    if(line.id in historyBlock.startLinePositions){
                        const newLine = {...line, from: historyBlock.startLinePositions[line.id]}
                        return newLine
                    }
                    return line
                })
                state.lines = state.lines.map((line: lineType) => {
                    if(line.id in historyBlock.connectLinePositions){
                        const newLine = {...line, to: historyBlock.connectLinePositions[line.id]}
                        return newLine
                    }
                    return line
                })
                state.history.pop()
            }
        }
    },
    getters: {
        getBlock: (state: dragBlockStateType) => (id: Number) => {
            return state.blocks.find((block: BlockType) => block.id === id)
        }
    },
    namespaced: true
}