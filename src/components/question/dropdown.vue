<template>
    <div id ="dropDownlist" class="dropdown-btn">
        <v-flex xs12 sm4 class="noprint">
          <v-select 
            :items="choices"
            label="Select"
            v-model="answer"
            item-text="choicetext"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm4 class="printonly">
          <v-radio-group v-model="radioGroup">
              <div v-for="(choice, index) in choices" v-bind:key="index">
                  <radiobutton :choicetext="choice" :ansno="index" :qno="questionno" ></radiobutton>
              </div>
          </v-radio-group>
          <div v-if="question.other">
              <v-container class="checkboxtop">
                  <v-checkbox v-if="question.othertext != ''" v-model="extrafield" :label="question.othertext" ></v-checkbox>
                  <v-checkbox v-else v-model="extrafield" :label="`Other, please specify`" ></v-checkbox>
              </v-container>
          </div>
        </v-flex>
        
    </div>
</template>
<script>
import radiobutton from './radiobutton'
export default {
  components: {radiobutton},
    props:['allchoice','question'],
    data() {
        return {
            choices:this.allchoice,
            answer:null,
            extrafield:null,
            radioGroup:null
        }
    }
}
</script>
<style scoped>
.dropdown-btn {
  padding: 10px;
}
</style>
