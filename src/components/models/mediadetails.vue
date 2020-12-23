<template>
  <div class="text-xs-center duplicateSurvey_">
    <v-dialog v-model="dialog">
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >Media details</v-card-title>
        <v-card-text>
            <v-layout>
                <v-flex xs12 sm9 >
                    <div class="mediaelement">
                        <img :src="publicfileurl+imagedata.filepath" class="mediaresponseve"/></div>
                </v-flex>
                <v-flex xs12 sm3 class="borderleft" >
                    <div class="mediadetailsform">
                        <div class="dis_element" @click="copyURL(publicfileurl+imagedata.filepath)">
                            <p>File path:(Click to copy) </p>
                            <div class="borderedbox path" >{{publicfileurl+imagedata.filepath}}</div>
                        </div>
                        <v-text-field v-model="filename" label="File name" ></v-text-field>
                        <br>
                        <v-checkbox v-model="ispublic" :label="`Public`"></v-checkbox>
                    </div>
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <button color="primary" class="exportbutton" @click="savemedia"  flat>Save</button>
          <button color="primary" class="exportbutton danger" @click="deletemedia" flat>Delete</button>
          <button color="primary" class="exportbutton" @click="removeModel" flat >Cancel</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import copytoclip from 'copy-to-clipboard';
export default {
    props:['mediaitem', 'dialogstate', 'mediaindex'],
    data () {
      return {
        imagedata: this.mediaitem,
        dialog:true,
        publicfileurl:"",
        filename:this.mediaitem.filename,
        ispublic:this.mediaitem.public
      }
    },
    methods:{
        copyURL(path){
            copytoclip(path)
            this.$toast.open({
                message:"Image link copied",
                position:"top",
                type:"success"
            })
        },
        removeModel(){
            this.dialog = false
            this.$emit("removeModel",this.dialog);
        },
        savemedia(){
            axios.post('/updatemedia',{id:this.imagedata._id,filename:this.filename, public:this.ispublic}).then(qresponse => {
                if(qresponse.data){
                    this.$toast.open({
                        message:"Updated",
                        position:"top",
                        type:"success"
                    })
                    this.mediaitem.filename = this.filename
                    this.mediaitem.public = this.ispublic
                    this.removeModel();
                } else {
                    this.$toast.open({
                        message:"Failed",
                        position:"top",
                        type:"error"
                    })
                }
            })
        },
        deletemedia(){
            axios.post('/deletemedia',{id:this.mediaitem._id, filepath:this.mediaitem.filepath}).then(qresponse => {
                if(qresponse.data.n == 1){
                    this.$toast.open({
                        message:"Deleted",
                        position:"top",
                        type:"success"
                    })
                    this.$parent.deletemedia(this.mediaindex);
                    this.removeModel();
                } else {
                    this.$toast.open({
                        message:"Failed",
                        position:"top",
                        type:"error"
                    })
                }
            })
        },
    },
    created(){
        this.publicfileurl = window.publicfileurl
    },
    watch: {
        dialog: function (olddialog, newdialog) {
            this.$emit("removeModel",this.dialog);
            return this.dialog;
        },
    }
}
</script>
