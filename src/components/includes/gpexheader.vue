<template>
 <div class="navigationclass header">
<nav class="navbar">
  <div class="container-fluid">
    <div class="navbar-header">
      <a href="/" class="navbar-brand"><img src="/static/images/gpex-logo.png" alt="" class="logo_header img img-responsive"></a>
      <div class="topnav-right topnav_right" v-if="currentuser != null" >
    <!--<span class="dropdown">
    <a href="#home">
   <span class="badge  badgebellnonot ">0</span><i class="fa fa-fw fa-bell"></i></a>
     </span><a href="#home"><i class="fa fa-fw fa-home"></i></a>  -->
     <span class="dropdown headmenu" v-if="is_admin === true || is_contactlistaccess===true"><a href="/contactlist" class="dropdown-item">Contacts</a></span>
     <span class="dropdown" v-if="is_admin === true || is_contactlistaccess===true">
        <a href="#"  class="john_name">Administration</a>
        <ul class="dropdown-content">
          <li v-if="is_admin === true"><a href="/createuser" class="dropdown-item">Create User</a></li>
          <li v-if="is_admin === true"><a href="/userlist" class="dropdown-item">User list</a></li>
          <li v-if="is_admin === true"><a href="/projectlist" class="dropdown-item">Project list</a></li>
          <li v-if="is_admin === true"><a href="/addgroup" class="dropdown-item">Manage Group</a></li>
          <li v-if="is_admin === true || is_contactlistaccess===true"><a href="/gallery" class="dropdown-item">Gallery</a></li>
          <li v-if="is_admin === true || is_contactlistaccess===true"><a href="/mailformat" class="dropdown-item">Notification Template</a></li>
          <li v-if="is_admin === true"><a href="/sentmailreport" class="dropdown-item">Mailing Report</a></li>
          <li v-if="is_admin === true"><a href="/userlog" class="dropdown-item">Userlog Report</a></li>
          <li v-if="is_admin === true"><a href="/setting" class="dropdown-item">Settings</a></li>
          <li v-if="is_admin === true"><a href="/dateQuestionSubmit" class="dropdown-item">Question config</a></li>

        </ul>
      </span>
     <span class="dropdown"><a href="#" class="john_name">{{currentuser.firstname+' '+currentuser.lastname}}</a>
     <img src="../../assets/profile.png" class="circle_image">
     <ul class="dropdown-content dropdown-content_logout">
     <li><a href="/logout" class="dropdown-item">Logout</a>
                                    </li></ul>
                                    </span></div>
    </div>
  </div>
</nav>
</div>
</template>
<script>
var username=localStorage.username;
var mylibrary = require("../../models/mainlib.js");
import axios from 'axios';
export default {
  data() {
    return {
      currentuser: null,
      errors: [],
      is_admin:false,
      is_contactlistaccess:false
    }
  },
  created() {

    this.currentuser = localStorage.username;
    // console.log("this user role;- "+userrole);
    axios.post(`/getcurrentuser`,{'username':username})
    .then(response => {
      // JSON responses are automatically parsed.
      if(response.data === null){
        // this.$router.push('/login');
      } else {
        // console.log("user roles", response.data.roles);

        this.currentuser = response.data
        if(mylibrary.is_roleassigned(response.data.roles, "1")){
          this.is_admin = true;
          this.is_contactlistaccess = true;
        } else {
          this.is_contactlistaccess=false;
          this.is_admin = false;
        }
        if(mylibrary.is_roleassigned(response.data.roles, "2" ) ||mylibrary.is_roleassigned(response.data.roles, "3")){
          this.is_contactlistaccess=true;
        }
      }
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
    watch: {
      // whenever question changes, this function will run
      currentuser: function (olddata, newdata) {
        // console.log("dkfhgjdfhg");
        return newdata;
      },
      role: function (olddata, newdata) {
        // console.log("dkfhgjdfhg");
        return newdata;
      }
    }


}
</script>
<style scoped>
.navbar-header a{
  color:#ffffff !important;
}
</style>

