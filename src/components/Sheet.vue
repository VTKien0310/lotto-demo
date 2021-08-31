<template>
  <div class="row" v-for="i in 9">
    <Cell :color="color" v-for="n in getRowRenderData(i)" v-bind:number="n"></Cell>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import Cell from "@/components/Cell.vue"
import serviceContainer from "@/containers/ServiceContainer"

export default defineComponent({
  name: "Sheet",
  components: {Cell},
  props: {
    numbers: {
      type: Array as () => Array<number>,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      sheetNumberService: serviceContainer.sheetNumberService()
    }
  },
  methods: {
    getRowRenderData(rowNumber: number) {
      return this.sheetNumberService.getRowRenderData(rowNumber, this.$props.numbers)
    }
  }
})
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  margin: 0;
}
</style>