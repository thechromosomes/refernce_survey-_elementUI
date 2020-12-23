<template>
     <transition name="modal">
    <div class="modal-mask"> 
      <div class="modal-wrapper">
         <div class="modal-colorpicker">
          <div class="modal-header">
            <chrome-picker v-model="imagecolor" ></chrome-picker>
          </div>
          <div class="modal-footer">
              <button class="exportbutton" @click="updateimagecolor(imagecolor)">OK</button>
              <button class="exportbutton" @click="closeModel()">Cancel</button>
          </div>
        </div>
        </div>
    </div>
  </transition>
</template>

<script>
import {Chrome} from 'vue-color';
export default {
   components: {
    // mycolorpicker, 
    'chrome-picker':Chrome, 
    },
  data() {
      return {
          imagecolor:"#ffffff",
      }
  },
    methods: {
        updateimagecolor(data) {
            this.$emit('changeColor', data)  
        },
        closeModel() {
            this.$emit('closeModel')  
        }
    }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-colorpicker {
  width: min-content;
  margin: 0px auto;
  padding: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-enter .modal-colorpicker,
.modal-leave-active .modal-colorpicker {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>