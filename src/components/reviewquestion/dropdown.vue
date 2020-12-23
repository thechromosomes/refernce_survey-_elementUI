<template>
  <div class="">
    <div class="dropdown-btn">
        <v-flex xs12 sm4>
          <v-select disabled :items="choices" label="Select" v-model="answer" item-text="choicetext" 
            item-value="_id" ></v-select>
        </v-flex>
    </div> 
    <div v-if="question.other" class="checkin">
      <v-checkbox disabled readonly v-model="extrafield" :label="`Other`" ></v-checkbox>
    </div>
    <div class="extraoption" v-if="extrafield">
      <v-text-field readonly :id="`answer1${question._id}`"  label="Please Specify" v-model="otheranswer" ></v-text-field>
    </div>

  </div>
</template>
<script>
export default {
    props:['allchoice','question'],
    data() {
        return {
            choices:this.allchoice,
            answer: null,
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
<style scoped>
.dropdown-btn {
  padding: 10px;
}
</style>

     