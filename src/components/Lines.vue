<template>
  <svg v-if="this.currentLine" class="svgLine">
    <line class="line" :x1='currentLine.from.left' :y1='currentLine.from.top' :x2='currentLine.to.left'
      :y2='currentLine.to.top' stroke="black" />
  </svg>
  <svg v-for="line in lines" :key="line.id" class="svgLine">
    <line class="line" :x1='line.from.left' :y1='line.from.top' :x2='line.to.left' :y2='line.to.top' stroke="black" />
  </svg>
</template>

<script>
import { mapState } from 'vuex';

export default {

  computed: {
    ...mapState({
      currentLine: state => state.drag.currentLine,
      lines: state => state.drag.lines,
    })
  },
}

</script>

<style lang="scss">
.svgLine {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: visible;

  .line {
    z-index: 1000;
  }
}
</style>