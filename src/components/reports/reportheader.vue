<template>
    <div class="reportheader"> 
        <v-tabs
            class="header_navbar"
            centered
            v-model="activetab"
            >
            <v-tab key=0 @click="gotopage(0)" >
                <img class ="iconinsidebtn" title="Edit Survey" src="../../assets/icons/arrow-circle-right-regular-white.svg" />
                Edit
            </v-tab>
            <v-tab key=1 @click="gotopage(1)"  >
                Summary report
            </v-tab>
            <v-tab key=2  @click="gotopage(2)" >
                Filter Report
            </v-tab>
            <v-tab key=3  @click="gotopage(3)" >
                Individual report
            </v-tab>
            <v-tab key=4 @click="gotopage(4)" >
                Approval Report
            </v-tab>
            <v-tab v-if="prevnextbtn" key=1000000>
                <img v-if="prevattempt" title="Previous" class ="iconinsidebtn" @click="changeResponse(-1)" src="../../assets/icons/arrow-circle-right-regular-white.svg" />
                <img v-if="nextattempt" title="Next" class ="iconinsidebtn" @click="changeResponse(1)" src="../../assets/icons/arrow-circle-left-regular-white.svg" />
            </v-tab>
        </v-tabs>
    </div>
</template>
<script>
var datetime = new Date();
var username=localStorage.username;
import axios from 'axios';
  export default {
  props:['surveyid','active', 'prevnext', 'attemptid'],
   data() {
    return {
      user:null,
      activetab:this.active,
      errors: [],
      prevnextbtn:this.prevnext,
        allresponse:[]

    }
  },
    methods: {
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

        },
        gotopage(page){
            if(page == 0){
                location.href = '/builder/'+this.surveyid
            } else if(page == 1){
                this.$router.push('/responsereport/'+this.surveyid)
            } else if(page == 2){
                this.$router.push('/filterreport/'+this.surveyid)
            } else if(page == 3){
                this.$router.push('/responselist/'+this.surveyid)
            } else if(page == 4){
                this.$router.push('/approveresponse/'+this.surveyid)
            } else {

            }
        }
        
    },
    computed:{
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
        axios.post(`/allresponselist`,{'surveyid':this.surveyid}).then(response => {
            if(response.data){
            response.data.forEach(attempdata => {
                this.allresponse.push(attempdata._id) 
            });
            }
        })

    }

 
}
</script>
<style>
</style>
