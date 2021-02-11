<template>
  <v-dialog v-model="setHotkeyModal" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn color="grey darken-3" block class="mb-2" v-bind="attrs" v-on="on">
        <v-icon left dark>mdi-keyboard</v-icon>
        Set hotkey
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon left dark>mdi-keyboard</v-icon>
        <span class="headline">Set hotkey for ...</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="hotkey" label="Hotkey"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="reset">Reset</v-btn>
        <v-btn text color="primary" @click="setHotkeyModal = false">Cancel</v-btn>
        <v-btn text color="primary" @click="setHotkeyModal = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SetHotkeyModal',
  data() {
    return {
      setHotkeyModal: false,
      hotkey: '',
    };
  },
  methods: {
    reset() {
      this.hotkey = '';
    },
  },
});
</script>

<style scoped></style>
