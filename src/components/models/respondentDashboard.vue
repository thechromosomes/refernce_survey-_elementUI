<template>
<div class="flex_box">
    <ul class="bells_ul_dashboard">
         <div class="single_flexbox">
             <template v-for="(item, i) of surveyName.data">
                 <li :key="`aaaaa${i}`" class="background_lidash">
                     <a :href="getsharedlink(item)">
                    <i class="fa fa-fw fa-bell bell_icondashboard"></i>{{item.surveyname}}  
                    </a>
                </li>
             </template>
            
        </div>
    </ul>
</div>
</template>

<script>
export default {
    props:['userdate'],
    data() {
        return {
             surveyName :[]
         }
    },
    methods: {
        findByEmail(){
            if (this.userdate !== null){
                axios.post('/findbyemail', {"email":this.userdate.email})
            .then((result) => {
                // console.log('result',   result)
                this.surveyName = result
            }).catch((err) => {
                console.log('error', err)
            });

            }
            
        },
        getsharedlink(item){
            var urlparam = {
                email:window.btoa(this.userdate.email),
                sid:window.btoa(item.sharedid)
            }
            var entoken = window.btoa(encodeURIComponent(JSON.stringify(urlparam))); 
            return "/sharedlinks?token="+entoken;
        }

    },
        created() {
            this.findByEmail()

        }
}

</script>
<style>
.flex_box{
  
}
.single_flexbox{
display: flex;
}
.single_flexbox li{
    display:inline-block;

}
.bells_ul_dashboard {
    border-radius: 40px;
    list-style: none;
    justify-content: space-between;
    margin: 15px;
  
}
.background_lidash {
    background: #f5f5f5;
    padding: 15px 10px 15px 10px;
      border-radius: 40px;
      width:30%;
      margin-right:3%;
}
.notifylink {
    font-weight: 600;
    color: #000 !important;
    display: flex;
}
</style>
