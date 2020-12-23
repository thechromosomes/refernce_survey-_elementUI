<template>
    <div class="fileuplad_component">
        <div class="uploadedfile" v-if="selectedfile != ''">
            <div class="uploadfilebutton">
                <v-icon>attach_file</v-icon>
                <div v-html="questionfinalimage"></div>
            </div>
        </div>        
        <div class="fileupload">
            <form class="form_dropzone" enctype="multipart/form-data">
                <div class="dropzone cursor_pointer">
                <div>
                    <p class="call-to-action">Drag your file here</p>
                </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    props:['questiondata'],
    data() {
        return {
            selectedfile: "",
            menu: false
        }
    },
    methods :{
    },
    watch:{
    },
    created: function () {
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'questionid':this.questiondata._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.selectedfile = JSON.parse(response.data.data.answer)
          }
        }
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  computed: {
    // a computed getter
    questionfinalimage: function () {

      return "<a target='_blink' href='"+window.publicfileurl+this.selectedfile+"'>"+this.selectedfile.substring(this.selectedfile.indexOf("_")+1)+"</a>";
    }
  }

}
</script>
