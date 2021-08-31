<template>
  <p v-if="number === 0" class="cell" v-bind:style="{background: color}"></p>
  <p v-else class="cell number-cell">{{ number }}</p>
</template>

<script lang="ts">
import {defineComponent} from "vue"

export default defineComponent({
  name: "Cell",
  props: {
    number: Number,
    color: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped>
.cell {
  padding: 5px;
  border: thin #202020 solid;
  min-width: 20px;
  margin: 0;
}

.number-cell {
  background: white;
  color: #202020;
}
</style>