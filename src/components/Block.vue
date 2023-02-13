<template>
    <div 
        class="block"
        :class="{dragging: isDragging}"
        ref="draggableBlock"
        :style="{'top': x, 'left': y}" 
        @mousedown="dragMouseDown">
        <div class="block-item type">Text Message</div>
        <div class="block-item text">Hi</div>
        <div class="block-item step">next step</div>
        <div class="circle-start"></div>
        <div class="circle-connect"></div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            isDragging: false ,
            x: null,
            y: null,
            positions: {
                clientX: undefined,
                clientY: undefined,
                movementX: 0,
                movementY: 0
            }
        }
    },
    props: {
        startX: Number,
        startY: Number
    },
    methods: {
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
            this.positions.movementX = this.positions.clientX - event.clientX
            this.positions.movementY = this.positions.clientY - event.clientY
            this.positions.clientX = event.clientX
            this.positions.clientY = event.clientY
            // set the element's new position:
            this.x = (this.$refs.draggableBlock.offsetTop - this.positions.movementY) + 'px'
            this.y = (this.$refs.draggableBlock.offsetLeft - this.positions.movementX) + 'px'
        },
        closeDragElement() {
            document.onmouseup = null
            document.onmousemove = null
            this.isDragging = false
        }
    },
    mounted() {
        this.x = this.startX + 'px';
        this.y = this.startY + 'px';
    }
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
    overflow: hidden;
    &.dragging{
        cursor: grabbing;
        border: 2px solid rgb(87, 87, 238);
        z-index: 100;
        overflow: hidden;
    }
    .block-item {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .block-item+.block-item {
        border-top: 1px solid grey;
    }
}
</style>