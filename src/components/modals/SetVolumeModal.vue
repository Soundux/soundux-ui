<template>
  <v-dialog v-model="setVolumeModal" max-width="600px">
    <v-card v-if="sound">
      <v-card-title>
        <v-icon left>mdi-volume-source</v-icon>
        <span class="text-h5">{{ $t('customVolume.setFor', { soundName: sound.name }) }}</span>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters align="center" class="flex-nowrap">
          <v-col cols="auto">
            <v-checkbox v-model="enableLocalVolume" hide-details class="ma-0"></v-checkbox>
          </v-col>
          <v-col cols="auto">
            <v-icon
              left
              :disabled="sound.localVolume === null"
              v-text="volumeIcon(sound.localVolume)"
            ></v-icon>
          </v-col>
          <v-col
            cols="auto"
            class="text-truncate text--secondary hidden-xs-only"
            style="flex-basis: 115px"
          >
            {{ $t('volume.local') }}
          </v-col>
          <v-col>
            <v-slider
              v-if="enableLocalVolume"
              v-model="localVolume"
              dense
              hide-details
              :disabled="sound.localVolume === null"
              :thumb-label="$vuetify.breakpoint.smAndUp"
            ></v-slider>
            <v-slider v-else dense hide-details disabled></v-slider>
          </v-col>
        </v-row>

        <v-row no-gutters align="center" class="flex-nowrap">
          <v-col cols="auto">
            <v-checkbox v-model="enableRemoteVolume" hide-details class="ma-0"></v-checkbox>
          </v-col>
          <v-col cols="auto">
            <v-icon
              left
              :disabled="sound.remoteVolume === null"
              v-text="volumeIcon(sound.remoteVolume)"
            ></v-icon>
          </v-col>
          <v-col
            cols="auto"
            class="text-truncate text--secondary hidden-xs-only"
            style="flex-basis: 115px"
          >
            {{ $t('volume.remote') }}
          </v-col>
          <v-col>
            <v-slider
              v-if="enableRemoteVolume"
              v-model="remoteVolume"
              dense
              hide-details
              :thumb-label="$vuetify.breakpoint.smAndUp"
            ></v-slider>
            <v-slider v-else dense hide-details disabled></v-slider>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="setVolumeModal = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { volumeIcon } from '@/utils';

export default Vue.extend({
  name: 'SetVolumeModal',
  computed: {
    ...mapGetters({
      sound: 'setVolumeSound',
    }),
    setVolumeModal: {
      get(): boolean {
        return this.$store.getters.setVolumeModal;
      },
      set(state: boolean) {
        this.$store.commit('setSetVolumeModal', state);
      },
    },
    enableLocalVolume: {
      get(): boolean {
        return this.sound.localVolume !== null;
      },
      async set(value: boolean) {
        const newValue = value ? this.$store.getters.settings.localVolume : null;
        this.$store.commit('setSoundLocalVolume', {
          sound: this.sound,
          volume: newValue,
        });
        await window.setCustomLocalVolume(this.sound.id, newValue);
      },
    },
    localVolume: {
      get(): number {
        return this.sound.localVolume;
      },
      async set(value: number | null) {
        this.$store.commit('setSoundLocalVolume', { sound: this.sound, volume: value });
        await window.setCustomLocalVolume(this.sound.id, value);
      },
    },
    enableRemoteVolume: {
      get(): boolean {
        return this.sound.remoteVolume !== null;
      },
      async set(value: boolean) {
        const newValue = value ? this.$store.getters.settings.remoteVolume : null;
        this.$store.commit('setSoundRemoteVolume', {
          sound: this.sound,
          volume: newValue,
        });
        await window.setCustomLocalVolume(this.sound.id, newValue);
      },
    },
    remoteVolume: {
      get(): number {
        return this.sound.remoteVolume;
      },
      async set(value: number | null) {
        this.$store.commit('setSoundRemoteVolume', { sound: this.sound, volume: value });
        await window.setCustomRemoteVolume(this.sound.id, value);
      },
    },
  },
  methods: {
    volumeIcon,
  },
});
</script>
