<template>
    <div class="customform">
        <v-layout row wrap>
            <div v-for="(data, index) in question.customformdata" :key="`element${index}`" :class="`flex ${getorigwidth(data.width)}`">
                <div class="Custom_element">
                    <v-text-field disabled v-if="data.type == 'Number'" :value="setoldanswer(data._id)" :data-id="data._id" :label="data.title" mask="###############"></v-text-field>
                    <v-text-field disabled v-if="data.type == 'Text'" :value="setoldanswer(data._id)" :data-id="data._id" :label="data.title"></v-text-field>
                    <v-text-field disabled v-if="data.type == 'Textarea'" :value="setoldanswer(data._id)" :data-id="data._id" :label="data.title"></v-text-field>
                    <v-text-field disabled v-if="data.type == 'Phone'"  :value="setoldanswer(data._id)" :data-id="data._id" :label="data.title" ></v-text-field>
                    <v-text-field disabled v-if="data.type == 'Time'" :value="setoldanswer(data._id)" :data-id="data._id" :label="data.title" mask="time"></v-text-field>
                    <v-text-field disabled v-if="data.type == 'Email'" :value="setoldanswer(data._id)" :data-id="data._id" :rules="[rules.email]" :label="data.title" ></v-text-field>
                    <textarea disabled v-if="data.type == 'textarea'" :value="setoldanswer(data._id)" :data-id="data._id" :placeholder="`${data.title}`" class="xs12textarea" rows="8"></textarea>
                </div>
            </div>
        </v-layout>
    </div>
</template>
<script>
export default {
    props:['customformdata','question'],
    data() {
        return {
            formdata:this.customformdata,
            rules: {
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                }
            },
            answer:[]
        }
    }, 
  methods: {
      getorigwidth(width){
          var strwidth = "xs12";
          switch (width) {
              case "8.3%":
                  strwidth="xs1";
                  break;
              case "16.6%":
                  strwidth="xs2";
                  break;
              case "25%":
                  strwidth="xs3";
                  break;
              case "33.3%":
                  strwidth="xs4";
                  break;
              case "41.6%":
                  strwidth="xs5";
                  break;
              case "50%":
                  strwidth="xs6";
                  break;
              case "58.3%":
                  strwidth="xs7";
                  break;
              case "66.6%":
                  strwidth="xs8";
                  break;
              case "75%":
                  strwidth="xs9";
                  break;
              case "83.3%":
                  strwidth="xs10";
                  break;
              case "91.6%":
                  strwidth="xs11";
                  break;
              case "100%":
                  strwidth="xs12";
                  break;
          }
        return strwidth;
      },
        setoldanswer(questionid){
            var retdata = "";
            this.answer.forEach(function(ans) {
                if(ans.id == questionid){
                    retdata = ans.answer;
                }
            });
            return retdata;
        }
  },
    created: function () {
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'questionid':this.question._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.answer = JSON.parse(response.data.data.answer)
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
.Custom_element{
    padding: 0px 10px 10px 10px;
    margin: 0px 10px 10px 10px;
}
.Custom_element:hover{
    background-color: #ebebeb;

}
</style>
