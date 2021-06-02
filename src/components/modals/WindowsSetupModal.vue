<template>
  <div>
    <v-dialog v-model="modal" persistent max-width="600px">
      <v-card>
        <v-toolbar color="orange" dark>
          <v-icon left>mdi-music-off</v-icon>
          <span class="text-h5">{{ $t('windows.badConfiguration') }}</span>
        </v-toolbar>
        <v-card-text class="pt-3">
          <p>
            {{ $t('windows.virtualAudioCableMisconfiguration') }}<br />
            {{ $t('windows.selectMic') }}
          </p>

          <v-select
            v-model="selected"
            :items="recordingDevices"
            return-object
            item-text="name"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="setup">
            <v-icon left>mdi-robot</v-icon>
            {{ $t('windows.automaticSetup') }}
          </v-btn>
          <v-btn text color="primary" @click="modal = false">
            <v-icon left>mdi-cancel</v-icon>
            {{ $t('actions.ignore') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="-1">
      {{ $t('windows.detectedMisconfiguration') }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="
            modal = true;
            snackbar = false;
          "
        >
          <v-icon left>mdi-gesture-tap</v-icon>
          {{ $t('windows.setUpNow') }}
        </v-btn>
        <v-btn color="grey" text v-bind="attrs" @click="snackbar = false">
          <v-icon left>mdi-cancel</v-icon>
          {{ $t('actions.dismiss') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordingDevice } from '@/types';

export default Vue.extend({
  name: 'WindowsSetupModal',
  data() {
    return {
      modal: false,
      snackbar: false,
      recordingDevices: [] as RecordingDevice[],
      selected: null as RecordingDevice | null,
    };
  },
  async mounted() {
    await this.$store.dispatch('getVBCableState');
    if (!this.$store.getters.isVBCableProperlySetup) {
      const recordingDevices = await window.getRecordingDevices();
      if (recordingDevices) {
        this.recordingDevices = recordingDevices[0];
        this.selected = recordingDevices[1];
      }
      this.snackbar = true;
    }
  },
  methods: {
    async setup() {
      const success = await window.setupVBCable(this.selected ? this.selected.guid : null);
      if (success) {
        // hide modal
        this.modal = false;
      }
    },
  },
});
</script>
