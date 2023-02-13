<template>
  <div class="canvas">
    <Block />
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
