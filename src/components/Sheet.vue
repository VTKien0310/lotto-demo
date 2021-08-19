<template>
  <div class="row" v-for="i in 9">
    <Cell v-for="n in getRowRenderData(i)" v-bind:number="n"></Cell>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import RandomNumberService from "@/services/RandomNumberService";
import Cell from "@/components/Cell.vue";

export default defineComponent({
  name: "Sheet",
  components: {Cell},
  data() {
    let randomNumberService: RandomNumberService = new RandomNumberService()
    return {
      randomNumberService: randomNumberService,
      numbers: randomNumberService.generateSheetNumbers()
    }
  },
  methods: {
    getRowRenderData(rowNumber: number) {
      return this.randomNumberService.getRowRenderData(rowNumber, this.numbers)
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