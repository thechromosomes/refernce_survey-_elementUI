<script>  
import { log, isObject } from 'util';
export default {
   created(){
     console.log(this.$route.query.token);
     const data = JSON.parse(decodeURIComponent(window.atob(this.$route.query.token)));
     if(isObject(data)){
        if(data.email && data.sid){
            var email = window.atob(data.email)
            var shareid = window.atob(data.sid)
            this.$store.dispatch('validateshare', { shareid: shareid, email: email}).then((result) => {
              console.log("reslut - ", result)
              if(result){
                if(result.user){
                  if(result.share.active){
                    localStorage.setItem("attemptemail", "");
                    location.href = '/swl/'+result.share.surveyid
                  } else {
                    this.$toast.open({
                      message:"Token expired",
                      type : "error",
                      position: 'bottom',
                    });
                    location.href="/"
                  }
                } else {
                  if(result.share.active){
                    localStorage.setItem("attemptemail", email);
                    location.href = '/swtl/'+result.share.surveyid
                  } else {
                    this.$toast.open({
                      message:"Token expired",
                      type : "error",
                      position: 'bottom',
                    });
                    location.href="/"
                  }
                }
              } else {
                this.$toast.open({
                  message:"Invalid token",
                  type : "error",
                  position: 'bottom',
                });
                location.href="/"
              }
            }).catch(e => {
              this.$toast.open({
                message:JSON.stringify(e),
                type : "error",
                position: 'bottom',
              });
              // location.href="/"
            })
        } else {
          this.$toast.open({
            message:"Invalid token",
            type : "error",
            position: 'bottom',
          });
          // location.href="/"
        }
     } else {
       this.$toast.open({
         message:"Invalid token",
            type : "error",
            position: 'bottom',
          });
          // location.href="/"
     }
  }
}
</script>
