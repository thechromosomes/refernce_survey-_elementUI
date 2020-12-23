<template>
    <v-container class="checkboxtop">
        <v-checkbox v-model="answer" :label="choicetext.choicetext" ></v-checkbox>
    </v-container>
</template>
<script>
export default {
    props:['choicetext', 'ansno'],
    data() {
        return {
            choicetexts:this.choicetext,
            ansno1:this.ansno,
            answer:0
        }
    }
}
</script>
<style>
.checkboxtop {
    padding: 5px !important;
}
.checkboxtop .checkbox{
    top: unset !important;
}
.checkboxtop:hover{
    background-color: #ebebeb;
}
</style>
