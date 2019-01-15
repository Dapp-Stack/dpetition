<template>
  <v-container grid-list-xl>
    <v-layout align-center justify-center row>
      <v-flex md6>
        <h1 class="display-2 text-xs-center mb-5 mt-5">Connect</h1>
        <v-autocomplete
          outline
          v-model="value"
          :loading="loading"
          on:input="console.log('he;;p')"
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
  public value = '';

  @Prop(Boolean) isTyping: boolean = false;

  @Action('find', { namespace }) private find!: ({username: string}) => void;
  @State('address', { namespace }) private address!: string;
  @State('notFound', { namespace }) private notFound!: boolean;
  @State('loading', { namespace }) private loading!: boolean;

  @Watch('username')
  public onUsernameChanged(username: string) {
    this.isTyping = true;
    this.debounceFind(username);
  }

  @Watch('value')
  public onValueChanged(newValue: string) {
    console.log(newValue);
  }

  public debounceFind = debounce((username: string) => {
    this.isTyping = false;
    this.find({ username });
  }, 500);

  get items() {
    if (this.isTyping) {
      return [];
    }

    if (this.address) {
      return [
        {text: this.username, value: 'Connect'},
        {text: this.username, value: 'Recover'},
      ];
    }

    if (this.notFound && this.username){
      return [
        {text: this.username, value: 'Create'},
      ];
    }
    
    return [];
  }
}
</script>