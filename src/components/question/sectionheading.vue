<template>
  <v-layout>
    <v-flex xs1  class="finalquestionindex">
    </v-flex>
    <v-flex xs11 questionbox>
        <h2 class="section-heading no-background"><span> {{ sectiondata.questiontext }}</span></h2>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  props:['sectiondata']
}
</script>
<style scoped>
.section-heading{
  width: 100%;
  margin-bottom: 30px;
}
</style>
