<template>
    <div class="Ranking-options">
        <template v-for="(choice, index) in choices" >
            <v-layout :id="`subanswer${choice._id}`"  v-bind:key="index" class="rating-row">
                <v-flex xs1 >
                    <v-select disabled readonly  v-model="choice.answer" class="rankselector" :items="allrank" label="" ></v-select>
                </v-flex>
                <v-flex xs11>
                    {{choice.choicetext}}
                </v-flex>
            </v-layout>
        </template>
    </div>
</template>
<script>
export default {
    props:['allchoice','question'],
    data() {
        return {
            choices:[],
            answer:null,
            allrank:[],
            selectedanswer:[],
        }
    },
    methods:{
    },
    created(){
        var counter = 1;
        this.allrank.push("");
        var this_attempt = window.surveyattemptid
        axios.post(`/getattemptanswer`,{
        'questionid':this.question._id,
        'attemptid':this_attempt._id
        }).then(response => {
            if(response.data.status == 1){
                if(response.data.data){
                    this.selectedanswer = JSON.parse(response.data.data.answer)
                }
                this.allchoice.forEach(choice => {
                    this.allrank.push(counter);
                    counter++;
                    var found = this.selectedanswer.find( answeritem => answeritem.option == choice._id );
                    var sanswer = ""
                    if(found){
                        sanswer = parseInt(found.rank)
                    }
                    this.choices.push({
                        _id:choice._id,
                        questionid:choice.questionid,
                        choicestate:choice.choicestate,
                        choicetext:choice.choicetext,
                        answer:sanswer  
                    });
                });
            }
        })
        .catch(e => {
            console.log("e- ", e);
            
        })

    }
}
</script>