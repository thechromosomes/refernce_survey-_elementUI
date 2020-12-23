<template>
  <div class="workflow_section">
    <div class="container_workflow" v-if="workflows.length > 0">
        <div v-for="(flow, findex) in workflows" :key="`flow${findex}`">
          <div class="flowelement">
            <v-layout>
              <v-flex xs1 class="conditiontext flexcenter">If</v-flex>
              <v-flex xs3 class="conditionon">
                <v-select :items="actions" v-model="flow.action" @change="changeflowdata" item-text="text" item-value="code"></v-select>
              </v-flex>
              <v-flex xs2 class="notify">
                <v-select :items="allroles" v-model="flow.role" @change="changeflowdata" item-text="text" item-value="code"></v-select>
              </v-flex>
              <v-flex xs1 class="conditiontext flexcenter">
                <span>Notify</span>
              </v-flex>
              <v-flex xs2 class="notify">
                <v-select :items="allroles" v-model="flow.notifyrole" @change="changeflowdata" item-text="text" item-value="code"></v-select>
              </v-flex>
              <v-flex xs2 flexcenter>
                <button v-if="workflows.length != findex" @click="deleteFlow(findex)" class="btn-jumpaction delete"><img src="../../assets/icons/minus-circle-white.svg" /></button>
                <button v-if="workflows.length == (findex+1)" @click="addFlow" class="btn-jumpaction add"><img src="../../assets/icons/plus-circle-light-white.svg" /></button>
              </v-flex>
            </v-layout> 
          </div>
        </div>
    </div>
    <div class="container_logicjump" v-else>
        <div>
          <div class="flowelement">
            <v-layout>
              <v-flex xs1 class="conditiontext flexcenter"></v-flex>
              <v-flex xs3 class="conditionon">
              </v-flex>
              <v-flex xs3 class="conditionon">
              </v-flex>
              <v-flex xs3 class="notify">
              </v-flex>
              <v-flex xs2 flexcenter>
                <button @click="addFlow" class="btn-jumpaction add"><img src="../../assets/icons/plus-circle-light-white.svg" /></button>
              </v-flex>
            </v-layout> 
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['survey'],
  data() {
      return {
        id : this.survey,
        surveydata:this.survey,
        workflows:[],
        // allroles : [],
        allroles:[
          {
            code:"0",
            text:"Respondent"
          },
          {
            code:"1",
            text:"Editor"
          },
          {
            code:"2",
            text:"Reviewer"
          }
        ],
        actions:[
          {
            code:"0",
            text:"Response by "
          },
          {
            code:"1",
            text:"Approved by "
          },
          {
            code:"2",
            text:"Completed by "
          },
        ],
        defaultflow:{
            surveyid:this.survey,
            action:0,
            role:"",
            notifyrole:""
        }
      }
  },
  methods:{
    addFlow(){
        axios.post(`/addworkflow`,{'flowdata':this.defaultflow}).then(response => {
              this.workflows.push(response.data);
        })
    },
    deleteFlow(index){
      var flowid = this.workflows[index]._id
      axios.post(`/deleteworkflow`,{'flowid':flowid}).then(response => {
        if(response.data.n==1){
          this.workflows.splice(index,1);
        }
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    changeflowdata(){
      this.debouncedchangeflowdata()
    //   console.log("have to call API to update logics");
    },
    updateFlowdata(){
      var allflowdata = this.workflows
      axios.post(`/updateworkflow`,{'allflowdata':allflowdata}).then(response => {
      }).catch(e => {
        this.errors.push(e)
      })
    }
  },
  created(){
    this.debouncedchangeflowdata = _.debounce(this.updateFlowdata, 2000)

    // axios.get(`/getroles`).then(response => {
    //     this.allroles = response.data;
    // })
    axios.post(`/getallworkflow`,{'surveyid':this.survey}).then(response => {
        var allflows = response.data;
        if(allflows.length == 0){
          axios.post(`/addworkflow`,{'flowdata':this.defaultflow}).then(response => {
              this.workflows.push(response.data);
          })
        } else {
          this.workflows = allflows;
        }
    })
  }
}
</script>
