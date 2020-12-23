<template>
  <v-layout>
    <v-flex xs1  class="finalquestionindex">
    </v-flex>
    <v-flex xs11 questionbox>
        <h2 class="section-heading">{{ sectiondata.questiontext }}</h2>
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
    margin-bottom: 30px;
  }
</style>
