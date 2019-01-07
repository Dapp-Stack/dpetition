<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>DPetition</span>
        <span>|</span>
        <span class="font-weight-light">Sign Petition that Matters</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        to="/"
      >
        <v-icon class="mr-2">fa-pencil</v-icon>
        <span>List Petitions</span>
      </v-btn>
      <v-btn
        color="primary"
        to="/petitions/new"
      >
        <v-icon class="mr-2">fa-plus</v-icon>
        <span>Add Petition</span>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>
