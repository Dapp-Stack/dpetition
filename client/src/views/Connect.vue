<template>
  <v-container grid-list-xl>
    <v-layout align-center justify-center row>
      <v-flex md6>
        <h1 class="display-2 text-xs-center mb-5 mt-5">Connect</h1>
        <v-autocomplete
          outline
          v-model="value"
          @input="makeIdentityCall()"
          :loading="loading"
          on:input="console.log('he;;p')"
          :search-input.sync="username"
          :items="items"
          hide-no-data
          label="Type your username"
          placeholder="alice"
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

enum ActionType {
  Connect = 'Connect',
  Recover = 'Recover',
  Create = 'Create',
}

@Component({})
export default class Connect extends Vue {

  get items() {
    if (this.isTyping) {
      return [];
    }

    if (this.address) {
      return [
        {text: this.username, value: ActionType.Connect},
        {text: this.username, value: ActionType.Recover},
      ];
    }

    if (this.notFound && this.username) {
      return [
        {text: this.username, value: ActionType.Create},
      ];
    }

    return [];
  }
  public username = '';
  public value = '';
  public isTyping = false;
  public unexpectedError = true;
  public isLoadingIdentity = false;

  public debounceFind = debounce(function(username: string) {
    this.isTyping = false;
    this.find({ username });
  }, 500);

  @Action('find', { namespace: 'ens' }) private find!: (attributes: any) => void;
  @State('address', { namespace: 'ens' }) private address!: string;
  @State('notFound', { namespace: 'ens' }) private notFound!: boolean;
  @State('loading', { namespace: 'ens' }) private loading!: boolean;


  @Action('create', { namespace: 'identity' }) private create!: (attributes: any) => void;

  @Watch('username')
  public onUsernameChanged(username: string) {
    this.isTyping = true;
    this.debounceFind(username);
  }

  public async makeIdentityCall() {
    this.isLoadingIdentity = true;
    const args = { username: this.username };
    switch (this.value) {
      case ActionType.Connect:
        // this.connect(args);
        break;
      case ActionType.Recover:
        // this.recover(args);
        break;
      case ActionType.Create:
        try {
          const t = await this.create(args);
          this.isLoadingIdentity = false;
          this.$router.push('/');
        } catch(error) {
          this.unexpectedError = true;
          this.isLoadingIdentity = false;
        }
        break;
    }
  }
}
</script>