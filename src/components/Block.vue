<template>
    <div class="block" :class="{ dragging: isDragging }" ref="draggableBlock"
        :style="{ 'top': newTop + 'px', 'left': newLeft + 'px' }" @mousedown="dragMouseDown">
        <div class="block-item type">Text Message</div>
        <div class="block-item text">Hi</div>
        <div class="block-item step">next step</div>
        <div class="circle-start" @click="dotStart"></div>
        <div class="circle-connect" @click="dotConnect"></div>
    </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import ShortUniqueId from "short-unique-id";

const uuid = new ShortUniqueId();

export default {
    data() {
        return {
            isDragging: false,
            positions: {
                clientX: undefined,
                clientY: undefined,
                movementX: 0,
                movementY: 0
            },
            linePositions: {
                clientX: undefined,
                clientY: undefined,
                movementX: 0,
                movementY: 0
            },
            currentLine: null,
            oldPositions: {
                top: this.newTop,
                left: this.newLeft
            }
        }
    },
    props: {
        newLeft: Number,
        newTop: Number,
        scale: Number,
        id: Number,
        currentLineId: String,
        canvasOffsetTop: Number,
        canvasOffsetLeft: Number,
    },
    methods: {
        ...mapMutations({
            CHANGE_POSITION: 'drag/CHANGE_POSITION',
            ADD_CURRENT_LINE: 'drag/ADD_CURRENT_LINE',
            ADD_CURRENT_LINE_END: 'drag/ADD_CURRENT_LINE_END',
            ADD_LINE: 'drag/ADD_LINE',
            ADD_CIRCLE_START: 'drag/ADD_CIRCLE_START',
            ADD_CIRCLE_CONNECT: 'drag/ADD_CIRCLE_CONNECT',
            CHANGE_LINE_FROM_POS: 'drag/CHANGE_LINE_FROM_POS',
            CHANGE_LINE_TO_POS: 'drag/CHANGE_LINE_TO_POS',
            ADD_HISTORY: 'drag/ADD_HISTORY'
        }),
        //методы обработки перемещения блока по канвасу
        dragMouseDown(event) {
            if (event.target.className !== 'circle-start' && event.target.className !== 'circle-connect') {
                this.oldPositions = {
                    left: event.target.offsetParent.offsetLeft,
                    top: event.target.offsetParent.offsetTop
                }
                const oldBlock = { ...this.getBlock(this.id), position: this.oldPositions }
                this.ADD_HISTORY({
                    historyType: 'block',
                    block: oldBlock,
                })
                event.preventDefault()
                this.positions.clientX = event.clientX
                this.positions.clientY = event.clientY
                document.onmousemove = this.elementDrag
                document.onmouseup = this.closeDragElement
                this.isDragging = true
            }
        },
        elementDrag(event) {
            event.preventDefault()
            this.positions.movementX = (this.positions.clientX - event.clientX) * (1 / this.scale)
            this.positions.movementY = (this.positions.clientY - event.clientY) * (1 / this.scale)
            this.positions.clientX = event.clientX
            this.positions.clientY = event.clientY
            this.CHANGE_POSITION({
                id: this.id,
                newTop: this.$refs.draggableBlock.offsetTop - this.positions.movementY,
                newLeft: this.$refs.draggableBlock.offsetLeft - this.positions.movementX
            }),
                this.isDragging = true
            //если есть линий связанные с блоком меняем их позиций отсносительно движения
            const block = this.getBlock(this.id)
            if (block.circleStart.lineIds.length) {
                block.circleStart.lineIds.map((id) => {
                    this.CHANGE_LINE_FROM_POS({
                        lineId: id,
                        newTop: this.positions.movementY,
                        newLeft: this.positions.movementX
                    })
                })
            }
            if (block.circleConnect.lineIds.length) {
                block.circleConnect.lineIds.map((id) => {
                    this.CHANGE_LINE_TO_POS({
                        lineId: id,
                        newTop: this.positions.movementY,
                        newLeft: this.positions.movementX
                    })
                })
            }
        },
        closeDragElement() {
            document.onmouseup = null
            document.onmousemove = null
            this.isDragging = false
        },

        //методы для обработки начальной точки линий
        dotStart(e) {
            e.preventDefault()
            let lineTop = this.newTop + e.target.offsetTop + e.target.offsetHeight / 2
            let lineLeft = this.newLeft + e.target.offsetLeft + e.target.offsetWidth / 2

            const line = {
                id: uuid.randomUUID(8),
                from: {
                    top: lineTop,
                    left: lineLeft
                }
            }
            document.onmousemove = (event) => {
                this.linePositions.movementX = (this.linePositions.clientX - event.clientX) * (1 / this.scale)
                this.linePositions.movementY = (this.linePositions.clientY - event.clientY) * (1 / this.scale)
                this.linePositions.clientX = event.clientX
                this.linePositions.clientY = event.clientY

                const fullLine = {
                    ...line,
                    to: {
                        top: (event.pageY - this.canvasOffsetTop) * (1 / this.scale),
                        left: (event.pageX - this.canvasOffsetLeft) * (1 / this.scale)
                    }
                }
                this.ADD_CURRENT_LINE(fullLine)
                document.onmousedown = (event) =>{
                    if(event.target.className !=='circle-connect'){
                        this.ADD_CURRENT_LINE({id:'', from:{top: 0,left: 0}, to:{top:0,left:0}})
                    }
                }
            }
            this.ADD_CIRCLE_START({ blockId: this.id, lineId: line.id })
        },
        //методы для обработки конечной точки линий и добавление его в массив линий
        dotConnect(e) {
            if (this.currentLineId.length) {
                let lineTop = this.newTop + e.target.offsetTop + e.target.offsetHeight / 2
                let lineLeft = this.newLeft + e.target.offsetLeft + e.target.offsetWidth / 2
                this.ADD_HISTORY({ historyType: 'line', lineId: this.currentLineId })
                this.ADD_LINE({ top: lineTop, left: lineLeft })
                this.ADD_CIRCLE_CONNECT({ blockId: this.id, lineId: this.currentLineId })
                document.onmousemove = null
            }
        }
    },
    computed: {
        ...mapGetters({
            getBlock: 'drag/getBlock',
        }),
    },
}
</script>

<style lang="scss" scoped>
.block {
    width: 250px;
    height: 200px;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    position: absolute;
    border: 2px solid grey;
    cursor: grab;
    border-radius: 15px;
    z-index: 2000;
    background-color: white;

    &.dragging {
        cursor: grabbing;
        border: 2px solid rgb(87, 87, 238);
        box-shadow: 0 0 10px rgb(87, 87, 238)
    }

    .block-item {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .block-item+.block-item {
        border-top: 1px solid grey;
    }

    .circle-start {
        width: 20px;
        height: 20px;
        border: 1px solid black;
        background-color: grey;
        border-radius: 50%;
        position: absolute;
        bottom: 20px;
        right: -12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s ease;
        opacity: 0.7;

        &:hover {
            transform: scale(1.2);
            opacity: 1
        }
    }

    .circle-connect {
        width: 30px;
        height: 30px;
        border: 1px solid black;
        background-color: grey;
        border-radius: 50%;
        position: absolute;
        top: 20px;
        left: -15px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s ease;
        opacity: 0.7;

        &:hover {
            transform: scale(1.2);
            opacity: 1;
        }
    }
}
</style>