<template>
  <div class="text_contact qtype">
    <v-text-field  label="Type Question here..." @input="changeQuestion" required ></v-text-field>
      <v-layout align-center>
      <v-text-field label="First Name"  ></v-text-field>
      </v-layout>
       <v-layout align-center>
      <v-text-field label="Last Name"  ></v-text-field>
      </v-layout>
         <v-layout align-center>
      <v-text-field label="Email"  ></v-text-field>
       </v-layout>
         <v-layout align-center>
      <v-text-field label="Phone"  ></v-text-field>
       </v-layout>
         <v-layout align-center>
      <v-text-field label="Address..."  ></v-text-field>
        </v-layout>
  </div> 
</template>
<script>
export default {
  props:['qtypedata'],
  data() {
    return {
      questiontext:this.qtypedata.questiontext
    }
  }, 
  methods: {
      changeQuestion(currenttext){
        this.questiontext = currenttext;
        this.$emit("changeQuestion",this.questiontext);
      }
    }
}
</script>
<style>
.xs12textarea{
  width: 100%;
    border: 1px solid #eeeeee;
    resize: none;
    background-color: #ffffff;
}
</style>

