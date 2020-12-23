<template>
<div>
    <model-list-select 
       :list="contactInfoData"
        @input="changequestionselection"
        v-model="contactAnswer"
        option-value="id"
        option-text="name"
        placeholder="select">
    </model-list-select>  
    <input type="hidden" v-model="questionpotres" />
    <template v-for="(item, index) in contactData">
        <practice v-if="isloaded" :pindex="index"  :key="`cinfo${index}`" @datachanged="practiceupdated"  @removepractice="removepractice" :practice="item"></practice>
    </template>
</div>
</template>

<script>
import { ModelListSelect } from 'vue-search-select'
import practice from './practice'

export default {
    props:['question'],
    components:{ModelListSelect, practice},
    data(){
        return{
            thisquestion:this.question,
            contactInfoData:[],
            contactAnswer:"",
            finalContactData:[],
            contactData:[],
            showCard:false,
            isloaded:false,
            questionpotres:'',
            finalAnswer:[],
            addressformat:{
                name:"",
                state:"",
                country:"",
                address:"",
                mmm:"",
                gpdivision:"",
                telephone1:"",
                addresstype:"",
                suburb:"",
                facilitytype:"",
                trainingprgm:"",
                emailaddress1:"",
                postcode:"",
                addressline1:"",
                addressline2:"",
                addressline3:"",
                rideidentifier:""
            }
        }
    },
    methods:{
        updateserveranswer(){
            // console.log("from contactinfo contactinfochnaged");
            const this_user = window.surveyuser
            const this_attempt = window.surveyattemptid
            var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
            surveyconfig = JSON.parse(surveyconfig)
            localStorage.setItem('Updatedatatable', "1");
            if(surveyconfig.honeypot == '1'){
                if(this.questionpotres.length > 0){
                    axios.post(`/postbotresponse`,{
                        'surveyId':this.question.surveyid,
                        'userId':this_user._id,
                        'questionId':this.question._id,
                        'attemptId':this_attempt._id,
                        }).then(response => {
                    }).catch(e => {})
                } else {
                    axios.post(`/updateattemptanswer`,{
                    'surveyid':this.question.surveyid,
                    'userid':this_user._id,
                    'questionid':this.question._id,
                    'attemptid':this_attempt._id,
                    'answer':this.contactData
                    }).then(response => {
                        this.$emit("contactinfochnaged", null);
                    }) .catch(e => {
                        this.errors.push(e)
                    })
                }
            } else {
                axios.post(`/updateattemptanswer`,{
                    'surveyid':this.question.surveyid,
                    'userid':this_user._id,
                    'questionid':this.question._id,
                    'attemptid':this_attempt._id,
                    'answer':this.contactData
                }).then(response => {
                    this.$emit("contactinfochnaged", null);
                }).catch(e => {
                    this.errors.push(e)
                })
            }
        },
        practiceupdated(data){
            this.contactData[data.index] = data.data;
            this.updateserveranswer()
        },
        removepractice(data){
            this.isloaded = false;
            this.contactData.splice(data.index, 1);
            // console.log(this.contactData)
            this.updateserveranswer()
            this.isloaded = true;
        },
        async changequestionselection(){
            var index = this.contactInfoData.findIndex(p => p.id == this.contactAnswer)
            let userData = await this.contactInfoData[index]
            userData.email=this.getallemail(userData.addressdata, [])
            userData.fax=[]
            userData.website=[]
            userData.phone=this.getallphone(userData.addressdata, [])
            userData.address=this.getalladdress(userData.addressdata, [])
            userData.employee=[]
            // console.log(userData);
           this.contactData.push(userData)
           this.updateserveranswer()
        },
        getallemail(addressdata, email){
            if(Array.isArray(addressdata)){
                addressdata.forEach(address => {
                    if(address.emailaddress1 && !email.includes(address.emailaddress1)){
                        email.push(address.emailaddress1);
                    }
                });
            }
            return email;
        },
        getallphone(addressdata, phone){
            if(Array.isArray(addressdata)){
                addressdata.forEach(address => {
                    if(address.telephone1 && !phone.includes(address.telephone1)){
                        phone.push(address.telephone1);
                    }
                });
            }
            return phone;
        },
        getalladdress(addressdata, maergead){

            if(Array.isArray(addressdata)){
                addressdata.forEach(address => {
                    if(address.name)this.addressformat.name=address.name;
                    this.addressformat.state= this.getgpexname(address.state);
                    this.addressformat.address= this.getgpexname(address.address);
                    this.addressformat.country= this.getgpexname(address.country);
                    this.addressformat.mmm=address.gpex_mmm;
                    this.addressformat.gpdivision= this.getgpexname(address.gpdivision);
                    this.addressformat.telephone1=address.telephone1;
                    this.addressformat.addresstype= this.getgpexname(address.addresstype);
                    this.addressformat.suburb=address.gpex_suburb;
                    this.addressformat.facilitytype= this.getgpexname(address.facilitytype);
                    this.addressformat.trainingprgm= this.getgpexname(address.trainingprgm);
                    this.addressformat.emailaddress1=address.emailaddress1;
                    this.addressformat.postcode=address.gpex_postcode;
                    this.addressformat.addressline1=address.gpex_addressline1;
                    this.addressformat.addressline2=address.gpex_addressline2;
                    this.addressformat.addressline3=address.gpex_addressline3;
                    this.addressformat.rideidentifier=address.gpex_rideidentifier;
                    maergead.push(this.addressformat);
                    this.resetaddress();
                });
            }
            return maergead;
        },
        getgpexname(data){
            var newdata = [];
            if(data.length > 0){
                data.forEach(element => {
                   newdata.push(element.gpex_name); 
                });
            }
            return newdata.join(", ")
        },
        removeElement(indexVal){
             this.contactData.splice(indexVal, 1);
        },
        resetaddress(){
            this.addressformat={
                name:"",
                state:"",
                country:"",
                address:"",
                mmm:"",
                gpdivision:"",
                telephone1:"",
                addresstype:"",
                suburb:"",
                facilitytype:"",
                trainingprgm:"",
                emailaddress1:"",
                postcode:"",
                addressline1:"",
                addressline2:"",
                addressline3:"",
                rideidentifier:""
            };
        }
    },
    created() {
        var this_attempt = window.surveyattemptid
        axios.post(`/contactinfo`).then(response => {
            this.contactInfoData = JSON.parse(response.data.data) ;
        }).catch(err => {
            // console.log("ERROR >>> ", err)
        })
        this.isloaded = false;
        axios.post(`/getattemptanswer`,{
            'questionid':this.question._id,
            'attemptid':this_attempt._id
        }).then(response => {
            this.isloaded = true;
            if(response.data.data){
               if(response.data.data.answer){
                 this.contactData = JSON.parse(response.data.data.answer);
               }
              //  this.attempltedAnswer = response.data.data.answer

            } else{
                // console.log("no attempted answers found")
            }
        })
        .catch(e => {
            // console.log("catch err ", e)
        })

    },
}
</script>