<template>
    <v-layout wrap class="conatiner_responceform">
        <reportheader :surveyid="id" active="3"></reportheader>
        <v-flex xs12>
          <v-container class="conatiner_dashboard" v-if="surveydata != null">
            <div class="surveydetails">
              <v-layout class="surveysect">
                <v-flex xs12> 
                  <div class="">Individual report</div>
                  <h2>{{surveydata.surveyname}}</h2>
                  </v-flex>
              </v-layout>
              <v-layout class="surveyressect">
                <v-flex xs12 sm6>
                  <div>Total Response : {{responselist.length}}</div>
                  <div>Average Time : {{averageresponsetime}}</div>
                  <div>First response : {{firstresponse}}</div>
                  <div>Last response : {{lastresponse}}</div>
                  <div>Active : <span v-if="surveyconfig.active == '1'">Yes</span><span v-else>No</span></div>
                  <v-layout><v-flex xs6 d-flex>
                   <model-list-select :list="contacts"
                     v-model="listid"
                     option-value="contactid"
                     @input="contactlistid"
                     option-text="contactname"
                     placeholder="Select Contact list"></model-list-select>
                  </v-flex><v-flex xs6 d-flex>
                    <div class=""><br/>
                    <button @click="resetallresponse" class="exportbutton">Reset</button>

                    </div>
                  </v-flex></v-layout>
                </v-flex>
                <v-flex xs12 sm6>
                  <div>Editor : <userdetailssnipt v-for="editor in surveyconfig.editor" :key="editor" utype="span_nameonly" :uid="editor"></userdetailssnipt></div>
                  <div>Reviewer : <userdetailssnipt v-for="reviewer in surveyconfig.reviewer" :key="reviewer" utype="span_nameonly" :uid="reviewer"></userdetailssnipt></div>
                <div>Created : {{createddate}}</div>
                  <div>Modified : {{modifiedddate}}</div>
                </v-flex>
              </v-layout>
              <v-layout class="surveyressect" >
                <v-flex xs12 sm6>
                  <div>
                    <span class="exportbutton" @click="getexportalllink('csv', id)">CSV Export</span>
                    <span class="exportbutton" @click="getexportalllresponseink('csv', id)">CSV Export All Response</span>
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </v-container>
          <v-container class="conatiner_dashboard">
            <v-card>
              <v-card-title>Individual Report<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
              <v-data-table :headers="headers" :items="responselist" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left" v-if="props.item.anonymous">Anonymous</td>
                  <td class="text-xs-left" v-else>{{props.item.userdetails.firstname}} {{props.item.userdetails.lastname}} </td>
                  <td class="text-xs-left" v-if="props.item.datestarted">{{props.item.datestarted}} </td>
                  <td class="text-xs-left" v-else>Not Started</td>
                  <td class="text-xs-left" v-if="props.item.datefinished">{{ props.item.datefinished }}</td>
                  <td class="text-xs-left" v-else>Not Finished</td>
                  <td class="text-xs-left" v-if="props.item.anonymous">Anonymous</td>
                  <td class="text-xs-left" v-else>{{ props.item.createdip }}</td>
                  <td>
                    <a v-if="props.item._id" :href="`/responsedetails/${props.item._id}`">details <img class ="deletequestion" src="../assets/icons/arrow-circle-left-regular.svg" /></a>
                  </td>
                  <td>
                    <a v-if="props.item._id" :href="`/editresponsedetails/${props.item._id}`">Edit <img class ="deletequestion" src="../assets/icons/arrow-circle-left-regular.svg" /></a>
                  </td>
                    <template v-if="props.item._id">
                  <td>
                      <v-btn class="btn-extrasmall" @click="deleteresponse(props.item._id)"><img class ="deletequestion" src="../assets/icons/trash-alt-light.svg" /></v-btn>
                  </td>
                  <td>
                      <span class="exportbutton" @click="downloadexcelreport(props.item._id)">CSV Export</span>
                  </td>
                  <td>
                      <a target="_blank" class="exportbutton" @click="pdfexport(props)">PDF Export</a>
                  </td>
                    </template>
                    <template v-else>
                  <td>
                      <span class="exportbutton" @click="startattempt(props.item.userdetails.userid, props.item.userdetails.email)">Submit survey</span>
                  </td>
                  <td>
                  </td>
                  <td>
                  </td>
                    </template>
                </template>
              </v-data-table>
            </v-card>
          </v-container>
          <v-container v-if="htmlcontents !=''">
            <div class="table-responsive" v-html="htmlcontents"></div>
          </v-container>
        </v-flex>
    </v-layout>
</template> 
<script>
var dateFormat = require('dateformat');
var mainlib = require('../models/mainlib'); 
import userdetailssnipt from './users/userdetailssnipt'
import reportheader from './reports/reportheader'
import { ModelListSelect } from 'vue-search-select'

var username=localStorage.username;
var datetime = new Date();
import Vue from 'vue'
import axios from 'axios';
import jsPDF from 'jspdf';
  export default {
  components: {userdetailssnipt, reportheader,ModelListSelect},
   data() {
    return {
      id:this.$route.params.id,
      currentuser:null,
      surveydata:null,
      createddate:null,
      modifiedddate:null,
      surveyconfig:null,
      responselist:[],
      contactdata:[],
      noresponse:[],
      listid:null,
      contacts:[],
      semesterid : "null",
      averageresponsetime : 0,
      search: '',
      pagination: {
        rowsPerPage: 100
      },
      headers: [
        {
          text: 'User',
          align: 'left',
          value: 'userdetails.firstname',
        },
        { text: 'Date Started', value: 'datestarted' },
        { text: 'Date submitted', value: 'datefinished' },
        { text: 'IP', value: 'createdip' },
        { text: 'Details',sortable: false, },
        { text: 'Edit',sortable: false, },
        { text: '',sortable: false, },
        { text: '',sortable: false, },
        { text: '',sortable: false, },
      ],
      htmlcontents:"",
      pdf:null,
      margins : {
        top: 90,
        bottom: 40,
        left: 40,
        right: 40,
        width: 520
      }
    }
  },  
  methods: {
    startattempt(userid, email){
      if(userid){
        localStorage.setItem("attemptuserid", userid);
        var url = window.siteurl+'swl/'+this.id
        var settings ='height='+window.screen.height+',top=0,left=0,width='+window.screen.width
        popupWindow = window.open(url,winName,settings)
      } else {
        var winName = "Response page";
        localStorage.setItem("attemptemail", email);
        var url = window.siteurl+'swtl/'+this.id
        var settings ='height='+window.screen.height+',top=0,left=0,width='+window.screen.width
        popupWindow = window.open(url,winName,settings)
      }

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
        
    },
    headerFooterFormatting(totalPages)
    {
        for(var i = totalPages; i >= 1; i--)
        {
            this.pdf.setPage(i);                            
            //header
            this.pdfheader();
            this.pdffooter(i, totalPages);
            this.pdf.page++;
        }
    },
    pdfexport(data){
      console.log("data >>>>>>>> ", data.item.userdetails._id)
      let id = data.item._id
      this.pdf = new jsPDF('p', 'pt', 'a4'); 
      var specialElementHandlers = { };
      var htmlcontent = "";
      let loader = this.$loading.show({
        loader: 'dots'
      });

      axios.post("/downlaodresponsexls",{respid:id,onlydata:true}).then(response => {
        loader.hide();
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
            htmlcontent += '<div style="font-weight: 600; color:#B0CA36; padding-top:'+m+'; padding-bottom:10px;" >Q'+element.qno+': '+element.question+' </div>';
            if(element.other1.length > 0){
              htmlcontent += '<br/><div style="font-weight: 600; color:#B0CA36; padding-top:40px; padding-bottom:10px;word-break: break-all;" >'+element.othertext+' </div>';
              htmlcontent += '<div style="padding-bottom: 10px;word-break: break-all;"><span style="">Other:</span> '+element.other1+'</div>';
            } else {
              htmlcontent += '<div style="padding-bottom: 10px;word-break: break-all;"><span style="">Ans:</span> '+element.answer1+'</div><br/>';
            }
            if(element.comment1.length > 0){
              htmlcontent += '<div style="font-weight: 600; padding-top:10px; padding-bottom:10px;word-break: break-all;" >'+element.commenttext+' </div>';
              htmlcontent += '<div style="padding-bottom: 30px;word-break: break-all;"><span style="">Comments:</span> '+element.comment1+'</div>';
            }
            htmlcontent += '</div>';
          });
          this.pdf.fromHTML(htmlcontent, this.margins.left, this.margins.top,
          {
            width: this.margins.width// max width of content on PDF
          },function(dispose) {
            console.log("dispose- ", dispose)
          },this.margins);
			    this.headerFooterFormatting(this.pdf.internal.getNumberOfPages());
          this.pdf.save('AllResponse_'+id+'_'+Date.now()+'.pdf'); 
        } else {
          this.$toast.open({
              message:"Failed to get data",
              position:"top",
              type:"error"
          })
        }
      })
      .catch(e => {
        loader.hide();
        console.log(e)
          this.$toast.open({
              message:"Failed to load content",
              position:"top",
              type:"error"
          })
      })
    },
    exportPDFAllresponse(){
      var doc = new jsPDF({
        orientation: 'landscape'
      }); 
      this.$toast.open({
          message:"PDF Export is under process",
          position:"top",
          type:"info"
      })
      return;
      var specialElementHandlers = { };
      var htmlcontent = "";
      axios.post("/getallresponsedataexcel",{surveyid:this.id,onlydata:true}).then(response => {
        if(response.data.headers.length > 0){
          htmlcontent += "<table>";
          var headers = response.data.headers[0];
          var specification = response.data.headers[1];
          var exceldata = response.data.exceldata;
          htmlcontent += "<tr>";
          headers.forEach((element, i) => {
            if(i > 30){
              return;
            }
            htmlcontent += "<th>"+element.value+"</th>";
          });
          htmlcontent += "</tr>";
          htmlcontent += "<tr>"
          specification.forEach((spec, i) => {
            if(i > 30){
              return;
            }
            htmlcontent += "<td>"+spec.value+"</td>";
          });
          htmlcontent += "</tr>"
          exceldata.forEach((row) => {
            htmlcontent += "<tr>"
            specification.forEach((spec, i) => {
              if(i > 30){
                return;
              }
              if(row['val'+i]){
                htmlcontent += "<td>"+row['val'+i]+"</td>";
              } else {
                htmlcontent += "<td></td>";
              }
            });
            htmlcontent += "</tr>"
          });
          htmlcontent += "</table>";
          // this.htmlcontents = htmlcontent;
          console.log(htmlcontent);
          // doc.fromHTML("<table><tr><th>Respondent ID</th><th>Start Date</th><th>End Date</th><th>Email</th></tr></table>", 15, 15, {
          // doc.fromHTML("<table><tr><th>Respondent ID</th><th>Start Date</th><th>End Date</th><th>Email</th><th>First Name</th><th>Last Name</th><th>What is you name</th><th>Commenting</th><th>Number type question</th><th>Email type Question</th><th>Rating slider</th><th>Rating star</th><th>Date input</th><th>File type question</th><th>Another single text input type question</th><th>Enter Address</th><th></th><th></th><th></th><th></th><th>Matrix questions</th><th></th><th></th><th></th><th>comment here</th><th>multi text  inpot form</th><th></th><th></th><th></th><th>Rankimg question</th><th></th><th></th><th></th><th>Multi choice question</th><th></th><th></th><th></th><th>Other input in multi choice</th><th>multi choice comment</th><th>Single Choice Answer</th><th>other in single choice</th><th>Drop Down questiom</th><th>other drop</th></tr></table>", 15, 15, {
          // doc.fromHTML(htmlcontent); 
          // doc.save('AllResponse.pdf'); 
        } else {
          alert("Failed to load content");
        }
      })
      .catch(e => {
        console.log("cache error", e);
      })




    },
    getexportalllink(linkfor, resid){
      let loader = this.$loading.show({
          loader: 'dots'
      });
      axios.post(`/downlaodresponseuserxls`,{'surveyid':resid},{responseType: 'arraybuffer'}).then(response => {
        if(response.headers['content-type'].indexOf("application/json") >= 0){
          this.$toast.open({
              message:response.data.message,
              position:"top",
              type:"error"
            })
        } else {
          mainlib.downloadfiles(response, "xlsx");
        }
        loader.hide();
      }).catch(e => {
        loader.hide();
        console.log("e- ", e)
      })
    },
    getexportalllresponseink(linkfor, resid){
      let loader = this.$loading.show({
          loader: 'dots'
      });
      axios.post(`/getallresponsedataexcel`,{'surveyid':resid},{responseType: 'arraybuffer'}).then(response => {
        if(response.headers['content-type'].indexOf("application/json") >= 0){
          this.$toast.open({
              message:response.data.message,
              position:"top",
              type:"error"
            })
        } else {
          mainlib.downloadfiles(response, "xlsx");
        }
        loader.hide();
      }).catch(e => {
        loader.hide();
        console.log("e- ", e)
      })
    },
    downloadexcelreport(respid){
      let loader = this.$loading.show({
          loader: 'dots'
      });
      axios.post(`/downlaodresponsexls`,{'respid':respid},{responseType: 'arraybuffer'}).then(response => {
        if(response.headers['content-type'].indexOf("application/json") >= 0){
          this.$toast.open({
              message:response.data.message,
              position:"top",
              type:"error"
            })
        } else {
          mainlib.downloadfiles(response, "xlsx");
        }
        loader.hide();
      }).catch(e => {
        loader.hide();
        console.log("e- ", e)
      })
    },
    deleteresponse(respid){
      // deletesurveyresponse
      axios.post(`/deletesurveyresponse`,{'responseid':respid}).then(response => {
        // JSON responses are automatically parsed.
        if(response.data.n==1){
            this.$toast.open({
              message:"Response deleted successfully",
              position:"top",
              type:"success"
            })
            this.resetallresponse();
          } else {
            this.$toast.open({
              message:"Failed to delete Response.",
              position:"top",
              type:"error"
            })
          }
      })
      .catch(e => {
        this.$toast.open({
          message:"Failed to delete Response.",
          position:"top",
          type:"error"
        })
      })
    },
    getsurveyimage(imagepath){
        if(imagepath == "" || imagepath == null){
            return "https://source.unsplash.com/collection/4728778/1600x900/";
        } else if(imagepath.indexOf('unsplash.com') >= 0){
        return imagepath;
      } else {
            return window.publicfileurl+imagepath;
        }
    },
    getexceptionreportlist(){
      this.allresponsereport= [];
      this.noresponse= [];
      this.responselist= [];
      if(this.listid){
        axios.post(`/getexceptionreportlist`,{'surveyid':this.id, "contactd":this.listid}).then(response => {
          this.noresponse = response.data.noresponse;
          response.data.allresponse.forEach(element => {
            if(element.datestarted){
              element.datestarted = dateFormat(element.datestarted, "yyyy-mm-dd hh:MM:ss TT");
            }
            if(element.datefinished){
              element.datefinished = dateFormat(element.datefinished, "yyyy-mm-dd hh:MM:ss TT");
            }
            this.responselist.push(element);
          });
          // this.responselist = response.data.allresponse;
        }).catch(e => {
        })
      }
    },
    resetallresponse(){
      this.listid = null
      axios.post(`/allresponselist`,{'surveyid':this.id}).then(response => {
        if(response.data == null){
            console.log();
        } else {
          var all_response = [];
          var attempttime = 0
          var attemptcount = 0
          response.data.forEach(attempdata => {
            var finishedtme = "";
            var createdip = "";
            if(attempdata.createdip != undefined){
                createdip = attempdata.createdip;
            }
            if(attempdata.datefinished != 0){
                finishedtme = dateFormat(attempdata.datefinished, "yyyy-mm-dd hh:MM:ss TT");
                attempttime += (attempdata.datefinished - attempdata.datestarted) / 1000;
                attemptcount++;
            }
            all_response.push({
              _id:attempdata._id,
              userid:attempdata.userid,
              surveyid:attempdata.surveyid,
              semesterid:attempdata.semesterid,
              state:attempdata.state,
              anonymous:attempdata.anonymous,
              useremail:attempdata.useremail,
              userdetails:attempdata.userdetails,
              createdip:createdip,
              datestarted:dateFormat(attempdata.datestarted, "yyyy-mm-dd hh:MM:ss TT"),
              datefinished:finishedtme,
            }) 
          });    
          this.responselist = all_response;
          this.averageresponsetime = mainlib.secondtoStringtime(attempttime / attemptcount);
        }
      })
    },
    contactlistid: function(){
      setTimeout(() => {
        axios.post(`/getcontactsdata`,{'listid':this.listid}).then(response => {
          this.contactdata = ["selected"];
          response.data.forEach(contactuserid => {
            // console.log("contactuserid- ", contactuserid);
              if(contactuserid.userid != ""){
                this.contactdata.push(contactuserid.userid)
              } else if(contactuserid.email){
                this.contactdata.push(contactuserid.email)
              } else {
                
              }
              });
             })
           .catch(e => {
          //  this.errors.push(e)
         })
        
      }, 100);
    },


  },
  computed:{
    firstresponse: function () {
      if(this.responselist.length > 0){
        return this.responselist[0].datestarted
      } else{
        return "No response"
      }
    },
    lastresponse: function () {
      if(this.responselist.length > 0){
        return this.responselist[this.responselist.length - 1].datestarted
      } else{
        return "No response"
      }
    },
    surveycreated: function () {
        if(this.surveydata.createddate != undefined){
          return "fdjglkdjgl"
          // return dateFormat(this.surveydata.createddate, "yyyy/mm/dd");
        } else {
          return "bbbbbbb";
          // return this.surveydata.createddate
        }
    },
    surveymodified: function () {
        if(this.surveydata.modifiedddate != undefined){
            return "cccccccccc";
        } else {
          return "ddddddddddd"
            // return dateFormat(datetime, "yyyy/mm/dd");
        }
    },
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
      axios.post(`/getsurvey`,{'surveyid':this.id}).then(response => {
        if(response.data == null){
          this.$router.push('/')
        } else {
          this.resetallresponse();
            this.surveydata = response.data;
            this.modifiedddate = dateFormat(this.surveydata.modifiedddate, "yyyy-mm-dd hh:MM:ss TT")
            this.createddate = dateFormat(parseInt(this.surveydata.createddate), "yyyy-mm-dd hh:MM:ss TT")
        }
      })
      .catch(e => {
        this.errors.push(e)
      })

    axios.post(`/getsharedsurveytolist`,{'surveyid':this.id}).then(response => {
        this.contacts = response.data
        })
      .catch(e => {
      // this.errors.push(e)
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
    }
    
  },
  watch: {
      surveyconfig :function(newdata, olddata){
          return newdata;
      },
      listid :function(newdata, olddata){
          this.getexceptionreportlist()
      }
    // whenever question changes, this function will run
  }
}
</script>
<style scoped>

</style>
