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
import { BackendFunction, callBackend } from '@/utils/backend';

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
    async pause(): Promise<void> {
      const pausedSound = await callBackend<PlayingSound>(
        BackendFunction.PAUSE_SOUND,
        this.playingSound.id
      );

      if (pausedSound) {
        this.$store.commit('updateSound', {
          playing: this.playingSound,
          ms: pausedSound.readInMs,
          paused: pausedSound.paused,
          repeat: pausedSound.repeat,
        });
      }
    },
    async play(): Promise<void> {
      const resumedSound = await callBackend<PlayingSound>(
        BackendFunction.RESUME_SOUND,
        this.playingSound.id
      );
      if (resumedSound) {
        this.$store.commit('updateSound', {
          playing: this.playingSound,
          ms: resumedSound.readInMs,
          paused: resumedSound.paused,
          repeat: resumedSound.repeat,
        });
      }
    },
    async seek(newValue: number): Promise<void> {
      const seekedSound = await callBackend<PlayingSound>(
        BackendFunction.SEEK_SOUND,
        this.playingSound.id,
        newValue
      );
      if (seekedSound) {
        this.$store.commit('updateSound', {
          playing: this.playingSound,
          ms: seekedSound.readInMs,
          paused: seekedSound.paused,
          repeat: seekedSound.repeat,
        });
      }
    },
    async repeat(): Promise<void> {
      const repeatedSound = await callBackend<PlayingSound>(
        BackendFunction.REPEAT_SOUND,
        this.playingSound.id,
        true
      );
      if (repeatedSound) {
        this.$store.commit('updateSound', {
          playing: this.playingSound,
          paused: repeatedSound.paused,
          repeat: repeatedSound.repeat,
        });
      }
    },
    async repeatOff(): Promise<void> {
      const repeatedSound = await callBackend<PlayingSound>(
        BackendFunction.REPEAT_SOUND,
        this.playingSound.id,
        false
      );
      if (repeatedSound) {
        this.$store.commit('updateSound', {
          playing: this.playingSound,
          paused: repeatedSound.paused,
          repeat: repeatedSound.repeat,
        });
      }
    },
    async stop(): Promise<void> {
      const success = await callBackend<boolean>(BackendFunction.STOP_SOUND, this.playingSound.id);
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
