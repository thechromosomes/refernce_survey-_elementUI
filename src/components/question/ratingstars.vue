<template>
    <div class="starrating">
       <star-rating @rating-selected="rating = $event" :rating="rating" :max-rating="cmaxrate" star-size=30></star-rating>
    </div>
</template>
<script>
import StarRating from 'vue-star-rating'
export default {
    props:['ratingdata'],
     components: {StarRating},
    data() {
        return {
            maxrating:this.ratingdata.maxrate,
            rating:0
        }
    },computed: {
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
