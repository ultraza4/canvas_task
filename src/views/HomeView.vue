<template>
  <div class="zoom-btns">
    <button class="btn" @click="upScale">+</button>
    <button class="btn" @click="downScale">-</button>
    <button class="btn" @click="undo">U</button>
  </div>
  <div class="canvas" :style="{ transform: 'scale(' + this.scaleNum + ')', top: this.x + 'px', left: this.y + 'px' }"
    ref="draggableCanvas" @mousedown="dragMouseDown">
    <Block v-for="block in blocks" :key="block.id" :id="block.id" :newLeft="block.position.left"
      :newTop="block.position.top" :scale="scaleNum" :currentLineId="currentLine.id" :canvasOffsetLeft="canvasOffsetLeft"
      :canvasOffsetTop="canvasOffsetTop" />
    <Lines />
  </div>
</template>

<script >
import Block from '@/components/Block.vue';
import Lines from '@/components/Lines.vue';
import { mapState,mapMutations } from 'vuex';

export default {
  data() {
    return {
      scaleNum: 1,
      x: 0,
      y: 0,
      canvasOffsetLeft: 0,
      canvasOffsetTop: 0,
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      }
    }
  },
  components: {
    Block,
    Lines
  },
  methods: {
    ...mapMutations({
      UNDO_HISTORY: 'drag/UNDO_HISTORY' 
    }),
    upScale() {
      this.scaleNum += 0.1
    },
    downScale() {
      this.scaleNum -= 0.1
    },
    undo() {
      if(this.history.length){
        this.UNDO_HISTORY()
      }
    },
    dragMouseDown: function (event) {
      event.preventDefault()
      if (event.target.className === "canvas" ||
        event.target.id === "app" || event.target.className.baseVal === "svgLine") {
        this.positions.clientX = event.clientX
        this.positions.clientY = event.clientY
        document.onmousemove = this.elementDrag
        document.onmouseup = this.closeDragElement
      }
    },
    elementDrag: function (event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      // set the element's new position:
      this.x = (this.$refs.draggableCanvas.offsetTop - this.positions.movementY)
      this.y = (this.$refs.draggableCanvas.offsetLeft - this.positions.movementX)

      this.canvasOffsetTop = this.$refs.draggableCanvas.offsetTop,
        this.canvasOffsetLeft = this.$refs.draggableCanvas.offsetLeft
    },
    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
    },
  },
  computed: {
    ...mapState({
      blocks: state => state.drag.blocks,
      currentLine: state => state.drag.currentLine,
      lines: state => state.drag.lines,
      history: state => state.drag.history
    }),
  },
  mounted() {
    document.addEventListener("mousedown", this.dragMouseDown)
  }
}
</script>

<style lang="scss">
.zoom-btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  top: 30px;
  left: 20px;
  z-index: 1100;

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid black;
    border-radius: 50%;
    font-size: large;
    cursor: pointer;
  }
}

.canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1000;
  transform-origin: 0 0;

  .inner-canvas {
    transform-origin: center;
    position: relative;
  }
}
</style>
