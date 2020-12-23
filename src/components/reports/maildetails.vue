 <template>
    <v-layout wrap class="conatiner_responceform">
        <v-flex xs12>
            <v-container class="" >
                <h1>Mail details</h1>
                <br/>
                <div class="maildetails">
                    <p><strong>Survey name: </strong>{{maildata.surveyname}}</p>
                    <p><strong>User name: </strong>{{maildata.username}}</p>
                    <p><strong>Email: </strong>{{maildata.toemail}}</p>
                    <p><strong>Date: </strong>{{maildata.date}}</p>
                    <p><strong>Mail for: </strong>{{notifyfor(maildata.notificationfor)}}</p>
                    <p><strong>Mail Body: </strong></p>
                    <div class="maildbody" v-html="maildata.data"></div>
                    <br/>
                    <button @click="getBack" class="exportbutton">Back</button>
                </div>
            </v-container>
        </v-flex>
    </v-layout>
</template> 
<script>
var username=localStorage.username;
var datetime = new Date();
const dateFormat = require('dateformat');
export default {
    data() {
        return {
            id:this.$route.params.id,
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
            this.$router.push('/sentmailreport');
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
<style scoped>

</style>
