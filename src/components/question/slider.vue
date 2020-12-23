<template>
  <div class="preview_slider">
    <v-spacer></v-spacer>
    
<v-carousel>
    <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src" ></v-carousel-item>
  </v-carousel>
    </div>
</template>

<script>
  export default {
    props:['sliderdata'],
    data () {
      return {
        questiontext: this.sliderdata.questiontext,
        items: this.sliderdata.links
      }
    }
  }
</script>

<style scoped>
.preview_slider{
    margin-top: 30px;
}
</style>