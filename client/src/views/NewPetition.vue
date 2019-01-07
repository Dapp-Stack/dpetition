<template>
  <v-container>
    <v-layout>
      <v-flex xs12 md4>
        <v-text-field v-model="title" :rules="nameRules" :counter="10" label="Title" required></v-text-field>
      </v-flex>

      <v-flex xs12 md4>
        <v-time-picker v-model="expiresAt"></v-time-picker>
      </v-flex>

      <v-flex xs12 md4>
        <v-card class="mx-auto" max-width="600">
          <v-toolbar card dense>
            <v-toolbar-title>
              <span class="subheading">METRONOME</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-layout justify-space-between mb-3>
              <v-flex text-xs-left>
                <span class="display-3 font-weight-light" v-text="bpm"></span>
                <span class="subheading font-weight-light mr-1">BPM</span>
                <v-fade-transition>
                  <v-avatar
                    v-if="isPlaying"
                    :color="color"
                    :style="{
                animationDuration: animationDuration
              }"
                    class="mb-1 v-avatar--metronome"
                    size="12"
                  ></v-avatar>
                </v-fade-transition>
              </v-flex>
              <v-flex text-xs-right>
                <v-btn :color="color" dark depressed fab @click="toggle">
                  <v-icon large>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>

            <v-slider v-model="bpm" :color="color" always-dirty min="40" max="218">
              <v-icon slot="prepend" :color="color" @click="decrement">mdi-minus</v-icon>

              <v-icon slot="append" :color="color" @click="increment">mdi-plus</v-icon>
            </v-slider>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
