<template>
    <v-layout align-center>
        <textarea class="xs12textarea" rows="8"></textarea>
         
    </v-layout>
</template>
<script>  
export default {
  props:['textinput'],
    data(){
      return {
        textvalue: ""
      }
    }, 
  methods: {
      changetext(currenttext){
        this.textvalue = currenttext;
        this.$emit("changeQuestion",this.changetext);
      }
    }

}
</script>
<style scoped>
.xs12textarea{
  margin: 10px 0px;
}
</style>

