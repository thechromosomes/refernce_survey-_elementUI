<template>
    <div class="question">
        <div class="question_text" v-html="questiontext"></div>
    </div>
</template>
<script>
export default {
    props:['questiontext', 'qno']
}
</script>
<style>
.question_text{
    padding-bottom: 15px;
}
</style>

