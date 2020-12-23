module.exports = {
    is_siteadmin: function() {
        return true;
    },
    is_roleassigned: function(roles, roleid) {
        var found = roles.find( role => role.roleid === roleid );
        return found;
    },
    downloadfiles: function(response, type) {
        var blob = new Blob([response.data],{type:response.headers['content-type']});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "Downloadfile"+Date.now()+"."+type;
        link.click();
    },
    secondtoStringtime: function(second){
        if(!second){
            return "" ;
        }
        var days = this.removedecimal(second / (24*60*60), 0);
        second = second % (24*60*60);
        var hour = this.removedecimal(second / (60*60),0);
        second = second % (60*60);
        var min = this.removedecimal(second / 60, 0);
        second = this.removedecimal(second % (60),0);
        var returndata = "";
        if(days != 0){
            returndata += days+" day "
        }
        if(hour != 0){
            returndata += hour+" hour "
        }
        if(min != 0){
            returndata += min+" min "
        }
        if(second != 0){
            returndata += second+" second "
        }
        return returndata;
    },
    removedecimal: function(data, check=0){
        const n = data.toString().lastIndexOf(".");
        if(n > -1){
            return data.toString().substr(0,n);
        } else {
            return data;
        }
    }, 

}