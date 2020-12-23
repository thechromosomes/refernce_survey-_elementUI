<template>
<div>
<v-container>
<v-card  class="pa-2" outlined tile>
 <v-layout row wrap>
 <v-flex ><h2>Add Semester</h2></v-flex>  
 </v-layout>
  <form>
   <v-layout>
        <VueNumberInput :step="1000" inline controls v-model="semester"></VueNumberInput>
        <span>&#8226;</span>
         <VueNumberInput v-model="semesterDot" :min="0" :max="10" inline controls></VueNumberInput>
    </v-layout>
    </form>
    <v-spacer></v-spacer>
    <v-layout>
    <button type="button" class="exportbutton" @click='semesterentry'>Submit</button>
    </v-layout>
    {{backendResponse}}
</v-card>
</v-container>
</div>
</template>

<script>
import VueNumberInput from '@chenfengyuan/vue-number-input';
export default {
    components: {VueNumberInput},
    data(){
        return{
            semester:null ,
            semesterDot:null,
            errors:[],
            backendResponse:""
        }
    },
    methods: {
        semesterentry(){
        axios.post('/semesterentry',{"semester" : this.semester, "semesterDot" : this.semesterDot})
        .then(response => {
            this.backendResponse = response.data.message
            // console.log(response.data.message)
        })
        .catch(e => {
        this.errors.push(e)
        })
        },
    }
}
</script>