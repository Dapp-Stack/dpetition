<template>
  <v-app v-if="apiAvailable">
    <Header/>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
  <v-app v-else>
    <ApiError/>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action, State } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import Header from './components/header.vue';
import ApiError from './components/apiError.vue';

@Component({
  components: { Header, ApiError },
})
export default class App extends Vue {
  @State('apiAvailable') private apiAvailable!: boolean;
  @Action('init') private init!: () => void;

  public mounted() {
    this.init();
  }
}
</script>
