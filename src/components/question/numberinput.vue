<template>
    <div class="maskedinput">
            <v-layout align-center >
            <v-text-field  label="Answer" :mask="maskedinput" ></v-text-field>
            </v-layout>
    </div>
</template>
<script>
export default {
    props:['maskformat'],
  computed: {
    // a computed getter
    maskedinput: function () {
      // `this` points to the vm instance
      var return_str = "";
      var i = 0;
      for(i = 0; i < this.maskformat; i++){
            return_str += "#"
      }
      return return_str
    }
  }
}
</script>
<style scoped>
.maskedinput{
  padding: 0px 10px 10px 10px;
}
.maskedinput:hover{
  background-color: #ebebeb;
}
</style>
