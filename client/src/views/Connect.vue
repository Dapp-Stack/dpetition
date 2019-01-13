<template>
  <v-container grid-list-xl>
    <v-layout align-center justify-center row>
      <v-flex md6>
        <h1 class="display-2 text-xs-center mb-5 mt-5">Connect</h1>
        <v-autocomplete
          outline
          v-model="autocomplete"
          :loading="loading"
          :search-input.sync="username"
          :items="actions"
          cache-items
          hide-no-data
          label="Type your username"
          placeholder="alice.petition.eth"
          prepend-icon="fa-users"
        >
        </v-autocomplete>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action, State } from 'vuex-class';
import { Component, Watch, Prop } from 'vue-property-decorator';

const namespace: string = 'ens';

@Component({})
export default class Connect extends Vue {
  loading = false;
  username = '';

  @Prop(String) autocomplete!: string;

  @Action('find', { namespace }) private find!: ({username: string}) => void;
  @State('address', { namespace }) private address!: string;

  @Watch('username')
  public onUsernameChanged(username: string){
    if(username) {
      this.find({username});
    }
  }

  get actions() {
    return [];
  }
}
</script>