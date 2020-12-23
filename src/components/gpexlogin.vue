<script>  
import { log } from 'util';
export default {
   created(){
     console.log(this.$route.query.token);
    //console.log(decodeURIComponent(this.$route.query.token))
    var hello=decodeURIComponent(this.$route.query.token);
    console.log(hello);
     var vars = hello.split('&');
     var pair=[];
     var allpair=[];
    for (var i = 0; i < vars.length; i++) {
      var m = vars[i].match(/\[(.*)\]/);
      var pair = vars[i].split('=');
      if(m.length >= 1 && pair.length >= 1){
        allpair[m[1]] = window.atob(pair[1]);
      }
    }
    console.log("allpair- ", allpair);
    
    if(allpair['email'] != undefined){
      this.$store.dispatch('gpexlogin', { email: allpair['email'] }).then(() => {
        // console.log("login success", allpair['url']);
        if(allpair['url'] && allpair['url'].lastIndexOf("/") < 0){
            location.href = '/swl/'+allpair['url'];
        } else if(allpair['url'] && allpair['url'].lastIndexOf("/") >= 0){
            location.href = allpair['url'];
        } else {
          location.href = '/';
        }
      }).catch(console.error)
    } else {
      if(allpair['url'] != undefined && allpair['url'].lastIndexOf("/") < 0){
        location.href = '/swtl/'+allpair['url'].replace("/", "");
      } else {
        location.href = '/';
      }
    }
  }
}
</script>
