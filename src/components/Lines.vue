<template>
  <svg v-if="this.currentLine" class="svgLine">
    <path class="currentLine" 
      :d="pathAttribute(currentLine.from.left,currentLine.from.top,currentLine.to.left,currentLine.to.top)" 
      />
  </svg>
  <svg v-for="line in lines" :key="line.id" class="svgLine">
    <path class="line" 
      :d="pathAttribute(line.from.left,line.from.top,line.to.left,line.to.top)" fill="transparent" stroke="black"/>
  </svg>
</template>

<script>
import { mapState } from 'vuex';
import curve from 'svg-line-curved';
export default {
  methods: {
    pathAttribute(x1, y1, x2, y2) {
      return curve(x1, y1, x2, y2)
    }
  },
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
    position: absolute;
    z-index: 1000;
  }
  .currentLine{
    position: absolute;
    z-index: 1000;
    fill: transparent;
    stroke: rgb(87, 87, 238);
    stroke-dasharray: 5;
    stroke-width: 3;
  }
}
</style>