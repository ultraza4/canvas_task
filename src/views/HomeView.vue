<template>
  <div class="zoom-btns">
    <button class="btn" @click="upScale">+</button>
    <button class="btn" @click="downScale">-</button>
  </div>
  <div class="canvas" :style="{ transform: 'scale(' + this.scaleNum + ')', top: this.x, left: this.y }"
    ref="draggableCanvas" @mousedown="dragMouseDown">
    <Block 
      v-for="block in blocks" 
      :key="block.id"
      :id="block.id" 
      :newLeft="block.position.left" 
      :newTop="block.position.top"
      :scale="scaleNum"/>
      <svg
        v-if="this.currentLine" 
        :width='currentLine.from.left > currentLine.to.left ?
        currentLine.from.left : currentLine.to.left ' 
        :height='currentLine.from.top > currentLine.to.top ?
        currentLine.from.top : currentLine.to.top ' 
        class="svgLine">
        <line class="svgLine"
          :x1='currentLine.from.left' :y1='currentLine.from.top'
          :x2='currentLine.to.left' :y2='currentLine.to.top' stroke="black"/>
      </svg>
      <svg 
        v-for="line in lines"
        :key="line.id"
        :width='line.from.left > line.to.left ?
        line.from.left : line.to.left ' 
        :height='line.from.top > line.to.top ?
        line.from.top : line.to.top ' 
        class="svgLine">
        <line class="svgLine"
          :x1='line.from.left' :y1='line.from.top'
          :x2='line.to.left' :y2='line.to.top' stroke="black"/>
      </svg>
  </div>
</template>

<script >
import Block from '@/components/Block.vue';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      scaleNum: 1,
      x: 0,
      y: 0,
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
  },
  methods: {
    upScale() {
      this.scaleNum += 0.1
    },
    downScale() {
      this.scaleNum -= 0.1
    },
    dragMouseDown: function (event) {
      event.preventDefault()
      if (event.target.className === "canvas" || event.target.id === "app" || event.target.className === "svgLine") {
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
      this.x = (this.$refs.draggableCanvas.offsetTop - this.positions.movementY) + 'px'
      this.y = (this.$refs.draggableCanvas.offsetLeft - this.positions.movementX) + 'px'
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
    })
  },
  mounted() {
    document.addEventListener("mousedown", this.dragMouseDown)
    this.canvasWidth = document.documentElement.scrollWidth + 'px'
    this.canvasHeight = document.documentElement.scrollHeight + 'px'
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
  transform-origin: center;

  .svgLine{
    position: absolute;
    z-index: 100;
  }
}
</style>
