<template>
    <v-layout wrap class="conatiner_responceform">
        <reportheader :surveyid="id" active="2"></reportheader>
        <v-flex xs12>
          <v-container class="conatiner_dashboard" v-if="surveydata != null">
            <div class="surveydetails">
              <v-layout class="surveysect">
                <v-flex xs5> 
                  <div class="">Filter report</div>
                  <h2>{{surveydata.surveyname}}</h2>
                </v-flex>
                <v-flex sm3>
                  <!-- <v-select class="borderdradius" :items="savedfilters" box v-model="exportfilter" item-text="filtername" label="Select Filter"></v-select> -->

                  <model-list-select :list="savedfilters" class="#"
                    v-model="exportfilter"
                    option-value="filtername"
                    option-text="filtername"
                    placeholder="Select Filter"></model-list-select>

                </v-flex>
                <v-flex xs4  text-xs-right> 
                  <button @click="openpopup_savefilter" v-if="allconditions.length > 0"><span class="exportbutton">Create new</span></button>
                  <button @click="Updatefilter" v-if="allconditions.length > 0 && exportfilter"><span class="exportbutton">Save </span></button>
                  <button @click="resetfilter" v-if="exportfilter"><span class="exportbutton">Reset </span></button>
                  <button @click="exportexcelfilter" v-if="founddata.length > 0"><span class="exportbutton">Export</span></button>
                  <button @click="exportexcelallfilter" v-if="founddata.length > 0"><span class="exportbutton">Export All</span></button>
                </v-flex> 
              </v-layout>
              <v-layout class="surveyressect" >
                <v-flex sm5>
                  <!-- <v-select class="borderdradius" :items="allquestions" box v-model="selq" item-text="questiontext" label="Select Question"  @input="changequestionselection"></v-select> -->

                  <model-list-select :list="allquestions" class="borderdradius"
                    @input="changequestionselection"
                    v-model="allDetails"
                    option-value="_id"
                    option-text="questiontext"
                    placeholder="Select Question"></model-list-select>

                </v-flex>
                <v-flex sm4>
                  <!-- <v-select class="borderdradius" v-if="seltype" :items="selq.options" box v-model="sela" item-text="choicetext" item-value="_id" label="Select Answer"></v-select> -->

                  <model-list-select :list="selq.options" class="sharedata"
                    v-if="seltype"
                    v-model="sela"
                    option-value="_id"
                    option-text="choicetext"
                    placeholder="Select Answer"></model-list-select>

                  <v-text-field class="borderdradius" v-else label="Answer" outlined  v-model="sela"></v-text-field>
                </v-flex>
                <v-flex sm1>
                  <!-- <v-select class="borderdradius" :items="andor" box v-model="exportcondition"  v-if="allconditions.length > 0" label="Condition"></v-select> -->

                   <model-list-select :list="andor" class="sharedata"
                    v-if="allconditions.length > 0"
                    v-model="exportcondition"
                    option-value="text"
                    option-text="text"
                    placeholder="Condition"></model-list-select>

                </v-flex>
                <v-flex sm2 text-xs-right>
                    <button @click="addcondition" class="filtercondition"><span class="exportbutton">add Condition</span></button>
                </v-flex>
              </v-layout>
              <div class="surveyressect" v-if="allconditions.length > 0">
                  <div>Conditions</div>
                <v-layout v-for="(condition, index) in allconditions" class="filtercondition" :key="`questionid_${index}`" >
                    <v-flex sm5>
                    <!-- <v-select class="borderdradius" :items="allquestions" box readonly v-model="condition.question._id" item-text="questiontext" item-value="_id" label="Select Question"></v-select> -->

                    <model-list-select :list="allquestions" class="sharedata"
                    v-model="condition.question._id"
                    :isDisabled="isDisabled"
                    option-value="_id"
                    option-text="questiontext"
                    placeholder="Select Question"></model-list-select>

                    </v-flex>
                    <v-flex sm4>
                    <!-- <v-select class="borderdradius" v-if="condition.type" :items="condition.question.options" box v-model="condition.answer" item-text="choicetext" item-value="_id" @change="debouncedfinddata" label="Select Answer"></v-select> -->

                    <model-list-select :list="condition.question.options" class="sharedata"
                    v-if="condition.type==true"
                    v-model="condition.answer"
                    option-value="_id"
                    @input="debouncedfinddata"
                    option-text="choicetext"
                    placeholder="Select Answer"></model-list-select>  

                    <v-text-field class="borderdradius" v-else label="Answer" outlined  v-model="condition.answer"  @input="debouncedfinddata" ></v-text-field>
                    </v-flex>
                    <v-flex sm1>
                    <!-- <v-select class="borderdradius" :items="andor" box v-model="condition.condition" @change="debouncedfinddata" v-if="index != 0" label="Condition"></v-select> -->

                    <model-list-select :list="andor" class="sharedata"
                    v-if="index != 0"
                    option-value="text"
                    option-text="text"
                    v-model="condition.condition"
                    @input="debouncedfinddata"
                    placeholder="Condition"></model-list-select>

                    </v-flex>
                    <v-flex sm2 text-xs-right>
                        <button @click="deletecondition(index)"><span class="exportbutton danger">Remove</span></button>
                    </v-flex>
                </v-layout>
              </div>
            </div>
          </v-container>
            <v-container class="conatiner_dashboard">
              <div class="all-datatable">
                <v-data-table
                  :headers="headers"
                  :items="founddata"
                  class="elevation-1"
                  :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination"
                  :loading = "loading"
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{props.item.user.firstname}} {{props.item.user.lastname}} </td>
                    <td class="text-xs-left">{{props.item.user.email}}</td>
                    <td class="text-xs-left">{{ props.item.datestarted }}</td>
                    <td class="text-xs-left">{{ props.item.datefinished }}</td>
                    <td class="text-xs-left">{{ props.item.createdip }}</td>
                    <td class="text-xs-left"><a :href="`/responsedetails/${props.item._id}`" target="_blank">details <img class ="deletequestion" src="../../assets/icons/arrow-circle-left-regular.svg" /></a></td>
                    <td class="text-xs-left"><span class="exportbutton" @click="getexportlink(props.item._id)">CSV Export</span></td>
                  </template>
                </v-data-table>
              </div>
            </v-container>
        </v-flex>
        <modelsavefilter @removeModel="model_modelsavefilter = $event"  v-if="model_modelsavefilter == true" :dialogstate="model_modelsavefilter" :loginuser="currentuser" :surveyid = "id" :allcondition="allconditions" ></modelsavefilter>

    </v-layout>
</template> 
<script>
var dateFormat = require('dateformat');
var mainlib = require('../../models/mainlib');
import modelsavefilter from '../models/savefilter';
import reportheader from './reportheader';
import { ModelListSelect } from 'vue-search-select'

var username=localStorage.username;
var datetime = new Date();
import Vue from 'vue'
import axios from 'axios';
  export default {
  components: {reportheader, modelsavefilter, ModelListSelect},
   data() {
    return {
      model_modelsavefilter:false,
      isDisabled:true,
      loading: false,
      headers: [
        {
          text: 'User',
          align: 'left',
          value: 'user',
        },
        { text: 'email', align: 'left', value: 'email' },
        { text: 'Date started', align: 'left', value: 'datestarted' },
        { text: 'Date submitted', align: 'left', value: 'datefinished' },
        { text: 'IP', align: 'left', value: 'createdip'},
        { text: 'Details', sortable: false },
        { text: 'Export', sortable: false },
      ],
        allDetails:"",
        selq:"",
        sela:"",
        seltype:false,
        id:this.$route.params.id,
        currentuser:null,
        surveydata:null,
        createddate:null,
        modifiedddate:null,
        surveyconfig:null,
        responselist:[],
        contactdata:[],
        listid:null,
        contacts:[],
        exportcondition:"and",
        semesterid : "null",
        averageresponsetime : 0,
        allquestions:[],
        allconditions :[],
        founddata :[],
        questiontype1:["multic","singlec","dropdown",],
        questiontype2:["numbertext","ratestars","ratescal"],
        andor:[{"text":"and"}, {"text":"or"}],
        conditions:[
          {
            "code":"<",
            "text":"is less then"
          },
          {
            "code":">",
            "text":"id greater then"
          },
          {
            "code":"=",
            "text":"is equal to"
          },
          {
            "code":"!=",
            "text":"is not equal to"
          }
        ],
        defaultjump:{
            questionid:"",
            answer:""
        },
        savedfilters:[],
        exportfilter:{},
          pagination: {
              rowsPerPage: 100
          },
          allattemptid:""
        
    }
},  
  methods: {
    changequestionselection(data){
      var found = this.allquestions.find( role => role._id == data );
      this.selq= found
      console.log("allquestions", this.selq)

    },
    resetfilter(){
      this.exportfilter="",
      this.allconditions = [];
      this.founddata = [];
    },
    exportexcelfilter(){
      if(this.founddata.length > 0){
        let loader = this.$loading.show({
            loader: 'dots'
        });
        axios.post(`/savesurveyfilter`,{surveyid:this.id, filtername:"", createdby:this.currentuser, filterdata:this.allconditions}).then(response => {
          if(response.data){
            axios.post(`/getfiltereddataexcel`,{'filterid':response.data._id},{responseType: 'arraybuffer'}).then(response => {
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
          } else {
            loader.hide();
            this.$toast.open({ message:"Unabme to export", type : "error", position: 'top'});
          }
        }).catch(e => {
          loader.hide();
            console.log(e);
        }) 

      } else {
        this.$toast.open({
          // message:'Only saved Filters can be exported. Please save first to export',
          message:'No data to export',
          type : 'error',
          position: 'top',
        });
      }
    },
    exportexcelallfilter(){
      if(this.founddata.length > 0){
        let loader = this.$loading.show({
            loader: 'dots'
        });
        axios.post(`/getallresponsedataexcel`,{'surveyid':this.id,ids:this.allattemptid},{responseType: 'arraybuffer'}).then(response => {
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
      } else {
        this.$toast.open({
          message:'No data to export',
          type : 'error',
          position: 'top',
        });
      }
    },
    getfilters(){
      axios.post(`/getfilters`,{'surveyid':this.id}).then(response => {
            this.savedfilters = response.data;
      })
      .catch(e => {
        // this.errors.push(e)
      })
    },
    Updatefilter(){
      if(this.allconditions.length <= 0 && exportfilter){
          this.$toast.open({ message:"Condition required to save filter", type : "error", position: 'top' });
      } else {
        axios.post(`/updatesurveyfilter`,{filterid:this.exportfilter._id, filterdata:this.allconditions}).then(response => {
            if(response.data){
              this.$toast.open({ message:"filter Saved", type : "success", position: 'top' });
            } else {
                this.$toast.open({ message:"Failed to Save survey", type : "error", position: 'top', });
            }
        }).catch(e => {
            console.log(e);
        }) 
      }
    },
    openpopup_savefilter(){
      this.model_modelsavefilter = true
    },
    getexportlink(resid){
       let loader = this.$loading.show({
          loader: 'dots'
      });
      axios.post(`/downlaodresponsexls`,{'respid':resid},{responseType: 'arraybuffer'}).then(response => {
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
    finddata(){
      this.loading = true
      axios.post(`/getfiltereddata`,{'surveyid':this.id, questions:this.allconditions}).then(response => {
        this.founddata = response.data;
        var this_attempts = []
        this.founddata.forEach(element => {
          console.log("element- ", element)
          this_attempts.push(element._id)
        });
        this.allattemptid = this_attempts.join(",")
        this.loading = false
      })
      .catch(e => {
        console.log(e)
      })
    },
    addcondition(){
        if(!this.sela || !this.selq){
            this.$toast.open({
                message:'Question and Answer Required',
                type : 'error',
                position: 'bottom',
            });
        } else {
            this.allconditions.push({
                question:this.selq,
                type:this.seltype,
                answer:this.sela,
                condition:this.exportcondition
            })
            this.debouncedfinddata();
            this.selq = "";
            this.sela = "";
            this.exportcondition = "and";
        }
    },
    deletecondition(index){
          this.allconditions.splice(index,1);
          this.debouncedfinddata();
    },
    // getexportlink(linkfor, resid){
    //   var retdata = "#";
    //   if(linkfor == 'csv'){
    //     retdata = axios.defaults.baseURL+"/downlaodresponsexls?respid="+resid;
    //   }
    //   return retdata;
    // },
    getexportalllink(linkfor, resid){
      var retdata = "#";
      if(linkfor == 'csv'){
        retdata = axios.defaults.baseURL+"/downlaodresponseuserxls?surveyid="+resid;
      }
      return retdata;
    },
    downloadexcelreport(respid){
      axios.post(`/downlaodresponsexls`,{'respid':respid}).then(response => {}).catch(e => {
        console.log(e)
      })
    },
    deleteresponse(index, respid){
      // deletesurveyresponse
      axios.post(`/deletesurveyresponse`,{'responseid':respid}).then(response => {
        // JSON responses are automatically parsed.
        if(response.data.n==1){
            this.responselist.splice(index,1);
          }        
      })
      .catch(e => {
        this.errors.push(e)
      })
      console.log("tobe deleted");
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
        this.debouncedfinddata = _.debounce(this.finddata, 1000)

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
          this.getfilters();
            this.surveydata = response.data;
            this.modifiedddate = dateFormat(this.surveydata.modifiedddate, "yyyy-mm-dd ")
            this.createddate = dateFormat(parseInt(this.surveydata.createddate), "yyyy-mm-dd ")
        }
      }).catch(e => {
        this.errors.push(e)
      })
      axios.post(`/getsurveyconfig`,{'surveyid':this.id}).then(response => {
        if(response.data != null){
            this.surveyconfig = response.data.data;
        }
      }).catch(e => {
        this.errors.push(e)
      })
      axios.post(`/getfiltertypequestion`,{'surveyid':this.id}).then(response => {
        if(response.data != null){
            this.allquestions = response.data;
        }
      }).catch(e => {
        this.errors.push(e)
      })
    }
    
  },
  watch: {
      surveyconfig :function(newdata, olddata){
          return newdata;
      },
      exportfilter :function(newexportfilter, oldexportfilter){
        console.log(newexportfilter);
        this.allconditions = JSON.parse(newexportfilter.filterdata)
        this.finddata()
      },
      selq :function(newdata, olddata){
        // console.log("sdsfdf"- this.selq);
        // console.log("newdata"- this.newdata);
        // console.log("olddata"- this.olddata);
        
          this.sela = "";
          if(this.questiontype1.indexOf(newdata.questiontype) >=0){
              this.seltype = true;
          } else {
              this.seltype = false;
          }
      }
    // whenever question changes, this function will run
  }
}
</script>