<template>
  <v-container grid-list-xl>
    <v-layout align-center justify-center row>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="petitions"
          class="elevation-1 mt-5"
        >
          <template slot="no-data">
            <v-alert :value="true" color="warning" icon="fa fa-warning" class="text-xs-center my-5">
              There is no petitions to sign yet, why not adding one.
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
import { Action, State } from 'vuex-class';
import { Component } from 'vue-property-decorator';

const namespace: string = 'petition';

@Component
export default class Petitions extends Vue {
  public headers = [
    { text: 'Title', value: 'title' },
    { text: 'Expire On', value: 'expiration' },
    { text: 'Deposit', value: 'deposit' },
  ];

  @State('list', { namespace }) private petitions!: any[];

  public mounted() {
    // this.fetch();
  }
}
</script>
