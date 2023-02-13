<template>
    <div class="block">
        <div class="block-item type">Text Message</div>
        <div class="block-item text">Hi</div>
        <div class="block-item step">next step</div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({
    data() {
        return {
            isDragging: false as boolean,

        }
    },
    components: {

    },
    methods: {
        handleDragStart() {
            this.isDragging = true
        },
        handleDragEnd() {
            
        }
    }
})
export default class Block extends Vue { }

</script>

<style lang="scss" scoped>
.block {
    width: 250px;
    height: 200px;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    border: 2px solid grey;

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