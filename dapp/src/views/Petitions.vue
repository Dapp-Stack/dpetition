<template>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component
export default class Petitions extends Vue {
  @Action('loadPetitions') private loadPetitions: any;

  public mounted() {
    this.loadPetitions();
  }
}
</script>
