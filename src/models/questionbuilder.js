module.exports = {
    updateHaveImage: function(questionid, newdata) {
        axios.post(`/updatehaveimage`,{'questionid':questionid,'haveimage':newdata}).then(response => {
            console.log(response)
            return response
        }).catch(e => {
            return "00"
        })
    }
}