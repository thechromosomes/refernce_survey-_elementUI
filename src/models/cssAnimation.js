module.exports = {
    animateCSS: function(element, animationName, callback) {
        return;
        /* const node = document.querySelector(element)
        if(node == null){
            return;
        } else {
            node.classList.add('animated', animationName)
    
            function handleAnimationEnd() {
                node.classList.remove('animated', animationName)
                node.removeEventListener('animationend', handleAnimationEnd)
    
                if (typeof callback === 'function') callback()
            }
    
            node.addEventListener('animationend', handleAnimationEnd)
        } */
    },
    ErrorInput: function(element, code = 'error') {
        const node = document.querySelector(element)
        if(node == null){
            return;
        } else {
            // console.log("classlist-", node.classList);
            if(code == 'error'){
                node.classList.add('inputerror')
            } else if(code == 'success'){
            node.classList.remove('inputerror')
            } else {
                
            }
        }
    }
}