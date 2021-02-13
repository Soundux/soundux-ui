<template>
  <v-dialog v-model="settingsModal" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn color="grey darken-3" block class="mb-2" v-bind="attrs" v-on="on">
        <v-icon left dark>mdi-cog</v-icon>
        Settings
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon left dark>mdi-cog</v-icon>
        <span class="headline">Settings</span>
      </v-card-title>
      <v-card-text>
        <v-checkbox label="Hotkeys only for current tab"></v-checkbox>
        <v-checkbox label="Allow sound overlapping"></v-checkbox>
        <v-checkbox v-model="$vuetify.theme.dark" label="Dark theme"></v-checkbox>
        <v-text-field
          v-model="stopHotkey"
          label="Stop hotkey"
          prepend-icon="mdi-keyboard"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="settingsModal = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SettingsModal',
  data() {
    return {
      settingsModal: false,
      stopHotkey: '',
    };
  },
  methods: {
    focus() {
      // TODO: send to backend
    },
    blur() {
      // TODO: send to backend
    },
  },
});
</script>

<style scoped></style>
