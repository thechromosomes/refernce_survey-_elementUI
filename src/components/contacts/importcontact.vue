
<template>
  <div class="text-xs-center shareSurvey_">
    <v-dialog
      v-model="dialog"
      width="600"
      @click="removeModel"
    >
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >Import Contact</v-card-title>
        <v-card-text>
          <h3>Contact list</h3>
          <v-radio-group v-model="formmodel.createfor" row>
            <v-radio :key="`conatctfor0`" label="None" value="0" @click="contactresonchanges" ></v-radio>
            <v-radio :key="`conatctfor1`" label="New" value="1" @click="contactresonchanges" ></v-radio>
            <v-radio :key="`conatctfor2`" label="Existing" value="2" @click="contactresonchanges" ></v-radio>
          </v-radio-group>
            <v-text-field prepend-icon="person" v-if="formmodel.createfor == '1'" v-model="formmodel.listname" label="Contact List Name" type="text"></v-text-field>
            <v-select prepend-icon="person" v-if="formmodel.createfor == '2'" v-model="formmodel.listid" :items="allcontact" item-text="listname" item-value="_id" label="Contact List" ></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
          <form class="form_dropzone" enctype="multipart/form-data">
              <div class="dropzone">
                <div>
                    <input type="file" @change="sendImageFile" accept=".csv" ref="file" class="file-upload-input" />
                    <p  class="call-to-action">Drag your file here</p>
                </div>
              </div>
          </form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="importContact">Import</v-btn>
          <v-btn color="primary" flat @click="removeModel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import copytoclip from 'copy-to-clipboard';
export default {
  props:['contact', 'loginuser', 'dialogstate', 'allcontact'],
  data () {
    return {
      dialog: this.dialogstate,
      allorganization:[],
      formmodel:{
          createfor:"0",
          listname:"",
          listid:"",
          filepath:"",
      },
      fileseelcted:""
    }
  },
  methods:{
    contactresonchanges(){
      this.formmodel.listid = "";
      this.formmodel.listname = "";
    },
    removeModel(){
        this.dialog = false
        this.$emit("removeModel",this.dialog);
    },
    async sendImageFile(){
      const file = this.$refs.file.files[0];
      console.log(file);
      if(!file.type.includes("application/vnd.ms-excel")){
          var error = 'Only CSV Allowed';
          this.$toast.open({
            message:error,
            type : "error",
            position: 'top',
          });
        return ;
      }
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      this.formmodel.filepath = res.data.file
    },
    importContact(){
      var this_form = this.formmodel
        var error = [];
        if(this_form.createfor == "2" && this_form.listid == ""){
            error.push("Please select Contact list");
        } 
        if(this_form.createfor == "1" && this_form.listname == ""){
            error.push("Contact list name is required")
        } 
        if(this.formmodel.filepath == ""){
          error.push("Select csv file")
        }
        if(error.length > 0){
            error.forEach(element => {
                this.$toast.open({ message:element, type : "error", position: 'top', });
            });
        } else {
          axios.post('/importnewcontact',this.formmodel).then((response)=>{
            if(response.data.status == 1){
              this.formmodel = {
                createfor:"0",
                listname:"",
                listid:"",
                filepath:"",
              }
              this.$toast.open({message:"Contact imported successfully", position:"top", type:"success" })
            } else {
              this.$toast.open({message:response.data.message, position:"top", type:"error" })
            }
          }).catch((error)=>{
                this.$toast.open({message:"Failed", position:"top", type:"error" })
          })

        }

    }
},created() {
  axios.post(`/getorg`,{})
  .then(response => {
    this.allorganization = response.data.data
  })
  .catch(e => {
    this.errors.push(e)
  })
},
  watch: {
    dialog: function (olddialog, newdialog) {
        this.$emit("removeModel",this.dialog);
        return this.dialog;
      }
  }
}
</script>
