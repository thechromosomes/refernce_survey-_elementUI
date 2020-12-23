<template>
    <div class="dateinput">
    <v-card class="mx-auto" max-width="344" outlined>
      <v-list-item-title ><h3>selected Date</h3></v-list-item-title>
      <v-list-item-subtitle>{{selecteddate}}</v-list-item-subtitle>
    </v-card>
    </div>
</template>
<script>
export default {
    props:['questiondata'],
    data() {
        return {
            selecteddate:"",
            menu: false,
            dates:[],
        }
    },
    created: function () {
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'questionid':this.questiondata._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.selecteddate = response.data.data.answer
            var myString = response.data.data.answer;
            var array = new Array();
            let dates = []
            array = myString.split('to');
            dates.push(array[0]);
            dates.push(array[1]);
            this.dates.push(JSON.parse(dates))
          }
        }
    })
    .catch(e => {
      this.errors.push(e)
    })
  }

}
</script>
