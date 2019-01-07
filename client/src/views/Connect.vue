<template>
  <v-container grid-list-xl>
    <v-layout align-center justify-center row>
      <v-flex md6>
        <h1 class="display-2 text-xs-center mb-5 mt-5">Connect</h1>
        <v-autocomplete
          outline
          v-model="model"
          :items="states"
          label="Type your username"
          placeholder="alice.petition.eth"
          prepend-icon="fa-users"
        >
          <v-slide-x-reverse-transition
            slot="append-outer"
            mode="out-in"
          >
            <v-icon
              :color="isEditing ? 'success' : 'info'"
              :key="`icon-${isEditing}`"
              @click="isEditing = !isEditing"
              v-text="isEditing ? 'mdi-check-outline' : 'mdi-circle-edit-outline'"
            ></v-icon>
          </v-slide-x-reverse-transition>
        </v-autocomplete>
      </v-flex>
    </v-layout>
  </v-container>
</template>
