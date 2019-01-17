<template>
  <img :src="dataUrl" />
</template>

<script lang="ts">
import Vue from 'vue';
import blockies from 'ethereum-blockies';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { Component, Prop } from 'vue-property-decorator';

blockies.create({});

@Component({})
export default class Blockies extends Vue {

  @Prop(String) public address!: string;

  get dataUrl() {
    const icon = blockies.create({
      seed: this.address,
    });
    return icon.toDataURL();
  }
}
</script>