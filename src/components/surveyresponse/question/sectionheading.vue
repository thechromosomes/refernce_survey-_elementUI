<template>
  <v-layout>
    <v-flex xs12>
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
</style>
