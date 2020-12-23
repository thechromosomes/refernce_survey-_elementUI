<template>
    <v-container class="checkboxtop">
        <div class="checkin" v-for="(choice, index) in question.choice" v-bind:key="index">
            <v-checkbox disabled v-model="answer" :label="choice.choicetext" :value="choice._id" ></v-checkbox>
        </div>
        <div v-if="question.other" class="checkin">
          <v-checkbox readonly disabled v-model="extrafield" :label="`Other`" ></v-checkbox>
        </div>
        <div class="extraoption" v-if="extrafield">
          <v-text-field  readonly disabled label="Please Specify" v-model="otheranswer" ></v-text-field>
        </div>
    </v-container>
</template>
<script>
export default {
    props:['question'],
    data() {
        return {
            choicetexts:this.choicetext,
            answer:[],
            extrafield:false,
            otheranswer:""
        }
    },
    methods :{
    },
    watch:{
    },
    created: function () {
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'questionid':this.question._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            if(response.data.data.otheranswer){
              this.extrafield = true;
              this.otheranswer = response.data.data.otheranswer
            } else {
              this.answer = JSON.parse(response.data.data.answer)
            }
          }
        }
    })
    .catch(e => {
      this.errors.push(e)
    })
  }
}
</script>
<style>
.checkboxtop{
  padding-left: unset !important;
}
.checkboxtop .checkin {
    padding: 5px !important;
}
.checkboxtop .checkbox{
    top: unset !important;
}
.checkboxtop .checkin:hover{
    background-color: #ebebeb;
}
</style>
