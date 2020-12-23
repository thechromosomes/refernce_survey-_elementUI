<template>
    <v-layout wrap class="conatiner_responceform">
        <reportheader v-if="surveyid" :surveyid="surveyid" active="9999"></reportheader>
        <v-flex xs12>
            <v-container class="conatiner_dashboard" v-if="question != null">
              <div class="allanswer_conatiner">
                <question :questiontext="question.questiontext"></question>
                <div v-if="question.questiontype =='multipletext'" class="allresponselist" >
                  <table class="table  table-left">
                    <tr> 
                      <td >Slno</td>
                      <td >User</td>
                      <td v-for="(choice, index) in question.choice" :key="`choice${index}`">{{choice.choicetext}}</td> 
                    </tr>
                    <template v-for="(answer, index) in allanswers">
                      <tr  :key="`answerid_${index}`">
                        <td>response {{index+1}}</td>
                        <td>{{answer.userdata.firstname}} {{answer.userdata.lastname}}</td>
                        <td v-for="(singleanswer, sindex) in answer.answer" :key="`answerid_${sindex}`">{{singleanswer.answer}}</td>
                      </tr>
                    </template>
                  </table>
                </div>
                <div v-else-if="question.questiontype =='customform'" class="allresponselist"  >
                  <table class="table  table-left">
                    <tr> 
                      <td >Slno</td>
                      <td >User</td>
                      <td v-for="(field, index) in question.customformdata" :key="`choice${index}`">{{field.title}}</td> 
                    </tr>
                    <template v-for="(answer, index) in allanswers">
                      <tr  :key="`answerid_${index}`">
                        <td>response {{index+1}}</td>
                        <td>{{answer.userdata.firstname}} {{answer.userdata.lastname}}</td>
                        <td v-for="(singleanswer, sindex) in answer.answer" :key="`answerid_${sindex}`">{{singleanswer.answer}}</td>
                      </tr>
                    </template>
                  </table>
                </div>
                <div v-else-if="question.questiontype =='multic'" >
                  <div class="answers" v-if="allanswers.length !=0 ">
                    <div class="answerset" v-for="(answer, index) in allanswers" :key="`answerid_${index}`">
                      <div class="allresponselist" v-if="answer.otheranswer !=''">
                        <table class="table  table-left">
                          <tr>
                            <td >Slno</td>
                            <td >user</td>
                            <td >Answer</td> 
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>{{answer.userdata.firstname}} {{answer.userdata.lastname}}</td>
                            <td>{{answer.otheranswer}}</td>
                          </tr>
                        </table>
                      </div>
                      <div class="allresponselist" v-else-if="answer.answer.length != 0">
                        <table class="table  table-left">
                          <tr>
                            <td >Slno</td>
                            <td >User</td> 
                            <td >Answer</td> 
                          </tr>
                          <tr v-for="(singleanswer, sindex) in answer.answer" :key="`answerid_${sindex}`">
                            <td>{{sindex + 1}}</td>
                            <td>{{answer.userdata.firstname}} {{answer.userdata.lastname}}</td>
                            <td>{{getseelctedchoice(singleanswer)}}</td>
                          </tr>
                        </table>
                      </div>                    
                    </div>
                  </div>
                  <div class="answers" v-else>
                    <h1>No answer</h1>
                  </div>
                </div>
                <div v-else-if="question.questiontype =='fileupload'" >
                  <div class="answers" v-if="allanswers.length !=0 ">
                    <div class="allresponselist">
                      <table class="table  table-left">
                        <tr>
                          <td >Slno</td>
                          <td >User</td> 
                          <td >Answer</td> 
                        </tr>
                        <tr v-for="(answer, index) in allanswers" :key="`answerid_${index}`">
                          <td>{{index + 1}}</td>
                          <td>{{answer.userdata.firstname}} {{answer.userdata.lastname}}</td>
                          <td v-html="getsurveyimage(answer.answer)"></td>
                        </tr>
                      </table>
                    </div>                    
                  </div>
                  <div class="answers" v-else>
                    <h1>No answer</h1>
                  </div>
                </div>
                <div v-else-if="question.questiontype =='singletext' || question.questiontype =='qtypedatetime' || question.questiontype =='commenttext' || question.questiontype =='emailtext' || question.questiontype =='ratescal' || question.questiontype == 'ratestars' || question.questiontype == 'numbertext'  || question.questiontype == 'nps' " >
                  <div class="answers" v-if="allanswers.length !=0 ">
                    <div class="allresponselist">
                      <table class="table  table-left">
                        <tr>
                          <td >Slno</td>
                          <td >User</td> 
                          <td >Answer</td> 
                        </tr>
                        <tr v-for="(answer, index) in allanswers" :key="`answerid_${index}`">
                          <td>{{index + 1}}</td>
                          <td>{{answer.userdata.firstname}} {{answer.userdata.lastname}}</td>
                          <td>{{answer.answer}}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div class="answers" v-else>
                    <h1>No answer</h1>
                  </div>
                </div>
                <div v-else-if="question.questiontype =='dropdown' || question.questiontype == 'singlec'" >
                  <div class="answers" v-if="allanswers.length !=0 ">
                    <div class="allresponselist">
                      <table class="table  table-left">
                        <tr>
                          <td >Slno</td>
                          <td >User</td> 
                          <td >Answer</td> 
                        </tr>
                        <tr v-for="(answer, index) in allanswers" :key="`answerid_${index}`">
                          <td>{{index + 1}}</td>
                          <td>{{answer.userdata.firstname}} {{answer.userdata.lastname}}</td>
                          <td v-if="answer.otheranswer == ''">{{getseelctedchoice(answer.answer)}}</td>
                          <td v-else>{{answer.otheranswer}}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div class="answers" v-else>
                    <h1>No answer</h1>
                  </div>
                </div>
                <div v-else-if="question.questiontype =='matrixquestion'" >
                  <div class="answers" v-if="allanswers.length !=0 ">
                    <div class="answerset" v-for="(singleanswer, index) in allanswers" :key="`answerid_${index}`">
                      <div class="allresponselist">
                        <table class="table  table-left">
                          <template v-if="singleanswer.answer != null">
                            <tr>
                              <td >Slno</td> 
                              <td >User</td> 
                              <td >SubQuestion</td> 
                              <td >Selected Answer</td> 
                            </tr>

                            <tr v-for="(sanswer, sindex) in singleanswer.answer" :key="`answerid_${sindex}`">
                              <td>{{sindex + 1}}</td>
                              <td>{{answer.userdata.firstname}} {{answer.userdata.lastname}}</td>
                              <td>{{getseelctedrow(sanswer.rowid)}}</td>
                              <td>{{getseelctedcol(sanswer.selected)}}</td>
                            </tr>
                          </template>
                        </table>
                      </div>                    
                    </div>
                  </div>
                  <div class="answers" v-else>
                    <h1>No answer</h1>
                  </div>
                </div> 
                <div v-else-if="question.questiontype =='ranking'" class="allresponselist">
                  <table class="table  table-left">
                    <tr> 
                      <td >Slno</td>
                      <td >User</td>
                      <td v-for="(choice, index) in question.choice" :key="`choice${index}`">{{choice.choicetext}}</td> 
                    </tr>
                    <template v-for="(answer, index) in allanswers">
                      <tr  :key="`answerid_${index}`">
                        <td>response {{index+1}}</td>
                        <td>{{answer.userdata.firstname}} {{answer.userdata.lastname}}</td>
                        <td v-for="(singleanswer, sindex) in answer.answer" :key="`answerid_${sindex}`">{{singleanswer.rank}}</td>
                      </tr>
                    </template>
                  </table>
                </div> 
                <div v-else-if="question.questiontype =='dataTable'" >
                  <template v-if="allanswers.length !=0 ">
                    <template v-for="(singleanswer, index) in allanswers">
                      <div class="answerset" :key="`answerid_${index}`">
                        <template v-for="(answer, aindex) in singleanswer.answer">
                          <div class="datatablequestion" v-if="answer" :key="`sans${aindex}`">
                            <h3  class="practicename" v-if="answer.practicename">{{answer.practicename}}</h3>
                            <table v-if="answer.finalAnswer" class="dtable table" style="background-color:transparent;">
                              <tr class="tableheader">
                                <th class="text-center" v-for="(col,index) in question.allcols" :key="`header${index}`">{{col.option}}</th>
                              </tr>
                              <template  v-if="answer.finalAnswer.length > 0" >
                                <template v-for="(AnswerData,index) in answer.finalAnswer">
                                <tr class="tabledata" :key="`datarow${index}`">
                                  <td class="text-center"  v-for="(col,index1) in question.allcols" :key="index1">{{AnswerData[col._id]}}</td>
                                </tr>
                                </template>
                              </template>
                            </table>
                          </div>
                        </template>
                      </div>                    
                    </template>
                  </template>
                  <template v-else>
                    <h1>No answer</h1>
                  </template> 
                </div> 
                <div v-else-if="question.questiontype =='contactInfo'" >
                  <template v-if="allanswers.length !=0 ">
                    <template v-for="(singleanswer, index) in allanswers">
                      <div class="answerset" :key="`answerid_${index}`">
                            <table class="dtable table" style="background-color:transparent;">
                              <tr class="tableheader">
                                <th class="text-center" rowspan="2" >Practice Name</th>
                                <th class="text-center" rowspan="2" >Email</th>
                                <th class="text-center" rowspan="2" >Phone</th>
                                <th class="text-center" rowspan="2">Fax</th>
                                <th class="text-center" rowspan="2">Website</th>
                                <th class="text-center" rowspan="2" >Address</th>
                                <th class="text-center" colspan="2" >Accreditation</th>
                              </tr>
                              <tr class="tableheader">
                                <th class="text-center" >Start Date</th>
                                <th class="text-center" >End Date</th>
                              </tr>
                        <template v-for="(answer, aindex) in singleanswer.answer">
                              <contactinfotr :answer="answer"  :key="`sans${aindex}`"></contactinfotr> 
                        </template>
                            </table>
                        <hr/>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </v-container>
        </v-flex>
    </v-layout>
</template> 
<script>
var dateFormat = require('dateformat');

var username=localStorage.username;
var datetime = new Date();
import Vue from 'vue'
import axios from 'axios';

import question from '../reviewquestion/question'
import displayheading from '../reviewquestion/sectionheading'
import displaycustomform from './customform'
import displaymultianswer from './multianswer'
import reportheader from './reportheader'
import contactinfotr from './contactinfo_all'

  export default {
  components: {question,displayheading,displaycustomform, displaymultianswer, reportheader, contactinfotr},
   data() {
    return {
      id:this.$route.params.id,
      currentuser:null,
      surveyid:null,
      surveydata:null,
      surveyconfig:null,
      allanswers:[],
      question:null,
      semesterid : "null"
    }
  },  
  methods: {
      getquestionno(index){
      var qno = 0;
      for (let i = 0; i < this.allanswers.length; i++) {
        if(i >= index){
          break;
        }
        var queselement = this.allanswers[i];
        if(queselement.type == 'welcomepage' || queselement.type == 'thankyoupage'  || queselement.type == 'sectionheading'  || queselement.type == 'pagebreak' || queselement.type == 'descriptionbox'){

        } else if(queselement.data.questiontext != ""){
          qno+=1;
        } else {
        }
      }
      return qno;
    },
    getsurveyimage(imagepath){
      return "<a target='_blink' href='"+window.publicfileurl+imagepath+"'>"+imagepath.substring(imagepath.indexOf("_")+1)+"</a>";
    },
    getseelctedchoice(choice){
      if(typeof(choice) == 'string'){
        var retdata = "";
        this.question.choice.forEach(element => {
          if(element._id == choice){
            retdata = element.choicetext
            return retdata
          }
        });
        return retdata
      } else if (typeof(choice) == 'object'){
        return choice.choicetext
      } else {
        return ""
      }
    },
    getseelctedrow(rowid){
      var retdata = ""
        this.question.allrows.forEach(element => {
          if(element._id == rowid){
            retdata = element.option
            return retdata
          }
        });
      return retdata
      
    },
    getselectedchoice(choiceid){
      if(this.question.choice){
        var alloptiondata = this.question.choice
        var selectedoption = alloptiondata.find(a => a._id == choiceid)
        if(selectedoption){
          return selectedoption.choicetext
        }
      }
      return ""
    },
    getseelctedcol(colid){
      var retdata = ""
      if(typeof(colid) == "object"){
        console.log(colid);
        var allcols = []
        colid.forEach(ccc => {
          this.question.allcols.forEach(element => {
            if(element._id == ccc){
              allcols.push(element.option)
              return retdata
            }
          });
        });
        retdata = allcols.join(" , ")
      } else {
        this.question.allcols.forEach(element => {
          if(element._id == colid){
            retdata = element.option
            return retdata
          }
        });
      }
      
      return retdata
    }
  },
  created() {
    if(this.id == "" || this.id == undefined){
      this.$router.push('/')
    } else {
      axios.post(`/getcurrentuser`,{'username':username}).then(response => {
        // JSON responses are automatically parsed.
        if(response.data == null){
          this.$router.push('/')
        }
        window.surveyuser = response.data;
        this.currentuser = response.data._id;
      })
      .catch(e => {
        this.errors.push(e)
      })
      axios.post(`/getquestion`,{
        'questionid':this.id
       }).then(response => {
        this.question = response.data.data;
        this.surveyid = this.question.surveyid;
    })
    .catch(e => {
    // this.errors.push(e)
    console.log(e);
    })      


      axios.post(`/allanswers`,{'questionid':this.id}).then(response => {
        if(response.data == null){
          } else {
            // this.allanswers = response.data;

       
      var all_answer = [];
       response.data.forEach(answer => {
        //  console.log("answer- ", answer);
         
         answer.answer = JSON.parse(answer.answer)
         if(answer.answer || answer.otheranswer != ''){
           all_answer.push(answer)
         }
       });

         this.allanswers = all_answer;
        }
      })


    }
    
  },
  watch: {
      surveyconfig :function(newdata, olddata){
          return newdata;
      }
    // whenever question changes, this function will run
  },
  computed:{
  }
}
</script>