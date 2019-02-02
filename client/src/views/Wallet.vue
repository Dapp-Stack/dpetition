<template>
  <v-container grid-list-xl>
    <v-layout align-center justify-center column>
      <v-flex v-if="wallet.address" md6>
        <v-card>
          <v-card-title primary-title>
            <h3>
              <Blockies :address="wallet.address"/>
              <span class="ml-2">{{wallet.address}}</span>
            </h3>
          </v-card-title>

          <v-layout row wrap>
            <v-flex xs=6 v-for="(value, key) in wallet.balances" :key="key">
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title class="text-xs-center">{{value}}</v-list-tile-title>
                  <v-list-tile-sub-title class="text-xs-center">{{key}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-flex>
          </v-layout>
          
          <v-divider class="mt-3"/>
          <v-card-actions>
            <v-flex xs6>
              <v-text-field type="number" v-model="tokenToBuy" label="Number of Token to Buy" outline></v-text-field>
            </v-flex>
            <v-flex xs6 class="pb-5">
              <v-btn @click="buy" color="success">Buy</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex v-else md6>
        <h1 class="display-2 text-xs-center mb-5 mt-5">Unlock with Mnemonic</h1>
        <v-text-field label="Mnemonic" outline v-model="mnemonic" placeholder="12 words mnemonic"></v-text-field>
        <v-card-actions class="justify-center">
          <v-btn color="info" :disabled="!mnemonic" class="text-center">Unlock with Mnemonic</v-btn>
        </v-card-actions>
        <v-divider class="mt-5"/>
        <h1 class="display-2 text-xs-center mb-5 mt-5">Or with a Private Key</h1>
        <v-text-field label="Private Key" outline v-model="privateKey" placeholder="a private key"></v-text-field>
        <v-card-actions class="justify-center">
          <v-btn
            color="info"
            @click="unlockWithPrivateKey"
            :disabled="!privateKey"
            class="text-center"
          >Unlock with Private Key</v-btn>
        </v-card-actions>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action, State } from 'vuex-class';
import { Component, Watch, Prop } from 'vue-property-decorator';
import Blockies from '../components/blockies.vue';
import { Balances } from '../types';

@Component({
  components: { Blockies },
})
export default class Wallet extends Vue {
  public mnemonic = '';
  public privateKey = '';
  public tokenToBuy = 0;

  @Action('generateRemote', { namespace: 'wallet' }) private generateRemote!: (
    payload: { privateKey?: string; mnemonic?: string },
  ) => void;
  @Action('buyPetitionToken', { namespace: 'wallet' }) private buyPetitionToken!: (
    payload: number,
  ) => void;
  @State('remote', { namespace: 'wallet' }) private wallet!: { address: string, balances: Balances };

  @Action('fetchBalances', { namespace: 'identity' }) private fetchBalance!: () => void;

  public async unlockWithPrivateKey() {
    await this.generateRemote({ privateKey: this.privateKey });
  }

  public async buy() {
    await this.buyPetitionToken(this.tokenToBuy);
    await this.fetchBalance();
    this.$router.push('/')
  }
}
</script>