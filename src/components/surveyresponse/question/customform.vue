<template>
    <div class="customform">
        <v-layout row wrap>
            <div v-for="(data, index) in question.customformdata" :key="`element${index}`" :class="`flex ${getorigwidth(data.width)}`">
                <div class="Custom_element">
                    <v-text-field data-type="number" class="subanswer" @blur="animatenow" :id="`subanswer${data._id}`" v-if="data.type == 'Number'" :value="setoldanswer(data._id)" @input="getanswer" :data-id="data._id"  :label="data.title"></v-text-field>
                    <v-text-field class="subanswer" @blur="animatenow" :id="`subanswer${data._id}`" v-if="data.type == 'Text'" :value="setoldanswer(data._id)" @input="getanswer" :data-id="data._id" :label="data.title"></v-text-field>
                    <v-text-field class="subanswer" @blur="animatenow" :id="`subanswer${data._id}`" v-if="data.type == 'Textarea'" :value="setoldanswer(data._id)" @input="getanswer" :data-id="data._id" :label="data.title"></v-text-field>
                    <v-text-field class="subanswer" @blur="animatenow" :id="`subanswer${data._id}`" v-if="data.type == 'Phone'"  :value="setoldanswer(data._id)" @input="getanswer" :data-id="data._id" :label="data.title" ></v-text-field>
                    <v-text-field class="subanswer" @blur="animatenow" :id="`subanswer${data._id}`" v-if="data.type == 'Time'" :value="setoldanswer(data._id)" @input="getanswer" :data-id="data._id" :label="data.title" mask="time"></v-text-field>
                    <v-text-field class="subanswer" @blur="animatenow" :id="`subanswer${data._id}`" v-if="data.type == 'Email'" :value="setoldanswer(data._id)" @input="getanswer" :data-id="data._id" :rules="[rules.email]" :label="data.title" ></v-text-field>
                    <textarea v-if="data.type == 'textarea'" :value="setoldanswer(data._id)" @input="getanswer" :data-id="data._id" :placeholder="`${data.title}`" class="xs12textarea" rows="8"></textarea>
                    <input type="hidden" v-model="questionpotres" />
                </div>
            </div>
        </v-layout>
    </div>
</template>
<script>
var animate = require('../../../models/cssAnimation.js');
export default {
    props:['customformdata','question'],
    data() {
        return {
            questionpotres:"",
            formdata:this.customformdata,
            rules: {
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                },
                number: value => {
                    const pattern = /^[1-9][0-9]*$/
                    return pattern.test(value) || 'Invalid Number.'
                }
            },
            answer:[]
        }
    }, 
  methods: {
      animatenow(){
        this.validatedform(true);
      },
      validatedform(animation = false){
        if(this.question.required == "1"){
            this.$parent.validatedform(false);
            var validation = true;
            this.question.customformdata.forEach(element => {
                var found = this.answer.find( a => a.id === element._id );
                if(found){
                    if(found.answer == ""){
                        if(element.required){
                            this.$parent.validatedform(false);
                            validation = false
                            animate.ErrorInput("#subanswer"+element._id, "error");
                            if(animation){
                                animate.animateCSS("#subanswer"+element._id, "shake");
                            }
                        } else {
                            animate.ErrorInput("#subanswer"+element._id, "success");
                        }
                    } else {
                        // console.log("element.type- ", element.type);
                        if(element.type == "Email"){
                            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            if(!pattern.test(found.answer)){
                                this.$parent.validatedform(false);
                                validation = false
                                animate.ErrorInput("#subanswer"+element._id, "error");
                                if(animation){
                                    animate.animateCSS("#subanswer"+element._id, "shake");
                                }
                            } else {
                                animate.ErrorInput("#subanswer"+element._id, "success");
                            }
                        } else if(element.type == "Number"){
                            const pattern = /^[1-9][0-9]*$/
                            if(!pattern.test(found.answer)){
                                this.$parent.validatedform(false);
                                validation = false
                                animate.ErrorInput("#subanswer"+element._id, "error");
                                if(animation){
                                    animate.animateCSS("#subanswer"+element._id, "shake");
                                }
                            } else {
                                animate.ErrorInput("#subanswer"+element._id, "success");
                            }
                        } else {
                            animate.ErrorInput("#subanswer"+element._id, "success");
                        }
                    }
                } else if(element.required) {
                    validation = false
                    animate.ErrorInput("#subanswer"+element._id, "error");
                    if(animation){
                        animate.animateCSS("#subanswer"+element._id, "shake");
                    }
                }
            });
            if(validation){
                this.$parent.validatedform(true);
            }
        } else {
          this.$parent.validatedform(true);
          animate.ErrorInput(".subanswer", "success");
        }
      },
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
      getanswer(newtext){
        //   console.log(event);
            var isfound = 0;
            var allans = this.answer;
            
            allans.forEach((element, index) => {
                if(element.id == event.target.dataset.id){
                    isfound = 1;
                    this.answer[index].answer = newtext
                }                
            });
            if(isfound == 0){
                
                this.answer.push({

                    id:event.target.dataset.id,
                    answer:newtext
                })
            }
            this.debouncedupdateattemptanswer()
        },
        updateattemptanswer(){
            const this_user = window.surveyuser
            const this_attempt = window.surveyattemptid
                var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
                surveyconfig = JSON.parse(surveyconfig)
                if(surveyconfig.honeypot == '1'){
                    if(this.questionpotres.length > 0){
                        axios.post(`/postbotresponse`,{
                            'surveyId':this.question.surveyid,
                            'userId':this_user._id,
                            'questionId':this.question._id,
                            'attemptId':this_attempt._id,
                            }).then(response => {
                        }).catch(e => {})
                    } else {
                        axios.post(`/updateattemptanswer`,{
                            'surveyid':this.question.surveyid,
                            'userid':this_user._id,
                            'questionid':this.question._id,
                            'attemptid':this_attempt._id,
                            'answer':this.answer
                            }).then(response => {
                        })
                        .catch(e => {
                            this.errors.push(e)
                        })
                    }
                } else {
                    axios.post(`/updateattemptanswer`,{
                        'surveyid':this.question.surveyid,
                        'userid':this_user._id,
                        'questionid':this.question._id,
                        'attemptid':this_attempt._id,
                        'answer':this.answer
                        }).then(response => {
                    })
                    .catch(e => {
                        this.errors.push(e)
                    })
                }
           

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
    this.debouncedupdateattemptanswer = _.debounce(this.updateattemptanswer, 200)
    var this_user = window.surveyuser
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'surveyid':this.question.surveyid,
      'userid':this_user._id,
      'questionid':this.question._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.answer = JSON.parse(response.data.data.answer)
            this.validatedform()
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
