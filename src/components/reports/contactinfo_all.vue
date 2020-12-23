<template>
    <tr v-if="practicedata" class="tabledata" >
        <td class="text-center">{{practicedata.name}}</td>
        <td class="text-center">{{email}}</td>
        <td class="text-center">{{phone}}</td>
        <td class="text-center">{{fax}}</td>
        <td class="text-center">{{website}}</td>
        <td class="text-center">{{address}}</td>
        <td class="text-center">{{startdate}}</td>
        <td class="text-center">{{enddate}}</td>
    </tr>
</template>

<script>
export default {
    props:['answer'],
    data(){
        return {
            practicedata:this.answer,
            email:null,
            phone:null,
            fax:null,
            website:null,
            address:null,
            startdate:null,
            enddate:null,
        }
    },
    methods:{
        manipulateaddress(alladdressdata){
            var allfield = ["addressline1", "addressline2", "addressline3", "suburb", "state", "country", "postcode"];
            var finaladdress = [];
            alladdressdata.forEach(add => {
                var alladdress = [];
                allfield.forEach(field => {
                    if(add[field]){
                        alladdress.push(add[field]);
                    }
                });
                finaladdress.push(alladdress.join(", "));
            });
            return finaladdress.join("/");
        }
    },
    created() {
        this.practicedata= this.answer
        if(this.practicedata.email && Array.isArray(this.practicedata.email)){
            this.email = this.practicedata.email.join(",")
        }
        if(this.practicedata.phone && Array.isArray(this.practicedata.phone)){
            this.phone = this.practicedata.phone.join(",")
        }
        if(this.practicedata.fax && Array.isArray(this.practicedata.fax)){
            this.fax = this.practicedata.fax.join(",")
        }
        if(this.practicedata.website && Array.isArray(this.practicedata.website)){
            this.website = this.practicedata.website.join(",")
        }
        if(this.practicedata.address && Array.isArray(this.practicedata.address)){
            this.website = this.manipulateaddress(this.practicedata.address);
        }
        if(this.practicedata.accreditian){
            if(this.practicedata.accreditian.gpex_accreditationdatefrom){
                this.startdate = this.practicedata.accreditian.gpex_accreditationdatefrom;
            }
            if(this.practicedata.accreditian.gpex_accreditationdateto){
                this.enddate = this.practicedata.accreditian.gpex_accreditationdateto;
            }
        }
    }
}
</script>