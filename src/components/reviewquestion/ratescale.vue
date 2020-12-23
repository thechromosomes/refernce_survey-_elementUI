
<template>
    <v-container class="scalerating">
        <v-subheader class="pl-0">Rated:-  {{rating}}</v-subheader>
    <v-layout row wrap >
        <v-flex>
          <v-slider
            v-model="rating"
            label="0"
            :max="ratingq.length"
            thumb-label
            disabled
          ></v-slider>
        </v-flex>
        <v-flex shrink style="width: 60px">
          <v-card-text>{{ratingq.length}}</v-card-text>
        </v-flex>
      </v-layout>
    </v-container>
</template>
<script>
export default {
  props:['ratingdata'],
  data() {
      return {
          ratingq:this.ratingdata,
          rating:0
      }
  },
  methods:{
  },
  created: function () {
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'questionid':this.ratingq._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.rating = JSON.parse(response.data.data.answer)
          }
        }
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
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
