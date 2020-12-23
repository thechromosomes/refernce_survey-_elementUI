<template>
    <div >
        <v-layout v-if="question != null">
            <v-flex xs12 >
                <displayheading :sectiondata="question" v-if="question.questiontype === 'sectionheading'"></displayheading>
                <div class="descriptionbox" v-else-if="question.questiontype == 'descriptionbox'">
                    <div v-html="question.description"></div>
                    <div class="questionimagepreview" v-if="question.image != '' && question.haveimage == '1' ">
                        <img :src="questionfinalimage(question.image)" class="img-question"/>
                    </div>
                </div>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import displayheading from './sectionheading'
export default {
    props:['questiondata'],
    components: {displayheading},
    data() {
        return {
            question:this.questiondata,
            questionno:this.qno,
            jumpdata:null
        }
    },
    methods :{
        questionfinalimage(path){
            return window.publicfileurl+path;
        },
    },
}
</script>


