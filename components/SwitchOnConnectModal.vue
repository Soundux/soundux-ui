<template>
  <v-dialog v-model="$store.getters.switchOnConnectLoaded" persistent max-width="600px">
    <v-card>
      <v-toolbar color="red lighten-1" dark>
        <v-icon left>mdi-alert-octagon-outline</v-icon>
        <span class="text-h5">Switch on connect module detected!</span>
      </v-toolbar>
      <v-card-text class="pt-3">
        The PulseAudio
        <code>module-switch-on-connect</code>
        module has been detected.<br />This causes severe problems!<br />To continue using Soundux,
        please disable it.<br /><br />
        For more information (e.g. how to disable this permanently) please refer to
        <a target="#" @click="openWikiPage">our dedicated wiki page</a>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$store.dispatch('unloadSwitchOnConnect')">
          Disable now
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SwitchOnConnectModal',
  methods: {
    openWikiPage() {
      // @ts-ignore
      if (!window.openUrl) {
        return;
      }
      // @ts-ignore
      window.openUrl('https://github.com/Soundux/Soundux/wiki/Problems-with-switch-on-connect-module'); // eslint-disable-line no-undef
    },
  },
});
</script>

<style scoped></style>
