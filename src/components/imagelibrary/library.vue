<template>
    <v-container class="medialibrary">
        <v-layout>
            <div class="flex mediaheader">
                <h2>Gallery</h2>
                <button color="primary" class="exportbutton" @click="addnewmedia(true)" flat >Add New</button>
            </div>
        </v-layout>
        <br/>
        <br/>
        <div class="newfileupload" v-if="addnew">
            <form class="form_dropzone" enctype="multipart/form-data">
                <div class="dropzone">
                <div>
                    <input type="file" ref="file" @change="sendImageFile" class="file-upload-input" />
                    <p class="call-to-action">Drag your file here</p>
                </div>
                </div>
            </form>
        </div>
        <div class="allmedialist">
            <template v-for="(mediadata, mi) in allmedia">
                <div class="mediaitem" v-if="mediadata.filepath != ''" :key="`questionid${mediadata._id}`">
                        <div class="mediathumb" >
                            <div class="mediaimage" :aaaa="publicfileurl+mediadata.filepath" v-bind:style="`background-image:url(${publicfileurl+mediadata.filepath})`">
                            </div>
                            <div class="medianame">{{mediadata.filename}}</div>
                            <div class="mediaoverlay">
<div class="custom_badges mediaaction" @click="copyURL(publicfileurl+mediadata.filepath)" >
    <div class="badge_shape">
        <i class="material-icons">file_copy</i>
    </div>
    <div class="badge_text">Copy URL</div>
</div>
<div class="custom_badges mediaaction" @click="displaymediadetails(mediadata, mi)" >
    <div class="badge_shape">
        <i class="material-icons">info</i>
    </div>
    <div class="badge_text">Details</div>
</div>
                                
                            </div>
                        </div>
                </div>
            </template>
        </div>
        <mediadetails @removeModel="model_mediadetails = $event"  v-if="model_mediadetails == true" :dialogstate="model_mediadetails" :mediaindex="selectedindex" :mediaitem="selectedmedia" ></mediadetails>
    </v-container>
</template>
<script>
var datetime = new Date();

var username=localStorage.username;
import copytoclip from 'copy-to-clipboard';
import axios from 'axios';
import mediadetails from '../models/mediadetails'
  export default {
    components: {mediadetails},
   data() {
        return {
            allmedia:[],
            filterdates:[],
            publicfileurl:"",
            selectedmedia:"",
            selectedindex:0,
            model_mediadetails:false,
            addnew:false
        }
    },
    methods: {
        copyURL(path){
            copytoclip(path);
            this.$toast.open({
                message:"Image link copied",
                position:"top",
                type:"success"
            })

        },
        addnewmedia(state){
            this.addnew = state;
        },
        deletemedia(mediaindex){
            this.allmedia.splice(mediaindex, 1);
        },
        displaymediadetails(mediadata, mi){
            this.selectedmedia = mediadata
            this.selectedindex = mi
            this.model_mediadetails = true
        },
        async sendImageFile(){
            const file = this.$refs.file.files[0];
            console.log("file-", file);
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post("/upload", formData);
            console.log("updaloaded- ", res);
            const filename = file.name
            const filepath = res.data.file
            const filetype = file.type
            const filesize = file.size
            const createdby = "00000"
            if(filetype.indexOf("image")>=0){
                axios.post('/addmedia',{filename:filename, filepath:filepath,filetype:filetype, filesize:filesize, createdby:createdby}).then(qresponse => {
                    console.log("media added- ", qresponse);
                    if(qresponse.data){
                        this.allmedia.splice(0,0,qresponse.data)
                        this.$toast.open({
                            message:"image Uploaded",
                            position:"top",
                            type:"success"
                        })
                    }
                })
            } else {
                this.$toast.open({
                    message:"Invalid file type only image allowed",
                    position:"top",
                    type:"error"
                })
            }
            event.target.value="" 
        },
        getactualpath(path){
            return window.publicfileurl+path;
        }
    },
    computed: {
    // a computed getter
    },
    created() {
        this.publicfileurl = window.publicfileurl
        axios.post('/getallmedia',{}).then(qresponse => {
            if(qresponse.data){
                this.allmedia = qresponse.data
            }
        })
    }
}
</script>
