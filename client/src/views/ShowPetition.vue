<template>
  <v-container grid-list-xl>
    <v-layout align-center justify-center row>
      <h3>{{petition.title}}</h3>
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
  petition: Petition;

  @Action('list', { namespace: 'petition' }) private fetch!: () => void;
  @State('list', { namespace: 'petition' }) private petitions!: Petition[];

  public async mounted() {
    if (this.petitions.length === 0) {
      await this.fetch();
    }
    this.petition = this.petitions.find((p) => p.address === this.$route.params.address)
  }
}
</script>