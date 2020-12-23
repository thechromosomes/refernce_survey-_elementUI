<template>
    <div class="dateinput">
      <template v-if="questiondata.npsleft  && questiondata.npsright">
        <VueHotelDatepicker
          v-model="selecteddate"
          placeholder="select date range"
          :minDate="questiondata.npsleft"
          :maxDate="questiondata.npsright"
          :maxNight="dateLength"
          >
        </VueHotelDatepicker >
    </template>
    <template v-else>
      <v-date-picker v-model="selecteddate" ></v-date-picker>
    </template>
    </div>
</template>
<script>
import VueHotelDatepicker from '@northwalker/vue-hotel-datepicker'

export default {
    props:['questiondata'],
    components:{ VueHotelDatepicker},
    data() {
        return {
          questionpotres:"",
            selecteddate: null,
            menu: false,
            dateLength:1
        }
    },
    created: function () {
      if(this.questiondata.length){
        this.dateLength = parseInt(this.questiondata.length)-1
      }

    }

}
</script>