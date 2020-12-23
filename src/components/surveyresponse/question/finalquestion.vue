<template>
    <div class="finalquestion">
        <template v-if="question != null">
            <template v-for="(extra, eindex) in questiondata.extras">
                <questionextra v-bind:key="`questionextra${eindex}`" :questiondata = "extra"></questionextra>
            </template>
            <v-layout>
                <v-flex xs1  class="finalquestionindex">
                    <template v-if="question.questiontype != 'qtypeslider'">
                        <span >{{questionno+1}}. <i title="Required" v-if="question.required == '1'" class="ico_requiredquestion fa fa-asterisk"></i></span> 
                        
                    </template>
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
                    <div class="multichoice" v-if="question.questiontype == 'multic'">
                        <multichoice :question = "question"></multichoice>
                    </div>
                    <div class="singlechoice" v-if="question.questiontype == 'singlec'">
                        <singlechoice :question = "question"></singlechoice>
                    </div>
                    <div class="ranking" v-if="question.questiontype == 'ranking'">
                        <ranking :allchoice="question.choice" :question = "question" ></ranking>
                    </div>
                    <div class="drop-down" v-if="question.questiontype == 'dropdown'">
                        <dropdown :allchoice = "question.choice" :question = "question" :qno="questionno" ></dropdown>
                    </div>
                    <div class="multipletext" v-if="question.questiontype == 'multipletext'">
                        <multitextinput :alltextinput = "question.choice" :question = "question" :qno="questionno" ></multitextinput>
                    </div>
                    <div class="singletext" v-if="question.questiontype == 'singletext'">
                        <textinput :textinput = "question" :qno="questionno" ></textinput>
                    </div>
                    <div class="commenttext" v-if="question.questiontype == 'commenttext'">
                        <vtextarea :textinput = "question" :qno="questionno" ></vtextarea>
                    </div>
                    <div class="numbertext" v-if="question.questiontype == 'numbertext'">
                        <numberinput :maskformat = "question.maskformat" :question = "question" :qno="questionno" ></numberinput>
                    </div>
                    <div class="ratescal" v-if="question.questiontype == 'ratescal'">
                        <ratescale :ratingdata = "question"></ratescale>
                    </div>
                    <nps v-if="question.questiontype == 'nps'" :npsdata = "question"></nps>
                    <div class="ratestars" v-if="question.questiontype == 'ratestars'">
                        <ratingstars :ratingdata = "question"></ratingstars>
                    </div>
                    <div class="ratestars" v-if="question.questiontype == 'emailtext'">
                        <emailtextbox :question = "question" :qno="questionno" ></emailtextbox>
                    </div>
                    <div class="qtypedatetime" v-if="question.questiontype == 'qtypedatetime'">
                        <dateinput :questiondata = "question" ></dateinput>
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
                        <customform  :customformdata="question.customformdata" :question="question" ></customform>
                    </div>
                    <div class="fileuploadtype" v-if="question.questiontype == 'fileupload'">
                        <fileupload :questiondata="question" ></fileupload>
                    </div>
                     <div class="fileuploadtype" v-if="question.questiontype == 'contactInfo'">
                        <contactInfo @contactinfochnaged="contactinfochnaged" :question="question"></contactInfo>
                    </div>
                     <div class="fileuploadtype" v-if="question.questiontype == 'dataTable'">
                        <dataTable :ciChangecount="ciChangecount" :question="question"></dataTable>
                    </div>
                    <div v-if="question.havecomment == true">
                        <div class="" v-if="question.commenttext != ''">
                            <label>{{question.commenttext}}</label>
                            <textarea class="xs12textarea resize" v-model="commenttext" @input="saveComment" ></textarea>
                        </div>
                        <div class="" v-else>
                            <label>Enter comment here</label>
                            <textarea class="xs12textarea resize" v-model="commenttext" @input="saveComment"></textarea>
                        </div>
                    </div>

                </v-flex>
            </v-layout>
        </template>
    </div>
</template>
<script>
import question from './question'
import multichoice from './multichoice'
import singlechoice from './singlechoice'
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
import fileupload from './fileupload'
import slider from './slider'
import ranking from './ranking'
import nps from './nps'
import questionextra from './questionextra'
import { log } from 'util';
import { ModelListSelect } from 'vue-search-select'
import contactInfo from './contactInfo'
import dataTable from './dataTable'
export default {
    props:['questiondata', 'qno', "ciChangecount"],
    components: {question,multichoice,singlechoice,dropdown, textinput, multitextinput, ratescale, vtextarea, numberinput,ratingstars,emailtextbox,dateinput, contactform,slider,matrixquestion, customform,fileupload,questionextra, ranking, nps, contactInfo, dataTable, ModelListSelect, contactInfo, dataTable},
    data() {
        return {
            question:null,
            questionno:this.qno,
            jumpdata:null,
            commenttext:""
        }
    },
        watch: {
      // whenever question changes, this function will run

      questionno: function (newQuestion, oldQuestion) {
      },
      questiondata: function (oldaBuilderArray, newaBuilderArray) {
        return this.questiondata;
      },
    },
    methods :{
        answersubmitted(){
            this.$parent.answersubmitted();
        },
        contactinfochnaged(){
            // console.log("from final question contactinfochnaged");
            
            this.$emit("contactinfochnaged", null);
        },
        saveComment(){
            this.debouncedSaveFinalComment();
        },
        saveFinalComment(){
            const this_attempt = window.surveyattemptid
            axios.post(`/submitquestioncomments`,{
                'questionid':this.questiondata._id,
                'attemptid':this_attempt._id,
                'commenttext':this.commenttext
                }).then(response => {
                // console.log(response)
            })
            .catch(e => {
                console.log(e);
            })

        },
        validatedform(status){
            // console.log("from final question- ", status);
            
            this.$parent.validatedform(status);
        },
    async sendImageFile(){
      const file = this.$refs.file.files[0];
      const formData = new FormData();
      formData.append("file", file);
      try{
        const res = await axios.post("/upload", formData);
        
        const this_user = window.surveyuser
        const this_attempt = window.surveyattemptid
        axios.post(`/updateattemptanswer`,{
            'surveyid':this.questiondata.surveyid,
            'userid':this_user._id,
            'questionid':this.questiondata._id,
            'attemptid':this_attempt._id,
            'answer':res.data.file
            }).then(response => {
            this.fileuploaded = file;
        })
        .catch(e => {
            console.log(e);
            
        })
      } catch(err){
          console.log(err);
          
      }
    }
},
  created() {
    this.debouncedSaveFinalComment = _.debounce(this.saveFinalComment, 500)
    const this_attempt = window.surveyattemptid
      axios.post('/getquestion',{"questionid":this.questiondata._id})
          .then(qresponse => {
            this.question = qresponse.data.data;
            axios.post(`/getalllogicjump`,{'questionid':this.question._id}).then(response => {
                this.jumpdata = response.data;
            })
            axios.post(`/getquestioncomments`,{
                'questionid':this.questiondata._id,
                'attemptid':this_attempt._id
            }).then(response => {
                if(response.data){
                    this.commenttext = response.data.comment
                }
            })
          })
  },
  computed: {
    // a computed getter
    questionfinalimage: function () {
      if(this.question.image.indexOf('://') > 0){
        return this.question.image;
      } else {
        return window.publicfileurl+this.question.image;
      }

        // return "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
    //   return window.publicfileurl+this.questiondata.image;
    }
  },
  watch:{
      questiondata:function(olddata, newdata){
          this.question = this.questiondata
          return this.questiondata
      },
      qno:function(olddata, newdata){
          this.questionno = this.qno
          return this.questionno
      }
  }


}
</script>
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
.input-group__details:before, .input-group__details:after {
    display: none;
}
.singlechoice .radio-group{ 
    padding-top: 0px !important;
}
</style>


