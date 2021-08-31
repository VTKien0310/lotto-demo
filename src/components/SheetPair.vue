<template>
  <div class="sheet-pair">
    <div class="sheet">
      <Sheet :numbers="sheetOneNumber" :color="color"></Sheet>
    </div>
    <div class="sheet">
      <Sheet :numbers="sheetTwoNumber" :color="color"></Sheet>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import SheetNumberService from "@/services/SheetNumberService";
import serviceContainer from "@/containers/ServiceContainer";
import Sheet from "@/components/Sheet.vue";
import ColorHelper from "@/helpers/ColorHelper";

export default defineComponent({
  name: "SheetPair",
  components: {Sheet},
  data() {
    let sheetNumberService: SheetNumberService = serviceContainer.sheetNumberService(),
        sheetOne: Array<number>,
        sheetTwo: Array<number>;
    ({sheetOne, sheetTwo} = sheetNumberService.generateSheetNumbers())
    return {
      sheetOneNumber: sheetOne,
      sheetTwoNumber: sheetTwo,
      color: ColorHelper.randomLightColor()
    }
  }
})
</script>

<style scoped>
.sheet-pair {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>