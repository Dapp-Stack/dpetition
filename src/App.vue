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
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { State, Action, Getter } from 'vuex-class';
  import Component from 'vue-class-component';

  @Component
  export default class App extends Vue {
    @Action('init') public init: any;

    public mounted() {
      this.init();
    }
  }
</script>