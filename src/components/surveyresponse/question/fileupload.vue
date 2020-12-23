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
                <div class="dropzone">
                <div>
                    <input type="file" @change="sendImageFile" ref="file" class="file-upload-input" />
                    <p class="call-to-action">Drag your file here</p>
                </div>
                </div>
            </form>
        </div>
        <input type="hidden" v-model="questionpotres" />
    </div>
</template>
<script>
export default {
    props:['questiondata'],
    data() {
        return {
            questionpotres:"",
            selectedfile: "",
            menu: false
        }
    },
    methods :{
        async sendImageFile(){
            const file = this.$refs.file.files[0];
            // console.log(file);
            const formData = new FormData();
            formData.append("file", file);
            try{
                const this_user = window.surveyuser
                const this_attempt = window.surveyattemptid
                var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
                surveyconfig = JSON.parse(surveyconfig)
                if(surveyconfig.honeypot == '1'){
                    if(this.questionpotres.length > 0){
                        axios.post(`/postbotresponse`,{
                            'surveyId':this.questiondata.surveyid,
                            'userId':this_user._id,
                            'questionId':this.questiondata._id,
                            'attemptId':this_attempt._id,
                            }).then(response => {
                        }).catch(e => {})
                    } else {
                        const res = await axios.post("/upload", formData);
                        // console.log(res.data);
                        axios.post(`/updateattemptanswer`,{
                            'surveyid':this.questiondata.surveyid,
                            'userid':this_user._id,
                            'questionid':this.questiondata._id,
                            'attemptid':this_attempt._id,
                            'answer':res.data.file
                            }).then(response => {
                            // console.log(response)
                            this.selectedfile = res.data.file;
                        })
                        .catch(e => {
                            // console.log(e);
                        })
                    }
                } else {
                    const res = await axios.post("/upload", formData);
                    // console.log(res.data);
                    axios.post(`/updateattemptanswer`,{
                        'surveyid':this.questiondata.surveyid,
                        'userid':this_user._id,
                        'questionid':this.questiondata._id,
                        'attemptid':this_attempt._id,
                        'answer':res.data.file
                        }).then(response => {
                        // console.log(response)
                        this.selectedfile = res.data.file;
                    })
                    .catch(e => {
                        // console.log(e);
                    })
                }
            } catch(err){
                // console.log(err);
                
            }
        }
    },
    watch:{
    },
    created: function () {
        this.$parent.validatedform(true);
    var this_user = window.surveyuser
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'surveyid':this.questiondata.surveyid,
      'userid':this_user._id,
      'questionid':this.questiondata._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.selectedfile = JSON.parse(response.data.data.answer)
            // this.validatedform()
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
