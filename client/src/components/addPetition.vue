<template>
  <v-card>
    <v-form v-model="valid">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="$emit('close')">
          <v-icon>fa-close fa-2x</v-icon>
        </v-btn>
        <v-toolbar-title>Add Petition</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn :disabled="!valid" dark large flat @click="create">
            <v-icon class="mr-2">fa-plus</v-icon>Create
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-xl>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-text-field
                v-model="title"
                :rules="titleRules"
                :counter="50"
                label="Title"
                prepend-icon="fa-header"
                class="mt-5"
                required
              ></v-text-field>

              <v-menu
                ref="expireOnMenuRef"
                :close-on-content-click="false"
                v-model="expireOnMenu"
                :nudge-right="40"
                :return-value.sync="expireOn"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  class="mt-5"
                  v-model="expireOn"
                  :rules="expireOnRules"
                  label="Expire On"
                  prepend-icon="fa-calendar"
                  readonly
                  required
                ></v-text-field>
                <v-date-picker v-model="expireOn" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="expireOnMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.expireOnMenuRef.save(expireOn)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm6>
              <div class="editor mt-5">
                <editor-menu-bar :editor="editor">
                  <div
                    class="menubar is-hidden"
                    :class="{ 'is-focused': focused }"
                    slot-scope="{ commands, isActive, focused }"
                  >
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.bold() }"
                      @click="commands.bold"
                    >
                      <v-icon>fa-bold</v-icon>
                    </button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.italic() }"
                      @click="commands.italic"
                    >
                      <v-icon>fa-italic</v-icon>
                    </button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.strike() }"
                      @click="commands.strike"
                    >
                      <v-icon>fa-strikethrough</v-icon>
                    </button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.underline() }"
                      @click="commands.underline"
                    >
                      <v-icon>fa-underline</v-icon>
                    </button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.code() }"
                      @click="commands.code"
                    >
                      <v-icon>fa-code</v-icon>
                    </button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.paragraph() }"
                      @click="commands.paragraph"
                    >
                      <v-icon>fa-paragraph</v-icon>
                    </button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                      @click="commands.heading({ level: 1 })"
                    >H1</button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                      @click="commands.heading({ level: 2 })"
                    >H2</button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                      @click="commands.heading({ level: 3 })"
                    >H3</button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.bullet_list() }"
                      @click="commands.bullet_list"
                    >
                      <v-icon>fa-list-ul</v-icon>
                    </button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.ordered_list() }"
                      @click="commands.ordered_list"
                    >
                      <v-icon>fa-list-ol</v-icon>
                    </button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.blockquote() }"
                      @click="commands.blockquote"
                    >
                      <v-icon>fa-quote-right</v-icon>
                    </button>
                    
                    <button
                      class="menubar__button"
                      :class="{ 'is-active': isActive.code_block() }"
                      @click="commands.code_block"
                    >
                      <v-icon>fa-code</v-icon>
                    </button>
                  </div>
                </editor-menu-bar>
                <editor-content class="editor__content" :editor="editor"/>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { Action, State } from 'vuex-class';
import { Component, Watch, Prop } from 'vue-property-decorator';
import {
  Blockquote,
  BulletList,
  CodeBlock,
  HardBreak,
  Heading,
  ListItem,
  OrderedList,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions';
import { Petition } from '@dpetition/lib';
import moment from 'moment';

const tomorrow = () => moment(new Date()).add(1, 'days');

const titleRequired = (v: string) => !!v || 'Title is required';
const titleLength = (v: string) =>
  (v && v.length <= 50) || 'Title must be less than 50 characters';
const expireOnRequired = (v: string) => !!v || 'Expire On is required';
const expireOnMin = (v: string) => moment(v).isAfter(tomorrow()) || 'Expire On must be in at least 1 day';

@Component({
  components: {
    EditorContent,
    EditorMenuBar,
  },
})
export default class AddPetition extends Vue {
  public editor: any = null;
  public valid: boolean = false;
  public title: string = '';
  public titleRules = [titleRequired, titleLength];
  public expireOn: string = '';
  public expireOnRules = [expireOnRequired, expireOnMin];
  public expireOnMenu: boolean = false;

  @Action('create', { namespace: 'petition' }) private createPetition!: (
    petition: Petition,
  ) => void;
  @Action('fetchBalances', { namespace: 'identity' }) private fetchBalance!: () => void;


  public mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Bold(),
        new Code(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new History(),
      ],
      content: `
        <h2>
          My New Petition
        </h2>
        <h3>
          Why
        </h3>
        <p>
          This is why
        </p>
        <h3>
          What
        </h3>
        <p>
          This is what
        </p>
      `,
    });
  }

  public beforeDestroy() {
    this.editor.destroy();
  }

  public async create() {
    const petition: Petition = {
      title: this.title,
      description: this.editor.getHTML(),
      expireOn: new Date(this.expireOn),
      signers: [],
    };
    await this.createPetition(petition);
    await this.fetchBalance();
    this.$emit('close');
  }
}
</script>

<style lang="scss">
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

.menubar {
  margin-bottom: 1rem;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;

  &.is-hidden {
    visibility: hidden;
    opacity: 0;
  }

  &.is-focused {
    visibility: visible;
    opacity: 1;
    transition: visibility 0.2s, opacity 0.2s;
  }

  &__button {
    font-weight: bold;
    display: inline-flex;
    background: transparent;
    border: 0;
    color: $color-black;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: rgba($color-black, 0.05);
    }

    &.is-active {
      background-color: rgba($color-black, 0.1);
    }
  }
}

.editor {
  :focus {
    outline: none;
  }

  position: relative;
  max-width: 30rem;
  margin: 0 auto 5rem auto;

  &__content {
    pre {
      padding: 0.7rem 1rem;
      border-radius: 5px;
      background: $color-black;
      color: $color-white;
      font-size: 0.8rem;
      overflow-x: auto;

      code {
        display: block;
      }
    }

    p code {
      display: inline-block;
      padding: 0 0.4rem;
      border-radius: 5px;
      font-size: 0.8rem;
      font-weight: bold;
      background: rgba($color-black, 0.1);
      color: rgba($color-black, 0.8);
    }

    ul,
    ol {
      padding-left: 1rem;
    }

    li > p,
    li > ol,
    li > ul {
      margin: 0;
    }

    a {
      color: inherit;
    }

    blockquote {
      border-left: 3px solid rgba($color-black, 0.1);
      color: rgba($color-black, 0.8);
      padding-left: 0.8rem;
      font-style: italic;

      p {
        margin: 0;
      }
    }

    img {
      max-width: 100%;
      border-radius: 3px;
    }

    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;

      td,
      th {
        min-width: 1em;
        border: 2px solid $color-grey;
        padding: 3px 5px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;
        > * {
          margin-bottom: 0;
        }
      }

      th {
        font-weight: bold;
        text-align: left;
      }

      .selectedCell:after {
        z-index: 2;
        position: absolute;
        content: "";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(200, 200, 255, 0.4);
        pointer-events: none;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        width: 4px;
        z-index: 20;
        background-color: #adf;
        pointer-events: none;
      }
    }

    .tableWrapper {
      margin: 1em 0;
      overflow-x: auto;
    }

    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }
}
</style>