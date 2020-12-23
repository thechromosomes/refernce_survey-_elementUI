<template>
    <v-layout wrap class="conatiner_responceform">
      <reportheader v-if="id && (userrole.indexOf('1')>=0 || userrole.indexOf('2')>=0 || userrole.indexOf('3')>=0)" :surveyid="id" active="88" :prevnext="prevnext" :attemptid="attemptid"></reportheader>
      <v-container class="conatiner_dashboard" v-if="surveydata != null && surveyconfig != null">
        <div class="surveydetails">
          <v-layout class="surveysect">
            <v-flex xs8>
              <div class="">Individual report</div>
              <h2>{{surveydata.surveyname}}</h2>
            </v-flex>
            <!-- <v-flex xs4 v-if="allresponse.length > 0">
              <button v-if="prevattempt" @click="changeResponse(-1)" class="exportbutton"><img class ="deletequestion roatate180" src="../assets/icons/arrow-circle-left-regular.svg" /> Prev</button>
              <button v-if="nextattempt" @click="changeResponse(1)" class="exportbutton">Next <img class ="deletequestion" src="../assets/icons/arrow-circle-left-regular.svg" /></button>
            </v-flex> -->
          </v-layout>
          <v-layout class="surveyressect">
            <v-flex xs12 sm6>
              <div>Total Question : {{totalquestionno}}</div>
              <div>Question skipped : -------</div>
              <div>Start time : {{datestarted}}</div>
              <div>Finish time : {{datefinished}}</div>
              <div v-if="attemptdata.anonymous" >User : Anonymous</div>
              <div v-else >User : <span v-if="attemptdata.userid.includes('_nologin')">Without login</span>
                            <userdetailssnipt v-else utype="span_nameonly" :uid="attemptdata.userid"></userdetailssnipt></div>
            </v-flex>
            <v-flex xs12 sm6>
              <div>Editor : <userdetailssnipt v-for="editor in surveyconfig.editor" :key="editor" utype="span_nameonly" :uid="editor"></userdetailssnipt></div>
              <div>Reviewer : <userdetailssnipt v-for="reviewer in surveyconfig.reviewer" :key="reviewer" utype="span_nameonly" :uid="reviewer"></userdetailssnipt></div>
              <div>Created : {{createddate}}</div>
              <div>Modified : {{modifiedddate}}</div>
              <div>Active : <span v-if="surveyconfig.active == '1'">Yes</span><span v-else>No</span></div>
            </v-flex>
          </v-layout>
          <v-layout class="surveyressect" >
            <v-flex xs12 sm6>
              <div>
                Export:-  <a @click="downloadexcelreport(attemptid)"><span class="exportbutton">CSV Export</span></a>
                  <a @click="exportPDFAllresponse"><span class="exportbutton">PDF Export</span></a>

              </div>
            </v-flex>
          </v-layout>
        </div>
      </v-container>
      <v-container class="responceform conatiner_dashboard" id="responceform">
        <div class="questionblock">
          <div v-for="(question, index) in builderarray" :key="`questionid_${index}`">
            <displayheading :sectiondata="question" v-if="question.questiontype === 'sectionheading'"></displayheading>
            <v-divider v-else-if="question.type === 'pagebreak'"></v-divider>
            <div class="welcomepage" v-else-if="question.questiontype == 'welcomepage'">
              <v-layout>
                <v-flex xs1  class="finalquestionindex">
                </v-flex>
                <v-flex xs11 questionbox>
                  <div v-html="question.welcomenote"></div>
                </v-flex>
              </v-layout>
            </div>
            <div class="descriptionbox" v-else-if="question.questiontype == 'descriptionbox'">
              <v-layout>
                <v-flex xs1  class="finalquestionindex">
                </v-flex>
                <v-flex xs11 questionbox>
                  <div v-html="question.description"></div>
                </v-flex>
              </v-layout>
            </div>
            <div class="thankyoupage" v-else-if="question.questiontype == 'thankyoupage'">
              <v-layout>
                <v-flex xs1  class="finalquestionindex">
                </v-flex>
                <v-flex xs11 questionbox>
                  <div v-html="question.thankyounote"></div>
                </v-flex>
              </v-layout>
            </div>
            <finalqestion :questiondata="question" :qno="getquestionno(index)" v-else-if="question.questiontext !== ''" ></finalqestion> 
            <!-- 
            -->
          </div>
        </div>
      </v-container>        
        <div class="floatcontainer bottom right" v-if="surveyconfig != null ">
          <div class="signlepageapproval">
            <v-checkbox label="Approve E" v-if="(surveyconfig.editor.indexOf(currentuser) != -1 || userrole.indexOf('1') >= 0 ) && have_editorapproval" @change="changeatemptstate(0)" v-model="attemptdata.approvededi" value="1"></v-checkbox>
            <v-checkbox label="Approve R" v-if="((surveyconfig.reviewer.indexOf(currentuser) != -1 && attemptdata.approvededi == 1 && have_reviewerapproval) || (userrole.indexOf('1') >= 0 && have_reviewerapproval)) && (have_reviewerapproval || !have_editorapproval )" @change="changeatemptstate(1)" v-model="attemptdata.approvedrev" value="1" ></v-checkbox>
            <v-checkbox label="Editor Approval Pending" readonly v-else-if="(surveyconfig.reviewer.indexOf(currentuser) != -1 && have_reviewerapproval) || ( have_reviewerapproval && !have_editorapproval )" v-model="attemptdata.approvedrev" value="1" disabled></v-checkbox>
            <v-checkbox  label="Complete" v-if="(((surveyconfig.reviewer.indexOf(currentuser) != -1 || surveyconfig.editor.indexOf(currentuser) != -1) && (attemptdata.approvedrev == '1' && attemptdata.approvededi == '1'))  || userrole.indexOf('1') >= 0 && have_complete) || (have_complete &&( !have_reviewerapproval || !have_editorapproval ))" @change="changeatemptstate(2)" v-model="attemptdata.completed" value="1" ></v-checkbox>
          </div>
        </div>
    </v-layout>
</template>
<script>
var dateFormat = require('dateformat');
var username=localStorage.username;
var mylibrary = require("../models/mainlib.js");
var datetime = new Date();
import Vue from 'vue'
import axios from 'axios';
import finalqestion from './reviewquestion/finalquestion'
import displayheading from './reviewquestion/sectionheading'
import userdetailssnipt from './users/userdetailssnipt'
import reportheader from './reports/reportheader'
import jsPDF from 'jspdf';

  export default {
  components: {finalqestion,displayheading,userdetailssnipt, reportheader},
   data() {
    return {
      id:null,
      attemptid:this.$route.params.id,
      prevnext:true,
      semesterid:"staticsemesterid",
      currentuser:"0",
      builderarray : [],
      currentquestion:1,
      messagebox:"",
      surveyconfig : null,
      surveydata : null,
      attemptdata:null,
      questionorder:[],
      datestarted:"",
      datefinished:"",
      modifiedddate:"",
      createddate:"",
      userrole:[], 
      have_editorapproval:false,
      have_reviewerapproval:false,
      have_complete:false,
      allresponse:[],
      pdf:null,
      margins : {
        top: 90,
        bottom: 40,
        left: 40,
        width: 550
      }
    }
  },  
  methods: {
    downloadexcelreport(respid){
      let loader = this.$loading.show({
          loader: 'dots'
      });
      axios.post(`/downlaodresponsexls`,{'respid':respid},{responseType: 'arraybuffer'}).then(response => {
        if(response.headers['content-type'].indexOf("application/json") >= 0){
          this.$toast.open.open({
              message:response.data.message,
              position:"top",
              type:"error"
            })
        } else {
          mylibrary.downloadfiles(response, "xlsx");
        }
        loader.hide();
      }).catch(e => {
        loader.hide();
        console.log("e- ", e)
      })
    },
    haveaccesstonav(){
      if(this.userrole.indexOf(1)>=0 || this.userrole.indexOf(2)>=0 || this.userrole.indexOf(3)>=0){
        return true;
      }
      return false;
    },
    pdfheader()
    {
        this.pdf.setFontSize(20);
        this.pdf.setTextColor(40);
        this.pdf.setFontStyle('normal');
        this.pdf.text(this.surveydata.surveyname, this.margins.left , 40);
        this.pdf.setLineCap(2);
        this.pdf.line(3, 70, this.margins.width + 43,70); // horizontal line
    },
    pdffooter(pageNumber, totalPages){
        var str = "Page " + pageNumber + " of " + totalPages
        this.pdf.setFontSize(10);
        this.pdf.text(str, this.margins.left, this.pdf.internal.pageSize.height - 20);
        this.pdf.line(3, 800, this.margins.width + 43,800); // horizontal line
        
    },
    headerFooterFormatting(totalPages)
    {
        for(var i = totalPages; i >= 1; i--)
        {
            this.pdf.setPage(i);              
            //header
            if(i == 1){
              this.pdfheader();
            }
            this.pdffooter(i, totalPages);
            this.pdf.page++;
        }
    }, 
    exportPDFAllresponse(){
      this.pdf = new jsPDF('p', 'pt', 'a4'); 
      var specialElementHandlers = { };
      var htmlcontent = "";
      axios.post("/downlaodresponsexls",{respid:this.attemptid,onlydata:true}).then(response => {
        console.log("this.pdf- ", this.pdf)
        if(response.data.data.length > 0){
          var heading = response.data.heading;
          htmlcontent += '<div style="padding-bottom:50px;font-family: sans-serif;">';
          heading.forEach(element => {
            if(element.length < 2){ return; }
            const head = element[0];
            const head1 = element[1];
            htmlcontent += '<div style=" font-weight: 600; padding-bottom:5px;" >'+head.value+': <span style="color: gray;">'+head1.value+'</span></div>';
          });
          htmlcontent += '</div>';
          htmlcontent += '<div style="padding-bottom:50px;"> </div>';
          var alldata = response.data.data;
          alldata.forEach((element,i) => {
            var m = "5px";
            if(i == 0){ m = "40px"; }
            var displayanswer = element.answer1.toString();
            var displaycomment = element.comment1.toString();
            
            element.answer1 = displayanswer.replace(/\n/g, "</div><div>");
            element.comment1 = displaycomment.replace(/\n/g, "</div><div>");

            htmlcontent += '<div style="margin-bottom:50px; padding: 5px; font-family: sans-serif;">';
            htmlcontent += '<div style="font-weight: 600; color:gray; padding-top:'+m+'; padding-bottom:10px;" >Q'+element.qno+': '+element.question+' </div>';
            if(element.other1.length > 0){
              htmlcontent += '<div style="font-weight: 600; color:gray; padding-top:40px; padding-bottom:10px;word-break: break-all;" >'+element.othertext+' </div>';
              htmlcontent += '<div style="padding-bottom: 10px;word-break: break-all;"><span style="">Other:</span> '+element.other1+'</div>';
            } else {
              htmlcontent += '<div style="padding-bottom: 10px;word-break: break-all; font-size:12px;"><span style="">Ans:</span> '+element.answer1+'</div>';
            }
            if(element.comment1.length > 0){
              htmlcontent += '<div style="font-weight: 600; padding-top:10px; padding-bottom:10px;word-break: break-all;" >'+element.commenttext+' </div>';
              htmlcontent += '<div style="padding-bottom: 30px;word-break: break-all;"><span style="">Comments:</span> '+element.comment1+'</div>';
            }
            htmlcontent += '</div>';
            
          });
          console.log(htmlcontent)
          htmlcontent=htmlcontent.replace(/<[^/>][^>]*><\/[^>]+>/gim, "");
          this.pdf.fromHTML(htmlcontent, this.margins.left, this.margins.top,
          {
            width: this.margins.width// max width of content on PDF
          },function(dispose) {},this.margins);
			    this.headerFooterFormatting(this.pdf.internal.getNumberOfPages());
          this.pdf.save('AllResponse_'+this.attemptid+'_'+Date.now()+'.pdf'); 

        } else {
          alert("Failed to load content");
        }
      })
      .catch(e => {
        console.log("cache error", e);
      })
    },    getexportlink(linkfor, resid){
      var retdata = "#";
      if(linkfor == 'csv'){
        retdata = axios.defaults.baseURL+"/downlaodresponsexls?respid="+resid;
      }
      return retdata;
    },
    changeatemptstate(check){
        var obj = this.attemptdata;
        var userid=this.currentuser;
        var attemptid = obj._id;
        var now = Date.now();
      if(check===0){
        if(obj.approvededi == "1"){
          now = "";
        }
      axios.post(`/approvebyeditor`,{'attemptid':obj._id,'status':obj.approvededi,'userid':userid}).then(response => {
        this.attemptdata.approvedbyedidate = now
        });
      }else if(check===1){
        if(obj.approvedrev == "1"){
          now = "";
        }
        axios.post(`/approvebyviewer`,{'attemptid':obj._id,'status':obj.approvedrev,'userid':userid}).then(response => {
        this.attemptdata.approvedbyrevdate = now

        }); 
      }else if(check===2){
        if(obj.completed == "1"){
          now = "";
        }
        axios.post(`/attemptcompleted`,{'attemptid':obj._id,'status':obj.completed,'userid':userid}).then(response => {
        this.attemptdata.completeddate = now

        });
      }
    },
    getquestionno(index){
      var qno = 0;
      for (let i = 0; i < this.builderarray.length; i++) {
        if(i >= index){
          break;
        }
        var queselement = this.builderarray[i];
        if(queselement.questiontype == 'qtypeslider' ||queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox'){
        } else if(queselement.questiontext != ""){
          qno+=1;
        } else {
        }
      }
      return qno;
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
    changeResponse(to){
      var thisindex = this.allresponse.indexOf(this.attemptid);
      var nextindex = thisindex+to;
      if(this.allresponse.length > nextindex && nextindex < this.allresponse.length){
        // this.$router.push("/responsedetails/"+this.allresponse[nextindex]) 
        location.href = "/responsedetails/"+this.allresponse[nextindex] 
      } else {
        this.$toast.open({
              message:"No attempt available",
              position:"top",
              type:"error"
          })
      }

    }
  },
  computed:{
    totalquestionno: function () {
      var qno = 0;
      for (let i = 0; i < this.builderarray.length; i++) {
        var queselement = this.builderarray[i];
        if(queselement.questiontype == 'qtypeslider' ||queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox'){
        } else if(queselement.questiontext != ""){
          qno+=1;
        } else {
        }
      }
      return qno;
    },
    nextattempt:function(){
      var thisindex = this.allresponse.indexOf(this.attemptid);
      if(thisindex < this.allresponse.length - 1){
        return this.allresponse[thisindex + 1]
      } else {
        return false;
      }
    },
    prevattempt:function(){
      var thisindex = this.allresponse.indexOf(this.attemptid);
      if(thisindex > 0){
        return this.allresponse[thisindex]
      } else {
        return false;
      }
    },
    
  },

  created() {

    if(this.attemptid == "" || this.attemptid == undefined){
      this.$router.push('/')
    } else {
      console.log("username-", username);
      
      axios.post(`/getcurrentuser`,{'username':username}).then(response => {
        // JSON responses are automatically parsed.
        if(response.data == null){
          this.$router.push('/')
        }
        this.currentuser = response.data._id;
        if(mylibrary.is_roleassigned(response.data.roles, "1")){
          this.userrole.push("1");
        }
        if(mylibrary.is_roleassigned(response.data.roles, "2")){
          this.userrole.push("2");
        }
        if(mylibrary.is_roleassigned(response.data.roles, "3")){
          this.userrole.push("3");
        }
      })
      .catch(e => {
        this.errors.push(e)
      })
      axios.post(`/getattemptsurvey`,{'attemptid':this.attemptid}).then(response => {
        if(response.data == null){
          this.$router.push('/')
        }
          this.attemptdata = response.data
          this.id = this.attemptdata.surveyid





      axios.post(`/allresponselist`,{'surveyid':this.id}).then(response => {
        if(response.data){
          response.data.forEach(attempdata => {
            this.allresponse.push(attempdata._id) 
          });
        }
      })
              axios.post(`/getallworkflow`,{'surveyid':this.attemptdata.surveyid}).then(reminders => {
              const allwordflow = reminders.data;
              this.allwordflow = allwordflow;
              const have_rev = allwordflow.filter( function(item) {
                  return (item.action == "1" && item.role == "2" && item.notifyrole != "");
              });
              if(have_rev.length > 0){ this.have_reviewerapproval = true }
              const have_editor = allwordflow.filter( function(item) {
                  return (item.action == "1" && item.role == "1" && item.notifyrole != "");
              });
              if(have_editor.length > 0){ this.have_editorapproval = true }
              const have_complete = allwordflow.filter( function(item) {
                  return (item.action == "2" && item.role != "" && item.notifyrole != "");
              });
              if(have_complete.length > 0){ this.have_complete = true }

            })




        if(this.attemptdata.datestarted != 0){
          this.datestarted = dateFormat(this.attemptdata.datestarted, "yyyy-mm-dd ")
        }
        if(this.attemptdata.datefinished != 0){
          this.datefinished = dateFormat(this.attemptdata.datefinished, "yyyy-mm-dd ")
        }
         if(this.attemptdata.approvedrev)
         this.attemptdata.approvedrev = this.attemptdata.approvedrev.toString();
         if(this.attemptdata.approvededi)
         this.attemptdata.approvededi = this.attemptdata.approvededi.toString();
         if(this.attemptdata.completed)
         this.attemptdata.completed = this.attemptdata.completed.toString();

        window.surveyattemptid = response.data
        this.id = response.data.surveyid
        axios.post(`/getsurvey`,{'surveyid':response.data.surveyid}).then(response => {
        // JSON responses are automatically parsed.
          this.surveydata = response.data;
            this.modifiedddate = dateFormat(this.surveydata.modifiedddate, "yyyy-mm-dd ")
            this.createddate = dateFormat(parseInt(this.surveydata.createddate), "yyyy-mm-dd ")
        })
        axios.post(`/getsurveyconfig`,{'surveyid':this.id}).then(response => {
          if(response.data == null){
          } else {
              this.surveyconfig = response.data.data;
          }
        })
        .catch(e => {
          this.errors.push(e)
        })
        
        var skipcontactinfo = [];
        axios.post(`/getquestions`,{'surveyid':this.id}).then(qsresponse => {
          var qsresponse_data = qsresponse.data;
            
            axios.post(`/getquestionorder`,{'surveyid':this.id}).then(response => {
              this.questionorder = response.data
              this.questionorder.forEach(element => {
                  qsresponse_data.forEach(q => {
                    q.order = element.order
                    var contactinfo = null;
                    if( q.qtype && q.qtype.length > 10 && q.questiontype == "dataTable") {
                      if(!skipcontactinfo.includes(q.qtype)){
                        skipcontactinfo.push(q.qtype);
                        var existingindex = qsresponse_data.findIndex( ques => ques._id == q.qtype );
                        contactinfo = qsresponse_data.find( ques => ques._id == q.qtype );
                        if(contactinfo){
                          this.builderarray.push(contactinfo)
                          contactinfo = null
                        }
                        if(existingindex >= 0){
                          qsresponse_data.splice(existingindex,1);
                        }
                      }
                    }
                    if(q._id == element.questionid && !skipcontactinfo.includes(q._id)){
                        skipcontactinfo.push(q._id);
                        this.builderarray.push(q)
                    }
                  });
              });
            })
            .catch(e => {
              console.log(e);
            })
          })

      });    
    }
  },
  watch: {
      surveyconfig :function(newdata, olddata){
          return newdata;
      }
    // whenever question changes, this function will run
  }
}
</script>
