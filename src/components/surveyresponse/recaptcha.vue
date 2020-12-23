<template>
  <div 
  id="g-recaptcha"
  class="g-recaptcha"
  :data-sitekey="sitekey">
  </div>
</template>

<script>
export default {
  data () {
    return {
      sitekey: '6LfEnsUUAAAAAGYEP2VYf74EHzoN4QB3MwrA6L30',
      widgetId: 0
    }
  },
  methods: {
    execute () {
      window.grecaptcha.execute(this.widgetId)
    },
    reset () {
      window.grecaptcha.reset(this.widgetId)
    },
    render () {
      if (window.grecaptcha) {
        this.widgetId = window.grecaptcha.render('g-recaptcha', {
          sitekey: this.sitekey,
          callback: (response) => {
            this.$emit('verify', response)
            // reset the recaptcha widget so you can execute it again
            // this.reset() 
          }
        })
      }
    }
  },
  mounted () {
    // render the recaptcha widget when the component is mounted
    this.render()
  }
}
</script>