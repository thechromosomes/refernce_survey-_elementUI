<template>
    <div class="container conatiner_dashboard">
        <reportheader :surveyid="id" active="1"></reportheader>
    <div class="controlsec" ref="exporthtml">
      <v-container class="conatiner_dashboard" v-if="surveydata != null">
        <div class="surveydetails">
          <v-layout class="surveysect">
            <v-flex xs12>
              <div class="">Summary report</div>
              <h2>{{surveydata.surveyname}}</h2>
              </v-flex>
          </v-layout>
          <!-- {{averageresponsetime}} -->
          <v-layout v-if="surveyconfig != null" class="surveyressect">
            <v-flex xs12 sm6>
                <div>Total Question : {{totalquestionno}}</div>
                <div>Total Response : {{responselist.length}}</div>
                <div>Average Time : {{averageresponsetime}}</div> 
                <div>First response : {{firstresponse}}</div>
                <div>Last response : {{lastresponse}}</div>
                <div>Active : <span v-if="surveyconfig.active == '1'">Yes</span><span v-else>No</span></div>
                <div><v-flex xs6 d-flex>
                  <!-- <v-select :items="contacts" box v-model="listid" item-value="contactid" @change="contactlistid" item-text="contactname" label="Select Contact lists"></v-select> -->
                 
                   <model-list-select :list="contacts" class="#"
                     v-model="listid"
                     option-value="contactid"
                     @input="contactlistid"
                     option-text="contactname"
                     placeholder="Select Contact list"></model-list-select>
              </v-flex></div>
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
                <span class="exportbutton" @click="getexportlink('summarypdf1', id)">PDF Export</span>
                <span class="exportbutton" @click="getexportlink('summaryexcel1', id)">EXCEL Export</span>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </v-container>
      <!-- <img alt="Google" height="92" id="hplogo" src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" data-iml="1568285581299" data-atf="1"> -->
      <v-container class="conatiner_dashboard">
            <div class="questionforchart" v-for="(question, index) in questions" :key="`questionid_${index}`">
                <displayheading :sectiondata="question" v-if="question.questiontype === 'sectionheading'"></displayheading>
                <v-divider v-else-if="question.questiontype === 'pagebreak'"></v-divider>
                <div v-else-if="question.questiontype == 'qtypeslider'">
                <v-layout>
                    <v-flex xs1  class="finalquestionindex">
                    </v-flex>
                    <v-flex xs11 questionbox>
                    <h3>Slider</h3>
                    </v-flex>
                </v-layout>
                     
                </div>
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
                <finalreport v-else-if="question.questiontext !== ''"  :question="question" :userlist="contactdata" :qno="getquestionno(index)"></finalreport>
            </div>
      </v-container>
</div>
    </div>
</template>

<script>
var dateFormat = require('dateformat');
var mainlib = require('../../models/mainlib');

import finalreport from './finalreport'
import displayheading from '../question/sectionheading'
import userdetailssnipt from '../users/userdetailssnipt'
import reportheader from './reportheader'
import jsPDF from 'jspdf';
import { ModelListSelect } from 'vue-search-select'


export default {
    components:{finalreport,displayheading, reportheader, userdetailssnipt, ModelListSelect},
    data() {
        return {
            id:this.$route.params.id,
            surveydata:null,
            surveyconfig : null,
            createddate:null,
            modifiedddate:null,
            firstresponse : "",
            lastresponse : "",
            questionorder:[],
            responselist:[],
            contacts:[],
            listid:null,
            contactdata:[],
            averageresponsetime : 0,
            options: {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: [
                        'Very positive',
                        'Somewhat negative',
                        'Somewhat positive',
                        'Very negative',
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    title: {
                        text: 'Progress Rate (%)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0,
                    }
                },
                series: [{
                    name: 'Rate',
                    data: [9.9, 71.5, 6.4, 29.2]

                }]
            },
            surveys:[],
            survey:null,
            questions:[],
          pdf:null,
          margins : {
            top: 90,
            bottom: 40,
            left: 40,
            width: 550
          }
        }
    },
    methods:{
          pdfheader()
    {
        this.pdf.setFontSize(30);
        this.pdf.setTextColor(40);
        this.pdf.setFontStyle('normal');
        this.pdf.text("Summary Report", this.margins.left , 40);
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
    pdfexport(id){
      var allhtml = this.$refs.exporthtml;
      console.log(allhtml);
      window.print();

    },
    getexportlink(linkfor, resid){
      var retdata = "#";
      let loader = this.$loading.show({
          loader: 'dots'
      });
      if(linkfor == 'csv'){
        axios.post(`/downlaodsummaryreportxls`,{'surveyid':resid},{responseType: 'arraybuffer'}).then(response => {
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
      } else if(linkfor == 'summarypdf'){
        axios.post(`/summaryreportpdf`,{'id':resid},{responseType: 'arraybuffer'}).then(response => {
          if(response.headers['content-type'].indexOf("application/json") >= 0){
            this.$toast.open({
                message:response.data.message,
                position:"top",
                type:"error"
              })
          } else {
            mainlib.downloadfiles(response, "pdf");
          }
          loader.hide();
        }).catch(e => {
          loader.hide();
          console.log("e- ", e)
        })
        // retdata = axios.defaults.baseURL+"/summaryreportpdf?id="+resid;
      } else if(linkfor == 'summaryexcel'){
        axios.post(`/summaryreportexcel`,{'id':resid},{responseType: 'arraybuffer'}).then(response => {
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
        // retdata = axios.defaults.baseURL+"/summaryreportexcel?id="+resid;
      } else if(linkfor == 'summarypdf1'){
        axios.post(`/summaryreportpdf1`,{'id':resid},{responseType: 'arraybuffer'}).then(response => {
          if(response.headers['content-type'].indexOf("application/json") >= 0){
            this.$toast.open({
                message:response.data.message,
                position:"top",
                type:"error"
              })
          } else {
            mainlib.downloadfiles(response, "pdf");
          }
          loader.hide();
        }).catch(e => {
          loader.hide();
          console.log("e- ", e)
        })
        // retdata = axios.defaults.baseURL+"/summaryreportpdf1?id="+resid;
      } else if(linkfor == 'summaryexcel1'){
        axios.post(`/summaryreportexcel1`,{'id':resid},{responseType: 'arraybuffer'}).then(response => {
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
        // retdata = axios.defaults.baseURL+"/summaryreportexcel1?id="+resid;
      }
      return retdata;
    },
         getquestionno(index){
      var qno = 0;
      for (let i = 0; i < this.questions.length; i++) {
        if(i >= index){
          break;
        }
        var queselement = this.questions[i];
        if(queselement.questiontype == 'questiontype' || queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox'){

        } else if(queselement.questiontext != ""){
          qno+=1;
        } else {
        }
      }
      return qno;
    },

    contactlistid: function(){
      setTimeout(() => {
        axios.post(`/getcontactsdata`,{'listid':this.listid}).then(response => {
          this.contactdata = ["selected"];
          response.data.forEach(contactuserid => {
              if(contactuserid.userid != ""){
                this.contactdata.push(contactuserid.userid)
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
    totalquestionno: function () {
      var qno = 0;
      for (let i = 0; i < this.questions.length; i++) {
        var queselement = this.questions[i];
        if(queselement.questiontype == 'qtypeslider' ||queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox'){
        } else if(queselement.questiontext != ""){
          qno+=1;
        } else {
        }
      }
      return qno;
    },
  },
      created() {
        if(this.id == "" || this.id == undefined){
            this.$router.push('/')
        } else {

        axios.post(`/getsurvey`,{'surveyid':this.id}).then(response => {
        if(response.data == null){
            this.$router.push('/')
        } else {
            this.surveydata = response.data;
            this.modifiedddate = dateFormat(this.surveydata.modifiedddate, "yyyy/mm/dd ")
            this.createddate = dateFormat(parseInt(this.surveydata.createddate), "yyyy/mm/dd ")
        }
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
        //   this.errors.push(e)
        })

        axios.post(`/getquestions`,{'surveyid':this.id}).then(qsresponse => {
        if(qsresponse.data == null){
            this.$router.push('/')
        }
            axios.post(`/getquestionorder`,{'surveyid':this.id}).then(response => {
              this.questionorder = response.data
              this.questionorder.forEach(element => {
                  qsresponse.data.forEach(q => {
                      q.order = element.order
                      if(q._id == element.questionid){
                          this.questions.push(q)
                      }
                  });
              });
            })
            .catch(e => {
              console.log(e);
            })    
    axios.post(`/getsharedsurveytolist`,{'surveyid':this.id}).then(shareresponse => {
      console.log("thisIsData", shareresponse.data)
      this.contacts = shareresponse.data
    })




        // this.questions = response.data;
        // var allquestion = response.data;
        // console.log(allquestion);
        // allquestion.forEach(question => {
        //     axios.post(`/getquestion`,{'questionid':question._id}).then(response => {
        //         console.log(response);
                
        //         if(response.data == null){
        //         console.log(response.data);
        //         } else {
        //             this.questions.push(response.data)
        //         }
        //     })
            
        // });







        })
        .catch(e => {
        this.errors.push(e)
        })
    axios.post(`/allresponselist`,{'surveyid':this.id}).then(response => {
    if(response.data == null){
        console.log();
    } else {
       var all_response = [];
       var attempttime = 0
       var attemptcount = 0
       response.data.forEach((attempdata, index) => {
           if(index == 0){
               this.firstresponse = dateFormat(attempdata.datestarted, "yyyy/mm/dd");
           }
           if(attempdata.datestarted != 0){
               this.lastresponse = dateFormat(attempdata.datestarted, "yyyy/mm/dd");
           }
            if(attempdata.datefinished != 0){
                attempttime += (attempdata.datefinished - attempdata.datestarted) / 1000;
                attemptcount++;
           }
            all_response.push(attempdata)
       });    
         this.responselist = all_response;
         this.averageresponsetime = mainlib.secondtoStringtime(attempttime / attemptcount);
       }
    
    })

    // axios.get(`/getsurveys`)
    // .then(response => {
    //   // JSON responses are automatically parsed.
    //   this.surveys = response.data
    // })
    // .catch(e => {
    //   this.errors.push(e)
    // })
}

    }
    }

</script>
<style scoped>
.controlsec .layout.row.wrap{justify-content: space-between;display:flex;flex-wrap: wrap;}

</style>
