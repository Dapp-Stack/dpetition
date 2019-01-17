<template>
  <v-toolbar app>
    <v-toolbar-title class="headline text-uppercase">
      <span>DPetition</span>
      <span>|</span>
      <span class="font-weight-light">Sign Petition that Matters</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn flat to="/">
      <v-icon class="mr-2">fa-pencil</v-icon>
      <span>List Petitions</span>
    </v-btn>
    <v-dialog
      v-model="addPetitionDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-btn slot="activator" color="primary">
        <v-icon class="mr-2">fa-plus</v-icon>
        <span>Add Petition</span>
      </v-btn>
      <AddPetition @close="addPetitionDialog=false"/>
    </v-dialog>
    <v-menu v-if="address" :close-on-content-click="false" :nudge-bottom="50" bottom>
      <v-btn slot="activator" fab small color="indigo" dark>
        <v-icon>fa-user</v-icon>
      </v-btn>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <Blockies :address="address"/>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ensName}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>
        <v-list>
          <v-list-tile>
            <v-list-tile-title>{{address}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" flat @click="logout">
            <v-icon class="mr-2">fa-sign-out</v-icon>
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <v-btn v-else color="success" to="/connect">
      <v-icon class="mr-2">fa-user</v-icon>
      <span>Connect</span>
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import AddPetition from "./addPetition.vue";
import Blockies from "./blockies.vue";

@Component({
  components: { AddPetition, Blockies }
})
export default class Header extends Vue {
  public addPetitionDialog = false;

  @Action("destroy", { namespace: "identity" }) private destroy!: () => void;
  @State("address", { namespace: "identity" }) private address!: string;
  @State("ensName", { namespace: "identity" }) private ensName!: string;

  public logout() {
    this.destroy();
  }
}
</script>
