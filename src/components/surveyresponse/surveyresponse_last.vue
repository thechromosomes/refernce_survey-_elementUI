<template>
    <v-layout v-if="rerender == 1" wrap class="conatiner_responceform paddingbottom50">
      <div class="messagebox" v-if="messagebox != ''">{{messagebox}}</div>
      <div class="messagebox error" v-if="errormessagebox != ''">{{errormessagebox}}</div>
        <v-flex xs12 v-if="navstyle == 0">
          <div class="surveybanner" v-if="surveyconfig != null">
            <img class="imginsheadonly" :src="getsurveyimage(surveyconfig.coverphoto)" />
            <div class="overview">
              <div class="surveydata" @click="getprogress" v-if="surveyconfig.display != '0'">
                <h1 class="surveyname">{{surveydata.surveyname}}</h1>
                    <div class="progress_timeline " v-html="progressdata">
                    </div> 
              </div>
              <div class="surveydata new_placement_cover" @click="getprogress" v-else>
                <h1 class="surveyname">{{surveydata.surveyname}}</h1>
                    <div class="progress_timeline " v-html="progressdata">
                    </div> 
              </div>
            </div>
          </div>
        </v-flex>
        <v-flex class="responseheadermobile" v-if="scrolled >= 250 || navstyle != 0">
          <template v-if="surveyconfig != null">

            <img class="imginsheadonly" :src="getsurveyimage(surveyconfig.coverphoto)" />
          <div class="surveybanner">
            <div class="overview">
              <div class="surveydatamobile" @click="getprogress" v-if="surveyconfig.display != '0'">
                <h1 class="surveyname">{{surveydata.surveyname}}</h1>
                    <div class="progress_timelinemobile" v-html="progressdata">
                    </div> 
              </div>
              <div class="surveydatamobile" @click="getprogress" v-else>
                <h1 class="surveyname">{{surveydata.surveyname}}</h1>
                    <div class="progress_timelinemobile " v-html="progressdata">
                    </div> 
              </div>
            </div>
              
          </div>
          </template>
        </v-flex>
        <v-container class="responceform" id="responceform" v-if="surveyconfig.display == '0' && havelogicjump==0">
            <div class="questionblock">
                <div v-for="(question, index) in finalbuilderarray" :key="`questionid_${index}`" >
                    <displayheading :sectiondata="question" v-if="question.questiontype === 'sectionheading'"></displayheading>
                    <v-divider v-else-if="question.questiontype === 'pagebreak'"></v-divider>
                    <div class="descriptionbox" v-else-if="question.questiontype == 'descriptionbox'">
                    <v-layout>
                      <v-flex xs1  class="finalquestionindex">
                      </v-flex>
                      <v-flex xs11 questionbox>
                        <div v-html="question.description"></div>
                        <div class="questionimagepreview" v-if="question.image != '' && question.haveimage == '1' ">
                          <img :src="questionfinalimage(question.image)" class="img-question"/>
                        </div>

                      </v-flex>
                    </v-layout>
                    </div>
                    <finalqestion :questiondata="question" :qno="getquestionno(index)" v-else-if="question.questiontext !== '' || question.questiontype == 'qtypeslider'" ></finalqestion>
                </div>
            </div>
            <v-layout v-if="surveydata != null">
              <v-flex xs1></v-flex>
              <v-flex xs11 class="text-center">
                <button class="btn-custom1" @click="finishSurvey">Submit</button>
              </v-flex>
            </v-layout>
        </v-container>
        <v-container v-else class="responceform" id="responceform">
          <div class="questionblock" v-if="is_submitted == false && currentquestiondata != null && readytodisplay == true">
              <mobileresponse :question="currentquestiondata" :qno="getquestionno(currentquestion)"></mobileresponse>
              <div class="questio_nav_buttons">
                <button class="btn-custom1" v-if="prevquestion != -1" @click="changequestion(prevquestion)">Previous</button>
                <button class="btn-custom1" v-if="nextquestion != finalbuilderarray.length" @click="changequestion(nextquestion)">Next</button>
                <template v-else>
                  <button class="btn-custom1"  @click="finishSurvey">Finish</button>
                </template>
              </div>
          </div>
          <div class="questionblock" v-if="is_submitted == true">
            <h1>Submitting Survey...</h1>
          </div>
        </v-container>
    </v-layout>
</template>
<script>
var username=localStorage.username;
var datetime = new Date();
import Vue from 'vue'
import axios from 'axios';
import finalqestion from './question/finalquestion'
import displayheading from './question/sectionheading'
import mobileresponse from './mobileresponse'
import { setTimeout } from 'timers';
// import questionwithjump from './questionwithjump'
  export default {
  components: {finalqestion,displayheading,mobileresponse},
   data() {
    return {
      id:null,
      rerender:1,
      attemptid:this.$route.params.id,
      semesterid:"staticsemesterid",
      currentuser:"0",
      builderarray : [],
      finalbuilderarray : [],
      questiontypes : ["multic","singlec","ratescal","ratestars","qtypeslider","qtypedatetime","dropdown","matrixquestion","singletext","multipletext","commenttext","numbertext","customform","emailtext","fileupload","ranking", "nps"],
      questiontomerge : ["sectionheading","descriptionbox"],
      questionorder : [],
      workflows : [],
      prevquestion:-1,
      currentquestion:0,
      nextquestion:1,
      havelogicjump:0,
      currentquestiondata:null,
      messagebox:"",
      errormessagebox:"",
      is_submitted:false,
      surveyconfig : null,
      surveydata : null,
      readytodisplay:true,
      progressdata : "",
      prevq:null,
      validated:false,
      currentq:0,
      currentqdata:null,
      nextq:null,
      cuerrentjump:null,
      singlequestionhistory:[],
      thankyounotes:[],
      jumptype1:["","multic","singlec","dropdown",],
      jumptype2:["","numbertext","ratestars","ratescal"],
      scrolled:0,
      navstyle:0,
      sitekey:""
    }
  },  
  methods: {
    answersubmitted(){
      if(this.nextquestion < this.finalbuilderarray.length ){
        this.changequestion(this.nextquestion);
      } else {
        this.finishSurvey();
      }
    },
    questionfinalimage(path){
      return window.publicfileurl+path;
    },
    validatedform(status){
        console.log("from surveyresponse- ", status);
        this.validated = status;
    },
    startNewattempt(){
        axios.post(`/attemptsurvey`,{'surveyid':this.id,'userid':this.currentuser,'semesterid':this.semesterid}).then(response => {
            window.surveyattemptid = response.data.data
            // this.$router.push('/surveyresponse/'+response.data.data._id);
            location.href = '/surveyresponse/'+response.data.data._id;
        })        
    },
    finishSurvey(){
      if(!this.validated){
         this.errormessagebox = "Please answer all required question"
         return ;
      }
      axios.post(`/checkallquestionattempt`,{'attemptid':this.attemptid, surveyid:this.id}).then(response => {
        if(response.data != "1" && this.surveyconfig.display == '0' && this.havelogicjump==0){
          this.errormessagebox = "Please answer all required question."
        } else {
          if(this.surveyconfig.recaptcha != "1"){
            axios.post(`/finishattempt`,{'attemptid':this.attemptid,token:"token"}).then(response => {
              if(response.data != null){
                this.messagebox = "Submitted"
                this.debouncedclearmsg()
                if(this.surveyconfig.mode == 1){
                  setTimeout(() => {
                    this.startNewattempt();
                  }, 1000);
                } else {
                  location.href = '/surveythankyou/'+this.attemptid;
                }
              } else {
                  this.errormessagebox = "Unable to save Survey"
              }
            }) 
          } else {
            var that = this;
            that.$recaptcha('login').then((token) => {
              axios.post(`/finishattempt`,{'attemptid':that.attemptid,token:token}).then(response => {
                if(response.data != null){
                  that.messagebox = "Submitted"
                  that.debouncedclearmsg()
                  if(that.surveyconfig.mode == 1){
                    setTimeout(() => {
                      that.startNewattempt();
                    }, 1000);
                  } else {
                    location.href = '/surveythankyou/'+that.attemptid;
                  }
                } else {
                  that.errormessagebox = "Failed to validate submit request"
                }
              }) 
            }).catch(function(err) {
                that.errormessagebox = "Failed to validate recaptcha"
            });
          }
        }
      })
    },
    clearmsg(){
      this.messagebox = ""
      this.errormessagebox = ""
    },
    changequestion(changeto){
      // console.log("change to -------", changeto);
      const currentquest = this.currentquestiondata
      // this.readytodisplay = false
      // console.log(currentquest);
      if(this.currentquestion > changeto){
        if(this.singlequestionhistory.length > 0){
          this.singlequestionhistory.splice(this.singlequestionhistory.length - 1, 1);
          this.prevquestion = this.singlequestionhistory[this.singlequestionhistory.length - 1 ];
          setTimeout(() => {
            this.onlychangequestion(changeto);
          }, 100);
            return 0;
        }
      } else if(currentquest.questiontype == "descriptionbox"){
          setTimeout(() => {
            this.onlychangequestion(changeto);
          }, 100);
          return 0;
      } 
      if(!this.validated){
         this.errormessagebox = "Invalid Answer"
         return ;
      }
      axios.post(`/getattemptanswer`,{
        'surveyid':this.id,
        'userid':this.currentuser,
        'questionid':this.currentquestiondata._id,
        'attemptid':this.attemptid
        }).then(response => {
          const userres = response.data.data;
          if(this.currentquestiondata.required == "1"){
            if(userres == null){
              this.errormessagebox = "This question is required"
              // this.readytodisplay = true
              return ;
            } else {
              var givenanswer = "";
              if(userres.answer){
                givenanswer = JSON.parse(userres.answer);
              }
              if(givenanswer.length == 0 && userres.otheranswer != ""){
                givenanswer = userres.otheranswer;
              }
              if( givenanswer.length == 0){
                this.messagebox = "This question is required"
              } else {
                if(this.jumptype1.indexOf(currentquest.questiontype)>0 || this.jumptype2.indexOf(currentquest.questiontype)>0){
                  axios.post(`/getalllogicjump`,{'questionid':currentquest._id}).then(response1 => {
                    const thisjumdata = response1.data;
                    if(thisjumdata.length < 0){
                      this.onlychangequestion(changeto);
                      changed = 1
                      return;
                    } else{
                      var changed = 0
                      thisjumdata.forEach(jumps => {
                        if(this.jumptype2.indexOf(currentquest.questiontype)>0){
                          if(jumps.nextquestion != "" && jumps.condition != "" && jumps.answer != ""){
                            if(jumps.goto == 0){
                              this.finalbuilderarray.forEach((element, eindex) => {
                                if(jumps.condition == "<"){
                                  if(element._id == jumps.nextquestion && givenanswer < jumps.answer && changed == 0){
                                    this.onlychangequestion(eindex);
                                    changed = 1
                                    return;
                                  }
                                } else if(jumps.condition == ">"){
                                  if(element._id == jumps.nextquestion && givenanswer > jumps.answer && changed == 0){
                                    this.onlychangequestion(eindex);
                                    changed = 1
                                    return;
                                  }

                                } else if(jumps.condition == "="){
                                  if(element._id == jumps.nextquestion && givenanswer == jumps.answer && changed == 0){
                                    this.onlychangequestion(eindex);
                                    changed = 1
                                    return;
                                  }
                                } else if(jumps.condition == "!="){
                                  if(element._id == jumps.nextquestion && givenanswer != jumps.answer && changed == 0){
                                    this.onlychangequestion(eindex);
                                    changed = 1
                                    return;
                                  }
                                }
                              });
                              this.thankyounotes.forEach((element, eindex) => {
                                if(jumps.condition == "<"){
                                  if(element._id == jumps.nextquestion && givenanswer < jumps.answer && changed == 0){
                                    this.finishSurvey();
                                    changed = 1
                                    return;
                                  }
                                } else if(jumps.condition == ">"){
                                  if(element._id == jumps.nextquestion && givenanswer > jumps.answer && changed == 0){
                                    this.finishSurvey();
                                    changed = 1
                                    return;
                                  }

                                } else if(jumps.condition == "="){
                                  if(element._id == jumps.nextquestion && givenanswer == jumps.answer && changed == 0){
                                    this.finishSurvey();
                                    changed = 1
                                    return;
                                  }
                                } else if(jumps.condition == "!="){
                                  if(element._id == jumps.nextquestion && givenanswer != jumps.answer && changed == 0){
                                    this.finishSurvey();
                                    changed = 1
                                    return;
                                  }
                                }
                              });
                              
                            }
                          }  
                        } else if(this.jumptype1.indexOf(currentquest.questiontype)>0){
                          // console.log(jumps.choiceid+" == "+givenanswer);
                          
                          if(jumps.nextquestion != "" && jumps.choiceid == givenanswer){
                            if(jumps.goto == 0){
                              this.finalbuilderarray.forEach((element, eindex) => {
                                if(element._id == jumps.nextquestion && changed == 0){
                                  this.onlychangequestion(eindex);
                                  changed = 1
                                  return;
                                }
                              });
                              this.thankyounotes.forEach((element, eindex) => {
                                if(element._id == jumps.nextquestion && changed == 0){
                                  this.finishSurvey();
                                  changed = 1
                                  return;
                                }
                              });
                            }
                          }  
                        }
                      });
                      if(changed == 0){
                        this.onlychangequestion(changeto);
                        changed = 1
                        return;
                      }
                    }
                  })
                } else {
                  this.onlychangequestion(changeto);
                  changed = 1
                  return;
                }
              } 
            }
          } else {
            // console.log("else"+userres);
            if(userres == null){
              this.onlychangequestion(changeto);
              changed = 1
              return;
            } else {
              var givenanswer = "";
              if(userres.answer){
                givenanswer = JSON.parse(userres.answer);
              }
              if(givenanswer.length == 0 && userres.otheranswer != ""){
                givenanswer = userres.otheranswer;
              }
              if( givenanswer.length == 0){
                this.onlychangequestion(changeto);
                changed = 1
                return;
              } else {
                if(this.jumptype1.indexOf(currentquest.questiontype)>0 || this.jumptype2.indexOf(currentquest.questiontype)>0){
                  axios.post(`/getalllogicjump`,{'questionid':currentquest._id}).then(response1 => {
                    const thisjumdata = response1.data;
                    // console.log("jumpdata");
                    // console.log(thisjumdata);
                    if(thisjumdata.length < 0){
                      this.onlychangequestion(changeto);
                      changed = 1
                      return;
                    } else{
                      var changed = 0
                      thisjumdata.forEach(jumps => {
                        // console.log("currentquest");
                        // console.log(currentquest);
                        
                        if(this.jumptype2.indexOf(currentquest.questiontype)>0){
                          if(jumps.nextquestion != "" && jumps.condition != "" && jumps.answer != ""){
                            if(jumps.goto == "0"){
                              this.finalbuilderarray.forEach((element, eindex) => {
                                if(jumps.nextquestion == "<"){
                                  if(element._id == jumps.nextquestion && givenanswer < jumps.answer && changed == 0){
                                    this.onlychangequestion(eindex);
                                    changed = 1
                                    return;
                                  }
                                } else if(jumps.nextquestion == ">"){
                                  if(element._id == jumps.nextquestion && givenanswer > jumps.answer && changed == 0){
                                    this.onlychangequestion(eindex);
                                    changed = 1
                                    return;
                                  }

                                } else if(jumps.nextquestion == "="){
                                  if(element._id == jumps.nextquestion && givenanswer == jumps.answer && changed == 0){
                                    this.onlychangequestion(eindex);
                                    changed = 1
                                    return;
                                  }
                                } else if(jumps.nextquestion == "!="){
                                  if(element._id == jumps.nextquestion && givenanswer != jumps.answer && changed == 0){
                                    this.onlychangequestion(eindex);
                                    changed = 1
                                    return;
                                  }
                                }
                              });
                              this.thankyounotes.forEach((element, eindex) => {
                                if(jumps.nextquestion == "<"){
                                  if(element._id == jumps.nextquestion && givenanswer < jumps.answer && changed == 0){
                                    this.finishSurvey();
                                    changed = 1
                                    return;
                                  }
                                } else if(jumps.nextquestion == ">"){
                                  if(element._id == jumps.nextquestion && givenanswer > jumps.answer && changed == 0){
                                    this.finishSurvey();
                                    changed = 1
                                    return;
                                  }

                                } else if(jumps.nextquestion == "="){
                                  if(element._id == jumps.nextquestion && givenanswer == jumps.answer && changed == 0){
                                    this.finishSurvey();
                                    changed = 1
                                    return;
                                  }
                                } else if(jumps.nextquestion == "!="){
                                  if(element._id == jumps.nextquestion && givenanswer != jumps.answer && changed == 0){
                                    this.finishSurvey();
                                    changed = 1
                                    return;
                                  }
                                }
                              });
                            }
                          }  
                        } else if(this.jumptype1.indexOf(currentquest.questiontype)>0){
                          if(jumps.nextquestion != "" && jumps.choiceid == givenanswer){
                            if(jumps.goto == 0){
                              this.finalbuilderarray.forEach((element, eindex) => {
                                if(element._id == jumps.nextquestion && changed == 0){
                                  changed = 1;
                                  // console.log("changed to - "+element._id);
                                  
                                  this.onlychangequestion(eindex);

                                  return 0;
                                }
                              });
                              this.thankyounotes.forEach((element, eindex) => {
                                if(element._id == jumps.nextquestion && changed == 0){
                                  this.finishSurvey();
                                  changed = 1
                                  return;
                                }
                              });
                            }
                          }  
                        }
                      });
                      if(changed == 0){
                        // console.log("chenged from outside loop");
                        
                        this.onlychangequestion(changeto);
                        changed = 1
                        return;
                      }
                    }
                  })
                } else {
                  this.onlychangequestion(changeto);
                  changed = 1
                  return;
                }
              } 
            }            
          }
          // console.log(response);
      })
      .catch(e => {
        // console.log(e);
        
      })      
    // 
    },
    onlychangequestion(changeto){
      this.validated = false;
      if(this.currentquestion < changeto){
        this.singlequestionhistory.push(this.currentquestion)
        this.prevquestion = this.currentquestion;
      } else {
        // this.prevquestion = this.singlequestionhistory[this.singlequestionhistory.length - 1];
      }
      if(changeto == 0){
        this.prevquestion = -1;
      }
      this.currentquestion = changeto;
      this.currentquestiondata = this.finalbuilderarray[changeto];
      this.nextquestion = changeto + 1;
      this.readytodisplay = false;
      setTimeout(() => {
        this.readytodisplay = true;
      }, 500);
      this.getprogress()
    },
      getsurveyimage(imagepath){
        if(imagepath == "" || imagepath == null){
            return "https://source.unsplash.com/collection/4728778/1600x900/";
        } else if(imagepath.indexOf('unsplash.com') >= 0){
          return imagepath;
        }  else {
            return window.publicfileurl+imagepath;
        }
    },
      getquestionno(index){
      var qno = 0;
      for (let i = 0; i < this.finalbuilderarray.length; i++) {
        if(i >= index){
          break;
        }
        var queselement = this.finalbuilderarray[i];
        if(queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox'|| queselement.questiontype == 'qtypeslider'){

        } else if(queselement.questiontext != ""){
          qno+=1;
        } else {
        }
      }
      return qno;
    },
    totalquestion(){
      var totalquestion = 0;
      for (let i = 0; i < this.finalbuilderarray.length; i++) {
        var queselement = this.finalbuilderarray[i];
        if(queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox'|| queselement.questiontype == 'qtypeslider'){

        } else if(queselement.questiontext != ""){
          totalquestion+=1;
        } else {
        }
      }
      return totalquestion;
    },
    getprogress(){
      this.debouncedgetprogress_interval();
      },
    getprogress_interval(){
      var totalques = this.totalquestion();
        axios.post(`/totalattempt`,{'attemptid':this.attemptid}).then(response => {
          var answered  = response.data
          window.at_total = totalques
          window.at_attempted = totalques
          this.progressdata = '<div class="progress-bar_timeline" style="position: absolute; top: 0px; width: '+(answered / totalques)*100+'%;"></div><span class="sr-only_timeline spcll " style="font-weight: 500;"> '+answered +' out of '+totalques+' completed </span>';
        });
      
      
    },
    handleScroll(e){
      this.scrolled = window.scrollY
    },
    handleResize(e){
      if(window.innerWidth <= 768){
      console.log("inner");
        this.navstyle = 1;
      } else {
        this.navstyle = 0;
      }
    }
  },
  created() {
    localStorage.setItem("attemptemail", "");
    localStorage.setItem("attemptuserid", "");
    this.sitekey = window.recaptch_sitekey;
    if(window.innerWidth <= 768){
    console.log("inner");
      this.navstyle = 1;
    }
    this.debouncedclearmsg = _.debounce(this.clearmsg, 2000)
    this.debouncedgetprogress_interval = _.debounce(this.getprogress_interval, 2000)
    this.debouncedgetprogress = _.debounce(this.getprogress, 2000)
    if(this.attemptid == "" || this.attemptid == undefined){
      this.$router.push('/')
    } else {
      axios.post(`/getattemptsurvey`,{'attemptid':this.attemptid}).then(response => {
        if(response.data == null){
          this.$router.push('/')
        }
          if(response.data.state == 1){

            this.$router.push('/surveythankyou/'+this.attemptid)
          }
          window.surveyattemptid = response.data
          this.id = response.data.surveyid
          axios.post(`/getalllogicjumpfromsurvey`,{'surveyid':this.id}).then(response => {
            // console.log("getalllogicjumpfromsurvey");
            // console.log(response);
            this.havelogicjump = response.data.length
            
          })

        axios.post(`/getsurvey`,{'surveyid':response.data.surveyid}).then(response => {
          // JSON responses are automatically parsed.
          this.surveydata = response.data;
        })
        axios.post(`/getallworkflow`,{'surveyid':response.data.surveyid}).then(response => {
          // JSON responses are automatically parsed.
          this.workflows = response.data;
        })
        axios.post(`/getallwelcomethankyoudata`,{'surveyid':response.data.surveyid,datatype:'thankyoupage'}).then(response => {
          if(response.data == null){
          } else {
              this.thankyounotes = response.data;
          }
        })
        axios.post(`/getsurveyconfig`,{'surveyid':this.id}).then(response => {
        if(response.data == null){
        } else {
            this.surveyconfig = response.data.data;
            localStorage.setItem("sconfig_"+this.attemptid,JSON.stringify(this.surveyconfig));
            if(this.surveyconfig.active != "1" ){
              this.$router.push('/swtl/'+this.id);
            }
        }
      })
      .catch(e => {
        this.errors.push(e)
      })
        this.currentuser = response.data.userid
        axios.post(`/getuserbyid`,{'userid':this.currentuser}).then(response => {
          // console.log(response)
          // JSON responses are automatically parsed.
          if(response.data.status == 0){
            window.surveyuser = {
              '_id': this.currentuser,
            }
            // this.currentuser = "nologin"
          } else{
            window.surveyuser = response.data.user;
            this.currentuser = response.data.user._id
          }
          axios.post(`/getquestions`,{'surveyid':this.id}).then(response => {
            this.builderarray = response.data
            // this.currentquestiondata = this.builderarray[this.currentquestion]
            // console.log("loop finish");
            axios.post(`/getquestionorder`,{'surveyid':this.id}).then(response => {
              this.questionorder = response.data
              var extras = [];
              this.questionorder.forEach(element => {
                this.builderarray.forEach(q => {
                  q.order = element.order
                  if(q._id == element.questionid ){
                    if(this.questiontypes.indexOf(q.questiontype)>=0 || (q.questiontype == 'descriptionbox' && q.required == "1")){
                      if(q.questiontext != "" || q.questiontype == 'qtypeslider'){
                        q.extras = extras;
                        this.finalbuilderarray.push(q)
                        extras = [];
                      } else if((q.questiontype == 'descriptionbox' && q.required == "1")){
                        q.extras = extras;
                        this.finalbuilderarray.push(q)
                      }
                    } else if(this.questiontomerge.indexOf(q.questiontype)>=0){
                      extras.push(q)
                    }
                  }
                });
              });
              this.currentquestiondata = this.finalbuilderarray[this.currentquestion]
            })
          })
          .catch(e => {
            this.errors.push(e)
          })
        })
      })
      .catch(e => {
        this.errors.push(e)
      })
      this.debouncedgetprogress();
    }
    
  },
  watch: {
    // whenever question changes, this function will run
    currentquestiondata :function(olddata, newdata){
      // console.log("currentquestiondata- ", this.currentquestiondata);
      this.validated = false;
      if(this.currentquestiondata.required == 0){
        this.validated = true;
      }
      return this.currentquestiondata;
    },
    messagebox :function(olddata, newdata){
      if(this.messagebox != ""){
        this.debouncedclearmsg()
      }
    },
    errormessagebox :function(olddata, newdata){
      if(this.errormessagebox != ""){
        this.debouncedclearmsg()
      }
    },
    currentquestion :function(olddata, newdata){
      this.debouncedgetprogress_interval();
      return this.currentquestion;
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
  },
  updated(){
    this.debouncedgetprogress_interval();
  },
}
</script>
<style scoped>
.responceform .finalquestionimage{
    width: 100%;
}
.responceform .finalquestionimage img{
    max-width: 100%;
}
.responceform .emailinput .layout{
    padding: 0px 10px !important;
}
</style>
