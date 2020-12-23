<template>
<div>
    <h3>hi there...</h3>
    <!-- <p>this is custom{{contactData}}</p>  -->
    <v-select 
            :items="contactData"
            label="Select"
            v-model="answer"
            item-text="name"
          ></v-select> 
          
        <model-list-select :list="contactData"
        option-value="name"
        option-text="name"
        v-model="answer"
        @input="changequestionselection"
        placeholder="select"></model-list-select>
</div>
</template>

<script>
import { ModelListSelect } from 'vue-search-select'

export default {
    props:['contactInfo'],
    components: {ModelListSelect},
     data(){
         return{
             contactData: this.contactInfo,
             answer:null
         }
     },
     methods:{
         changequestionselection(data){
             alert(data)
         }
     }
}
</script>