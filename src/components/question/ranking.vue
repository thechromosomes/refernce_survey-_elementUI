<template>
    <div class="Ranking-options">
        <v-layout v-for="(choice, index) in choices" v-bind:key="index" class="rating-row">
            <v-flex xs1 >
                <v-select @change="mapdata(index)" v-model="choice.answer" class="rankselector" :items="allrank" label="" ></v-select>
            </v-flex>
            <v-flex xs11>
                {{choice.choicetext}}
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
export default {
    props:['allchoice'],
    data() {
        return {
            choices:[],
            answer:null,
            allrank:[]
        }
    },
    methods:{
        mapdata(index){
            const selectedans =  event.srcElement.innerText
            const changeddata = this.choices[index]
            this.choices.forEach((choice, i) => {
                if(choice.answer == selectedans && choice._id != changeddata._id){
                    this.choices[i].answer = "";
                }
            });
        }
    },
    created(){
        var counter = 1;
        this.allrank.push("");
        this.allchoice.forEach(choice => {
            this.allrank.push(counter);
            counter++;
            this.choices.push({
                _id:choice._id,
                questionid:choice.questionid,
                choicestate:choice.choicestate,
                choicetext:choice.choicetext,
                answer:""
            });
        });

    }
}
</script>