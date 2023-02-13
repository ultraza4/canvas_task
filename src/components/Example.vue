<template>
<v-stage ref="stage" :config="stageSize">
      <v-layer ref="layer">
        <!-- <Block :config="{draggable: true}"/> -->
        <v-text
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
          :config="{
            text: 'Draggable Text',
            x: 50,
            y: 50,
            draggable: true,
            fill: isDragging ? 'green' : 'black'
          }"
        />
      </v-layer>
    </v-stage>
</template>

<script>
import Block from "../components/Block.vue"

const width = window.innerWidth;
const height = window.innerHeight;

export default {
  data() {
    return {
      stageSize: {
        width: width,
        height: height
      },
      isDragging: false
    };
  },
  components: {
    Block
  },
  methods: {
    handleDragStart() {
      this.isDragging = true;
    },
    handleDragEnd() {
      this.isDragging = false;
    }
  }
};
</script>