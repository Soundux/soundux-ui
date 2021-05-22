<template>
  <v-dialog v-model="isNullAudioBackendLoaded" persistent max-width="600px">
    <v-card>
      <v-toolbar color="red lighten-1" dark>
        <v-icon left>mdi-music-off</v-icon>
        <span class="text-h5">{{ $t('noAudioBackend.title') }}</span>
      </v-toolbar>
      <v-card-text class="pt-3">
        {{ $t('noAudioBackend.notDetected') }} <br />{{ $t('noAudioBackend.choose') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="selectPipeWire">PipeWire</v-btn>
        <v-btn text color="primary" @click="selectPulseAudio">PulseAudio</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NoAudioBackendModal',
  computed: {
    isNullAudioBackendLoaded() {
      return this.$store.getters.settings.audioBackend === 0;
    },
  },
  methods: {
    selectPipeWire() {
      this.$store.commit('setAudioBackend', 1);
      this.$store.dispatch('saveSettings');
    },
    selectPulseAudio() {
      this.$store.commit('setAudioBackend', 2);
      this.$store.dispatch('saveSettings');
    },
  },
});
</script>
