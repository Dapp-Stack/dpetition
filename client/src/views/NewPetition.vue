<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
        <h1 class="mb-2 mt-2">New Petition</h1>
        <v-text-field v-model="title" :rules="nameRules" :counter="50" label="Title" required></v-text-field>
        <editor-content :editor="editor" />

        <p>Expiration</p>
        <v-date-picker v-model="expiresOn" :reactive="true"></v-date-picker>
        <span class="mx-5"></span>
        <v-time-picker v-model="expiresAt"></v-time-picker>
        <v-card class="mx-auto">
          <v-toolbar card dense>
            <v-toolbar-title>
              <span class="subheading">Deposit</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>fa fa-dollar</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-layout justify-space-between mb-3>
              <v-flex text-xs-left>
                <span class="display-3 font-weight-light" v-text="bpm"></span>
                <span class="subheading font-weight-light mr-1">WEI</span>
              </v-flex>
              <v-flex text-xs-right>
                <v-btn :color="color" dark depressed fab @click="toggle">
                  <v-icon large>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>

            <v-slider v-model="bpm" :color="color" always-dirty min="40" max="218">
              <v-icon slot="prepend" :color="color" @click="decrement">fa-minus</v-icon>
              <v-icon slot="append" :color="color" @click="increment">fa-plus</v-icon>
            </v-slider>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Editor, EditorContent } from 'tiptap';
import { Component, Watch, Prop } from 'vue-property-decorator';

@Component({
  components: { EditorContent },
})
export default class NewPetition extends Vue {
  public editor: Editor = null;

  public mounted() {
    this.editor = new Editor({
      content: '<p>This is just a boring paragraph</p>',
    });
  }

  public beforeDestroy() {
    this.editor.destroy();
  }
}
</script>