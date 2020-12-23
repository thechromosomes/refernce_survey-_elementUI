 <template>
    <transition name="modal">
        <div class="modal-mask"> 
            <div class="modal-wrapper">
                <div class="modal-container" v-if="maildata != null">
                     <div class="modal-header">
                        <v-layout wrap class="conatiner_responceform">
                            <v-flex xs12>
                                 <v-container class="" >
                                    <h1>Mail details</h1><br/>
                                    <div class="#">
                                    <p><strong>Survey name: </strong>{{maildata.surveyname}}</p>
                                    <p><strong>User name: </strong>{{maildata.username}}</p>
                                    <p><strong>Email: </strong>{{maildata.toemail}}</p>
                                    <p><strong>Date: </strong>{{maildata.date}}</p>
                                    <p><strong>Mail for: </strong>{{notifyfor(maildata.notificationfor)}}</p>
                                    <p><strong>Mail Body: </strong></p>
                                    <div class="#" v-html="maildata.data"></div>
                                    <br/>
                                    <button @click="getBack" class="exportbutton">Close</button>
                                    </div>
                                </v-container>
                            </v-flex>
                        </v-layout> 
                    </div>
                 </div> 
            </div>
        </div>
    </transition>        
</template> 
<script>
var username=localStorage.username;
var datetime = new Date();
const dateFormat = require('dateformat');
export default {
    props:['data'],
    data() {
        return {
            id:this.data._id,
            maildata:null,
            actions:[
                { code:"1", text:"Share Survey to Contact list " },
                { code:"2", text:"Response Added " },
                { code:"3", text:"Response Approved " },
                { code:"4", text:"Response Completed " },
                { code:"5", text:"Survey Notification" },
            ],

        }
    },  
    methods: {
        getBack(){
            this.$emit("removeModel",false);
        },
        getsentmaildata(){
            axios.post(`/getsentmaildetails`,{mailid:this.id}).then(response => {
                this.maildata = response.data
            })
            .catch(e => {
                console.log(e);
                this.$toast.open({
                    message:"Failed to fetch Sent mails",
                    position:"top",
                    type:"error"
                })
            })
        },
        notifyfor(type){
            var found = this.actions.find( a => a.code == type );
            if(found){
                return found.text
            }
            return "";
        },

    },
    created() {
        
        this.getsentmaildata()
    },
    watch: {
    },
    computed: {
    }
}
</script>
<style >
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 80%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>