<template>
  <v-container grid-list-xl>
    <v-snackbar v-model="snackbar" bottom multi-line>
      Petition Signed
      <v-btn color="pink" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by while your transaction is mined
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout v-if="petition" align-center justify-center row>
      <v-flex xs12>
        <v-card class="mt-5">
          <v-card-title>
            <v-icon large left>fa-header</v-icon>
            <span class="title font-weight-light">{{petition.title}}</span>
            <v-spacer></v-spacer>
            <p class="title font-weight-light">{{petition.signers.length}} signer(s)</p>
          </v-card-title>
          <v-card-text v-html="petition.description"></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="!isSigner()" @click="sign" color="success" :disabled="loading" :loading="loading">
              <v-icon class="mr-2">fa-pencil</v-icon>
              <span>Sign</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action, State } from 'vuex-class';
import { Component, Watch } from 'vue-property-decorator';
import { Petition } from '@dpetition/lib';

@Component
export default class ShowPetition extends Vue {
  public petition: Petition | null = null;
  public snackbar = false;
  public loading = false;

  @Action('list', { namespace: 'petition' }) private fetch!: () => void;
  @Action('sign', { namespace: 'petition' }) private signPetition!: (petition: Petition) => void;
  @State('list', { namespace: 'petition' }) private petitions!: Petition[];
  @State('address', { namespace: 'identity' }) private address!: string;

  public async mounted() {
    if (this.petitions.length === 0) {
      await this.fetch();
    }
    this.petition = this.petitions.find((p) => p.address === this.$route.params.address) || null;
  }

  public async sign() {
    this.loading = true;
    await this.signPetition(this.petition);
    this.snackbar = true;
    this.loading = false;
  }

  public isSigner() {
    return this.petition.signers.includes(this.address);
  }
}
</script>