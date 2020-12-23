<template>
    <div class="starrating">
       <star-rating read-only :rating="rating" :max-rating="cmaxrate" star-size=30 ></star-rating>
    </div>
</template>
<script>
import StarRating from 'vue-star-rating'
export default {
    props:['ratingdata'],
    components: {StarRating},
    data() {
        return {
            question:this.ratingdata,
            maxrating:this.ratingdata.maxrate,
            rating:0
        }
    },
    methods:{
    },
    created: function () {
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'questionid':this.ratingdata._id,
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
    computed: {
    // a computed getter
    cmaxrate: function () {
      // `this` points to the vm instance

      return parseInt(this.ratingdata.maxrate);
    }
    }
}
</script>
<style>
.vue-star-rating {
    display: inline-block !important;
}
</style>
