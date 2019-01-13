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
          :items="items"
          hide-no-data
          label="Type your username"
          placeholder="alice.petition.eth"
          prepend-icon="fa-users"
        >
        <template slot="item" slot-scope="{ item }">
          <v-list-tile-avatar
            color="indigo"
            class="headline font-weight-light white--text"
          >
            {{ item.value.charAt(0) }}
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-chip label color="primary">{{item.value}}</v-chip>
          </v-list-tile-action>
        </template>
        </v-autocomplete>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action, State } from 'vuex-class';
import { Component, Watch, Prop } from 'vue-property-decorator';
import { debounce } from 'lodash';

const namespace: string = 'ens';

@Component({})
export default class Connect extends Vue {
  public username = '';

  @Prop(String) public autocomplete!: string;

  @Action('find', { namespace }) private find!: ({username: string}) => void;
  @State('address', { namespace }) private address!: string;
  @State('loading', { namespace }) private loading!: boolean;

  @Watch('username')
  public onUsernameChanged = debounce((username: string) => {
    if (username) {
      this.find({ username });
    }
  }, 1000);

  get items() {
    if (this.username && !this.loading) {
      if (this.address) {
        return [
          {text: this.username, value: 'Connect'},
          {text: this.username, value: 'Recover'},
        ];
      } else {
        return [
          {text: this.username, value: 'Create'},
        ];
      }
    }
    return [];
  }
}
</script>