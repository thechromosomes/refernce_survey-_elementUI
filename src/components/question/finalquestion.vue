<template>
    <div class="finalquestion">
        <v-layout v-if="question != null">
            <v-flex xs1  class="finalquestionindex">
                <span v-if="question.questiontype != 'qtypeslider'">{{questionno+1}}.</span>
            </v-flex>
            <v-flex xs11 questionbox>
                <question :questiontext="question.questiontext" :qno="questionno" ></question>
                <template v-if="question.imagefirst">
                    <div class="finalquestionimage" v-if="question.image != '' && question.haveimage == '1' ">
                    <img :src="questionfinalimage" class="img-question"/>
                    </div>
                    <div class="finalquestiondescription" v-if="question.havedescription == '1'" v-html="question.description"></div>
                </template>
                <template v-else>
                    <div class="finalquestiondescription" v-if="question.havedescription == '1'" v-html="question.description"></div>
                    <div class="finalquestionimage" v-if="question.image != '' && question.haveimage == '1' ">
                    <img :src="questionfinalimage" class="img-question"/>
                    </div>
                </template>
                <div class="npsquestion" v-if="question.questiontype == 'nps'">
                    <v-btn-toggle v-model="toggle_exclusive">
                        <v-btn class="npsbtn">0</v-btn>
                        <v-btn class="npsbtn">1</v-btn>
                        <v-btn class="npsbtn">2</v-btn>
                        <v-btn class="npsbtn">3</v-btn>
                        <v-btn class="npsbtn">4</v-btn>
                        <v-btn class="npsbtn">5</v-btn>
                        <v-btn class="npsbtn">6</v-btn>
                        <v-btn class="npsbtn">7</v-btn>
                        <v-btn class="npsbtn">8</v-btn>
                        <v-btn class="npsbtn">9</v-btn>
                        <v-btn class="npsbtn">10</v-btn>
                    </v-btn-toggle>
                    <div class="npsscales">
                        <span class="npsscale text-left">{{question.npsleft}}</span>
                        <span class="npsscale text-middle">{{question.npsmiddle}}</span>
                        <span class="npsscale text-right">{{question.npsright}}</span>
                    </div>
                </div>
                <div class="multichoice" v-else-if="question.questiontype == 'multic'">
                    <div v-for="(choice, index) in question.choice" v-bind:key="index">
                        <checkbox :choicetext="choice" :ansno="index" ></checkbox>
                    </div>
                    <div v-if="question.other">
                        <v-container class="checkboxtop">
                            <v-checkbox v-if="question.othertext != ''" v-model="extrafield" :label="question.othertext" ></v-checkbox>
                            <v-checkbox v-else v-model="extrafield" :label="`Other, please specify`" ></v-checkbox>
                        </v-container>
                    </div>
                    <div v-if="extrafield">
                        <v-container class="checkboxtop">
                            <v-text-field  label="" ></v-text-field>
                        </v-container>
                    </div>
                </div>
                <div class="singlechoice" v-if="question.questiontype == 'singlec'">
                    <v-radio-group v-model="radioGroup">
                        <div v-for="(choice, index) in question.choice" v-bind:key="index">
                            <radiobutton :choicetext="choice" :ansno="index" :qno="questionno" ></radiobutton>
                        </div>
                    </v-radio-group>
                    <div v-if="question.other">
                        <v-container class="checkboxtop">
                            <v-checkbox v-if="question.othertext != ''" v-model="extrafield" :label="question.othertext" ></v-checkbox>
                            <v-checkbox v-else v-model="extrafield" :label="`Other, please specify`" ></v-checkbox>
                        </v-container>
                    </div>
                    <div v-if="extrafield">
                        <v-container class="checkboxtop">
                            <v-text-field  label="" ></v-text-field>
                        </v-container>
                    </div>
                </div>
                <div class="ranking" v-if="question.questiontype == 'ranking'">
                    <ranking :allchoice="question.choice" ></ranking>
                </div>
                <div class="drop-down" v-if="question.questiontype == 'dropdown'">
                    <dropdown :allchoice = "question.choice" :qno="questionno" ></dropdown>
                    <div v-if="question.other">
                        <v-container class="checkboxtop">
                            <v-checkbox v-if="question.othertext != ''" v-model="extrafield" :label="question.othertext" ></v-checkbox>
                            <v-checkbox v-else v-model="extrafield" :label="`Other, please specify`" ></v-checkbox>
                        </v-container>
                    </div>
                    <div v-if="extrafield">
                        <v-container class="checkboxtop">
                            <v-text-field  label="" ></v-text-field>
                        </v-container>
                    </div>
                </div>
                <div class="multipletext" v-if="question.questiontype == 'multipletext'">
                    <multitextinput :alltextinput = "question.choice" :qno="questionno" ></multitextinput>
                </div>
                <div class="singletext" v-if="question.questiontype == 'singletext'">
                    <textinput :textinput = "question.answertext" :qno="questionno" ></textinput>
                </div>
                <div class="commenttext" v-if="question.questiontype == 'commenttext'">
                    <vtextarea :textinput = "question.answertext" :qno="questionno" ></vtextarea>
                </div>
                <div class="numbertext" v-if="question.questiontype == 'numbertext'">
                    <numberinput :maskformat = "question.maskformat" :qno="questionno" ></numberinput>
                </div>
                <div class="ratescal" v-if="question.questiontype == 'ratescal'">
                    <ratescale :ratingdata = "question"></ratescale>
                </div>
                <div class="ratestars" v-if="question.questiontype == 'ratestars'">
                    <ratingstars :ratingdata = "question"></ratingstars>
                </div>
                <div class="ratestars" v-if="question.questiontype == 'emailtext'">
                    <emailtextbox ></emailtextbox>
                </div>
                <div class="qtypedatetime" v-if="question.questiontype == 'qtypedatetime'">
                    <dateinput :questiondata="question"></dateinput>
                </div>
                <div class="contacttext" v-if="question.questiontype == 'contacttext'">
                    <contactform :contactform = "question"></contactform>
                </div>
                <div class="qtypeslider" v-if="question.questiontype == 'qtypeslider'">
                    <slider :sliderdata = "question"></slider>
                </div>
                <div class="matrixquestion" v-if="question.questiontype == 'matrixquestion'">
                    <matrixquestion :matrixdata="question" ></matrixquestion>
                </div>
                <div class="customform" v-if="question.questiontype == 'customform'">
                    <customform :customformdata="question.customformdata" ></customform>
                </div>
                <div class="fileupload" v-if="question.questiontype == 'fileupload'">
                    <form class="form_dropzone" enctype="multipart/form-data">
                        <div class="dropzone">
                        <div>
                            <input type="file" ref="file" class="file-upload-input" />
                            <p  class="call-to-action">Drag your file here</p>
                        </div>
                        </div>
                    </form>
                </div>
                <div class="fileuploadtype" v-if="question.questiontype == 'contactInfo'">
                    <contactInfo :question="question"></contactInfo>
                </div>
                    <div class="fileuploadtype" v-if="question.questiontype == 'dataTable'">
                    <dataTable :question="question"></dataTable>
                </div>
                <div v-if="question.havecomment == true">
                  <!-- <v-text-field v-if="question.commenttext != ''" class="questiontextinput" :label="question.commenttext" ></v-text-field>
                  <v-text-field v-else class="questiontextinput" label="Enter Comment here" ></v-text-field> -->
                  <div class="" v-if="question.commenttext != ''">
                      <label>{{question.commenttext}}</label>
                      <textarea class="xs12textarea resize" ></textarea>
                  </div>
                  <div class="" v-else>
                      <label>Enter comment here</label>
                      <textarea class="xs12textarea resize" ></textarea>
                  </div>
                </div>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import question from './question'
import checkbox from './checkbox'
import radiobutton from './radiobutton'
import dropdown from './dropdown'
import textinput from './textinput'
import multitextinput from './multitextinput'
import ratescale from './ratescale'
import vtextarea from './vtextarea'
import numberinput from './numberinput'
import ratingstars from './ratingstars'
import emailtextbox from './emailtextbox'
import dateinput from './dateinput'
import contactform from './contactform'
import matrixquestion from './matrixquestion'
import customform from './customform'
import slider from './slider'
import ranking from './ranking'
import { ModelListSelect } from 'vue-search-select'
import contactInfo from './contactInfo'
import dataTable from './dataTable'
export default {
    props:['questiondata', 'qno'],
    components: {question,checkbox,radiobutton,dropdown, textinput, multitextinput, ratescale, vtextarea, numberinput,ratingstars,emailtextbox,dateinput, contactform,slider,matrixquestion, customform, ranking, ModelListSelect, contactInfo, dataTable},
    data() {
        return {
            question:null,
            questionno:this.qno,
            extrafield:false,
            toggle_exclusive:2
        }
    },
        watch: {
      // whenever question changes, this function will run
      questionno: function (newQuestion, oldQuestion) {
        // console.log("ssssssssssssssssssss");
      },
      questiondata: function (oldaBuilderArray, newaBuilderArray) {
        return this.questiondata;
      }
    },
  computed: {
    // a computed getter
    questionfinalimage: function () {
    if(this.questiondata.image.indexOf('://') > 0){
        return this.questiondata.image;
      } else {
        return window.publicfileurl+this.questiondata.image;
      }
        // return "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
    //   return window.publicfileurl+this.questiondata.image;
    }
  },
  created(){
      axios.post('/getquestion',{"questionid":this.questiondata._id})
          .then(qresponse => {
            this.question = qresponse.data.data;
            axios.post(`/getalllogicjump`,{'questionid':this.question._id}).then(response => {
                this.jumpdata = response.data;
            })
          })
  }


}
</script>
<style scoped>
.npsbtn.btn--active {
    background-color: #595959 !important;
}
</style>
<style>
.finalquestionindex{
    font-size: 24px !important;
    font-weight: 200!important;
}
.finalquestion .questionbox{
    padding-top: 0px;
    padding-bottom: 30px;
    margin-bottom: 20px;
    border-bottom: 1px solid #d6d6d6;
}
.singlechoice .radio-group{ 
    padding-top: 0px !important;
}
</style>
