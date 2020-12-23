<template>
    <div class="surveyprint">
        <template xs12 v-if="welcomenotes.length > 0">
            <template class="qustiongroup" v-for="(welcomenote, windex) in welcomenotes" >
                <div :key="`welcomenotesid${windex}`" v-html="welcomenote.description" ></div>
            </template>
        </template>
        <previewsurvey :surveyid="id"></previewsurvey>
        <template xs12 v-if="thankyounotes.length > 0">
            <template class="qustiongroup" v-for="(thankyounote, windex) in thankyounotes" >
                <div :key="`welcomenotesid${windex}`" v-html="thankyounote.description" ></div>
            </template>
        </template>
    </div>
</template>
<script>
var datetime = new Date();
import welcomethankyoueditor from './welcomethankyoueditor'
import previewsurvey from './previewsurvey'
  export default {
    components: {previewsurvey, welcomethankyoueditor},
   data() {
    return {
        id:this.$route.params.id,
        thankyounotes:[],
        welcomenotes:[],
    }
  },
    methods: {
      

    },


 created() {
      axios.post(`/getallwelcomethankyoudata`,{'surveyid':this.id,datatype:'welcomepage'}).then(response => {
        if(response.data == null){
        } else {
            this.welcomenotes = response.data;
        }
      })
      axios.post(`/getallwelcomethankyoudata`,{'surveyid':this.id,datatype:'thankyoupage'}).then(response => {
        if(response.data == null){

        } else {
            this.thankyounotes = response.data;
        }
      })

},
    watch:{
    },
 
}
</script>
