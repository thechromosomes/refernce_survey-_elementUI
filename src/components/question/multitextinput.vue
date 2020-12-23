<template>
    <div class="multitextinput">
            <div v-for="(textinput, index) in allinput" v-bind:key="index" class="textinput">
                <v-layout align-center >
                    <v-text-field v-if="textinput.choicetext != ''"  :label="textinput.choicetext"  :key="index" value="" ></v-text-field>
                    <v-text-field v-if="textinput.choicetext == ''" label="Answer"  :key="index" value="" ></v-text-field>
                </v-layout>
            </div>
    </div>
</template>
<script>
import question from './question'
export default {
    components: {question},
    props:['alltextinput'],
    data() {
        return {
            allinput:this.alltextinput,
            questionno:this.qno
        }
    }
}
</script>
<style scoped>
.multitextinput .textinput{
    padding: 0px 10px 10px 10px;
    margin-bottom: 15px;
}
.multitextinput .textinput:hover{
    background-color: #ebebeb;
}
</style>

