<template>
  <v-container grid-list-xl>
    <v-layout align-center justify-center row>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="petitions"
          class="elevation-1"
        >
          <template slot="no-data">
            <v-alert :value="true" color="error" icon="fa fa-warning" class="text-xs-center">
              There is no petitions to sign yet
            </v-alert>
          </template>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.calories }}</td>
            <td class="text-xs-right">{{ props.item.fat }}</td>
            <td class="text-xs-right">{{ props.item.carbs }}</td>
            <td class="text-xs-right">{{ props.item.protein }}</td>
            <td class="text-xs-right">{{ props.item.iron }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component
export default class Petitions extends Vue {
  public headers = [
    { text: 'Title', value: 'title' },
    { text: 'Expire At', value: 'expiratoin' },
    { text: 'Deposit', value: 'deposit' },
  ];
  @Action('loadPetitions') private loadPetitions: any;

  public mounted() {
    this.loadPetitions();
  }
}
</script>
