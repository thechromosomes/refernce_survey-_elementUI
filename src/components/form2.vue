<template>
  <v-form>
    <v-container>
     <v-layout column>
          <v-text-field
            label="1. What do you want learn?"
            v-model="q1"
          ></v-text-field>
           <v-text-field
            label="2. Where should be go for next trip?"
            v-model="q2"
          ></v-text-field>
          
           <v-text-field
            label="3. Check All That Apply"
            v-model="q3"
          ></v-text-field>
            <v-text-field
            label="4. Select your location"
            v-model="q4"
          ></v-text-field>
           <v-text-field
            label="5. In 50 words or more explain why you select this location"
            v-model="q5"
          ></v-text-field>
           <v-text-field
            label="6. Select Your Range"
            v-model="q6"
          ></v-text-field>
           <v-text-field
            label="7. Select a file to upload "
            v-model="q7"
          ></v-text-field>
      </v-layout>
    </v-container>
  </v-form>
</template>