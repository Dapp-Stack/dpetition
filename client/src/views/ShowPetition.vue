<template>
  <v-container grid-list-xl>
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
            <v-btn color="success">
              <v-icon class="mr-2">fa-pencil</v-icon>
              <span>Sign</span>
            </v-btn>
            <v-btn>
              <v-icon class="mr-2">fa-eraser</v-icon>
              <span>Withdraw</span>
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
  public petition: Petition | undefined = undefined;

  @Action('list', { namespace: 'petition' }) private fetch!: () => void;
  @State('list', { namespace: 'petition' }) private petitions!: Petition[];

  public async mounted() {
    if (this.petitions.length === 0) {
      await this.fetch();
    }
    this.petition = this.petitions.find((p) => p.address === this.$route.params.address);
  }
}
</script>