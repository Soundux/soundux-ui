<template>
  <v-dialog v-model="setHotkeyModal" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn color="grey darken-3" block class="mb-2" v-bind="attrs" :disabled="!sound" v-on="on">
        <v-icon left dark>mdi-keyboard</v-icon>
        Set hotkey
      </v-btn>
    </template>
    <v-card v-if="sound">
      <v-card-title>
        <v-icon left dark>mdi-keyboard</v-icon>
        <span class="headline">Set hotkey for {{ sound.name }}</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="hotkey"
          label="Hotkey"
          @keydown.prevent=""
          @focus="focus"
          @blur="blur"
        ></v-text-field>
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
import Vue, { PropType } from 'vue';
import { Sound } from '~/types';

export default Vue.extend({
  name: 'SetHotkeyModal',
  props: {
    sound: {
      type: Object as PropType<Sound>,
      required: false,
      default: undefined,
    },
  },
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
