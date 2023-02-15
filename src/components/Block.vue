<template>
    <div class="block" :class="{ dragging: isDragging }" ref="draggableBlock"
        :style="{'top': newTop + 'px', 'left': newLeft + 'px'}" @mousedown="dragMouseDown">
        <div class="block-item type">Text Message</div>
        <div class="block-item text">Hi</div>
        <div class="block-item step">next step</div>
        <div class="circle-start" @click="dotStart"></div>
        <div class="circle-connect" @click="dotConnect"></div>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
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
            }
        }
    },
    props: {
        newLeft: Number,
        newTop: Number,
        scale: Number,
        id: Number
    },
    methods: {
        ...mapMutations({
            CAHNGE_POSITION: 'drag/CAHNGE_POSITION',
            ADD_CURRENT_LINE: 'drag/ADD_CURRENT_LINE',
            ADD_CURRENT_LINE_END: 'drag/ADD_CURRENT_LINE_END',
            ADD_LINE: 'drag/ADD_LINE',
            ADD_CIRCLE_START: 'drag/ADD_CIRCLE_START',
            ADD_CIRCLE_CONNECT: 'drag/ADD_CIRCLE_CONNECT'
        }),
        dragMouseDown: function (event) {
            event.preventDefault()
            // get the mouse cursor position at startup:
            this.positions.clientX = event.clientX
            this.positions.clientY = event.clientY
            document.onmousemove = this.elementDrag
            document.onmouseup = this.closeDragElement
            this.isDragging = true
        },
        elementDrag: function (event) {
            event.preventDefault()
            this.positions.movementX = (this.positions.clientX - event.clientX) * (1 / this.scale)
            this.positions.movementY = (this.positions.clientY - event.clientY) * (1 / this.scale)
            this.positions.clientX = event.clientX
            this.positions.clientY = event.clientY
            this.CAHNGE_POSITION({
                id: this.id,
                newTop: this.$refs.draggableBlock.offsetTop - this.positions.movementY,
                newLeft: this.$refs.draggableBlock.offsetLeft - this.positions.movementX
            }),
                this.isDragging = true
        },
        closeDragElement() {
            document.onmouseup = null
            document.onmousemove = null
            this.isDragging = false
        },
        dotStart(e) {
            const line = {
                id: uuid.randomUUID(8),
                from: {
                    top: e.clientY,
                    left: e.clientX
                }
            }
            document.onmousemove = (event) => {
                const fullLine = {
                    ...line,
                    to: {
                        top: event.clientY,
                        left: event.clientX
                    }
                }
                this.ADD_CURRENT_LINE(fullLine)
            }
            this.ADD_CIRCLE_START({blockId: this.id, lineId: line.id})
        },
        dotConnect() {
            this.ADD_CIRCLE_CONNECT({blockId: this.id, lineId: currentLine.id})
            this.ADD_LINE(this.id)
            document.onmousemove = null
        }
    },
    ...mapState({
      currentLine: state => state.drag.currentLine,
    })
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
        right: -10px;
        overflow: hidden;
        cursor: pointer;
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
    }
}
</style>