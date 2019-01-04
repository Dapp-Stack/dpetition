<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu :router="true" mode="horizontal">
          <el-menu-item index="/">All Petitions</el-menu-item>
          <el-menu-item index="/petitions/new">
            <el-button type="primary" icon="el-icon-plus">New Petition</el-button>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view v-if="contractsDeployed"/>
        <el-card v-else-if="provider" class="box-card">
          <div slot="header" class="clearfix">
            <span>Contracts not deployed</span>
          </div>
        </el-card>
        <el-card v-else class="box-card">
          <div slot="header" class="clearfix">
            <span>Not Connected</span>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { State, Action, Getter } from 'vuex-class';
  import Component from 'vue-class-component';
  import { JsonRpcProvider } from 'ethers/providers';

  import { Contracts } from './types';

  @Component
  export default class App extends Vue {
    @State('provider') private provider!: null | JsonRpcProvider;
    @Getter('contractsDeployed') private contractsDeployed!: boolean;
    @Action('init') private init: any;

    public mounted() {
      this.init();
    }
  }
</script>