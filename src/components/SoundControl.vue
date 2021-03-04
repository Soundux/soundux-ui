<template>
  <v-row dense no-gutters class="mr-5">
    <v-col cols="1" align-self="center">
      <span class="sound-name">
        {{ playingSound.sound.name }}
      </span>
    </v-col>
    <v-col cols="auto">
      <v-btn v-if="playingSound.paused" icon @click="play"><v-icon>mdi-play</v-icon></v-btn>
      <v-btn v-else icon @click="pause"><v-icon>mdi-pause</v-icon></v-btn>
      <v-btn v-if="playingSound.repeat" icon @click="repeatOff"><v-icon>mdi-repeat</v-icon></v-btn>
      <v-btn v-else icon @click="repeat"><v-icon>mdi-repeat-off</v-icon></v-btn>
    </v-col>
    <v-col align-self="center">
      <v-slider
        v-model="readInMs"
        min="0"
        :max="playingSound.lengthInMs"
        hide-details
        @start="$store.commit('setSsDraggingSeekbar', true)"
        @end="$store.commit('setSsDraggingSeekbar', false)"
        @change="seek"
      >
        <span slot="prepend">{{ parseTime(playingSound.readInMs) }}</span>
        <span slot="append">{{ parseTime(playingSound.lengthInMs) }}</span>
      </v-slider>
    </v-col>
    <v-col cols="auto">
      <v-btn icon @click="stop"><v-icon>mdi-stop</v-icon></v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from 'dayjs';
import { PlayingSound } from '@/types';

export default Vue.extend({
  name: 'SoundControl',
  props: {
    playingSound: {
      type: Object as PropType<PlayingSound>,
      required: true,
    },
  },
  computed: {
    readInMs: {
      get() {
        return this.playingSound.readInMs;
      },
      set(ms: number) {
        this.$store.commit('updateSound', { playing: this.playingSound, ms });
      },
    },
  },
  methods: {
    async pause() {
      // @ts-ignore
      if (!window.pauseSound) {
        return;
      }
      // @ts-ignore
      // eslint-disable-next-line no-undef
      const pausedSound = (await window.pauseSound(this.playingSound.id)) as PlayingSound | false;
      if (pausedSound) {
        this.$store.commit('updateSound', {
          playing: this.playingSound,
          ms: pausedSound.readInMs,
          paused: true,
        });
      }
    },
    async play() {
      // @ts-ignore
      if (!window.resumeSound) {
        return;
      }
      // @ts-ignore
      // eslint-disable-next-line no-undef
      const resumedSound = (await window.resumeSound(this.playingSound.id)) as PlayingSound | false;
      if (resumedSound) {
        this.$store.commit('updateSound', {
          playing: this.playingSound,
          ms: resumedSound.readInMs,
          paused: false,
        });
      }
    },
    async seek(newValue: number) {
      // @ts-ignore
      if (!window.seekSound) {
        return;
      }
      // @ts-ignore
      // eslint-disable-next-line no-undef
      const seekedSound = (await window.seekSound(this.playingSound.id, newValue)) as
        | PlayingSound
        | false;
      if (seekedSound) {
        this.$store.commit('updateSound', { playing: this.playingSound, ms: seekedSound.readInMs });
      }
    },
    async repeat() {
      // @ts-ignore
      if (!window.repeatSound) {
        return;
      }
      // @ts-ignore
      // eslint-disable-next-line no-undef
      const repeatedSound = (await window.repeatSound(this.playingSound.id, true)) as
        | PlayingSound
        | false;
      if (repeatedSound) {
        this.$store.commit('updateSound', {
          playing: this.playingSound,
          ms: repeatedSound.readInMs,
          repeat: repeatedSound.repeat,
        });
      }
    },
    async repeatOff() {
      // @ts-ignore
      if (!window.repeatSound) {
        return;
      }
      // @ts-ignore
      // eslint-disable-next-line no-undef
      const repeatedSound = (await window.repeatSound(this.playingSound.id, false)) as
        | PlayingSound
        | false;
      if (repeatedSound) {
        this.$store.commit('updateSound', {
          playing: this.playingSound,
          ms: repeatedSound.readInMs,
          repeat: repeatedSound.repeat,
        });
      }
    },
    async stop() {
      // @ts-ignore
      if (!window.stopSound) {
        return;
      }
      // @ts-ignore
      const success = (await window.stopSound(this.playingSound.id)) as boolean; // eslint-disable-line no-undef
      if (success) {
        this.$store.commit('removeFromCurrentlyPlaying', this.playingSound);
      }
    },
    parseTime(time: number): string {
      const duration = dayjs.duration(time);
      if (duration.hours() === 0) {
        return duration.format('mm:ss');
      }
      return duration.format('HH:mm:ss');
    },
  },
});
</script>