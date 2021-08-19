<template>
  <div class="sheet-list">
    <div class="sheet" v-for="i in 3">
      <Sheet></Sheet>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import Sheet from "@/components/Sheet.vue";

export default defineComponent({
  name: "SheetList",
  components: {Sheet}
})
</script>

<style scoped>
.sheet {
  margin-bottom: 5%;
}

.sheet-list {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>