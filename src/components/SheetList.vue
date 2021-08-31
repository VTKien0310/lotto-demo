<template>
  <div class="sheet-list">
    <div class="sheet" v-for="i in numberOfSheetPair">
      <SheetPair></SheetPair>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import SheetPair from "@/components/SheetPair.vue";
import NumberHelper from "@/helpers/NumberHelper";

export default defineComponent({
  name: "SheetList",
  components: {SheetPair},
  data() {
    let numberOfSheet = 6
    return {
      // the number of sheets generated will always be even
      numberOfSheetPair: NumberHelper.roundToEven(numberOfSheet) / 2
    }
  }
})
</script>

<style scoped>
.sheet {
  margin-bottom: 5%;
}

.sheet-list {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>