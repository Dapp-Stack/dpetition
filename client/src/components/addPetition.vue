<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="$emit('close')">
        <v-icon>fa-close fa-2x</v-icon>
      </v-btn>
      <v-toolbar-title>Add Petition</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn :disabled="!valid" color="success" @click="create">Create</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-text-field v-model="title" :counter="50" label="Title" required></v-text-field>
            <editor-content :editor="editor"/>
          </v-flex>
          <v-flex xs12 sm6>
            <p>Expiration</p>
            <v-date-picker v-model="expireOn" :reactive="true"></v-date-picker>
            <span class="mx-5"></span>
            <v-time-picker v-model="expireAt"></v-time-picker>
          </v-flex>
        </v-layout>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Editor, EditorContent } from "tiptap";
import { Component, Watch, Prop } from "vue-property-decorator";

@Component({
  components: { EditorContent }
})
export default class AddPetition extends Vue {
  public editor: Editor = null;
  public valid: boolean = false;
  public title: string = '';
  public expireOn: string = '';
  public expireAt: string = '';
  public deposit: number = 1;

  public mounted() {
    this.editor = new Editor({
      content: "<p>This is just a boring paragraph</p>"
    });
  }

  public beforeDestroy() {
    this.editor.destroy();
  }

  public create() {

  }

  public close() {

  }
}
</script>