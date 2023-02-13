<template>
  <div class="canvas">
    <Block :startX="0" :startY="50"/>
    <Block :startX="300" :startY="300"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Block from '@/components/Block.vue';

@Options({
  components: {
    Block,
  },
})
export default class HomeView extends Vue {}
</script>
