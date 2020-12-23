
<template>
    <v-container class="scalerating">
        <v-subheader class="pl-0">Rated:-  {{rating}}</v-subheader>
    <v-layout row wrap >
        <v-flex>
          <v-slider
            v-model="rating"
            label="0"
            :max="ratingdata.length"
            thumb-label=true
          ></v-slider>
        </v-flex>
        <v-flex shrink style="width: 60px">
          <v-card-text>{{ratingdata.length}}</v-card-text>
        </v-flex>
      </v-layout>
    </v-container>
</template>
<script>
export default {
    props:['ratingdata'],
    data() {
        return {
            maxrating:this.ratingdata.length,
            rating:0
        }
    }
}
</script>
<style>
.vue-star-rating {
    display: inline-block !important;
}
.scalerating{
  padding: 0px !important;
}
.scalerating .subheader{
  height: 25px !important;
}
.scalerating .slider__thumb, .scalerating .slider__thumb--label, .scalerating .slider__track-fill{
  background-color: #d0cdc7 !important;
    border-color: #d0cdc7 !important;
}
</style>
