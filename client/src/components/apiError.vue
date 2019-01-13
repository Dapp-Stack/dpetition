<template>
  <v-layout align-center justify-center row fill-height>
    <v-card color="error" class="white--text">
      <v-card-title>
        <v-icon large left>
          fa fa-warning
        </v-icon>
        <span class="title font-weight-bold">
          API Error
        </span>
      </v-card-title>

      <v-card-text class="headline font-weight-light">
        We could not connect you to the API, try to come back in few minutes or reload the page.
      </v-card-text>
    </v-card>
  </v-layout>
</template>