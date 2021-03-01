<template>
  <v-dialog v-model="setHotkeyModal" max-width="600px" @input="stateChanged">
    <template #activator="{ on, attrs }">
      <v-btn
        :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
        block
        class="mb-2"
        v-bind="attrs"
        :disabled="!sound"
        v-on="on"
      >
        <v-icon left>mdi-keyboard</v-icon>
        {{ $t('hotkeys.title') }}
      </v-btn>
    </template>
    <v-card v-if="sound">
      <v-card-title>
        <v-icon left>mdi-keyboard</v-icon>
        <span class="text-h5">{{ $t('hotkeys.setFor', { soundName: sound.name }) }}</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          :value="sound.hotkeySequence"
          :label="$t('hotkeys.hotkey')"
          readonly
          append-icon="mdi-close"
          hide-details
          @click:append="reset"
          @focus="focus"
          @blur="blur"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
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
    };
  },
  computed: {
    sound() {
      return this.$store.getters.activeSound;
    },
  },
  methods: {
    reset() {
      this.$store.commit('setHotkeySequence', { sound: this.sound, hotkeySequence: '' });
      this.$store.dispatch('setHotkeys', { sound: this.sound, hotkeys: [] });
    },
    // handler function when the modal was opened/closed
    // open: we register the hotkeyReceived method for the backend here
    // close: the use of this is overloaded with SettingsModal which is why we unregister it
    async stateChanged(state: boolean) {
      // @ts-ignore
      if (!window.getHotkeySequence) {
        return;
      }
      if (state) {
        this.$store.commit('setHotkeySequence', {
          sound: this.sound,
          // @ts-ignore
          // eslint-disable-next-line no-undef
          hotkeySequence: await window.getHotkeySequence(this.sound.hotkeys),
        });

        // @ts-ignore
        window.hotkeyReceived = (hotkey: string, hotkeyData: number[]) => {
          this.$store.commit('setHotkeySequence', { sound: this.sound, hotkeySequence: hotkey });
          this.$store.dispatch('setHotkeys', { sound: this.sound, hotkeys: hotkeyData });
        };
      } else {
        // @ts-ignore
        window.hotkeyReceived = undefined;
      }
    },
    async focus() {
      // @ts-ignore
      if (!window.requestHotkey) {
        return;
      }
      // @ts-ignore
      await window.requestHotkey(true); // eslint-disable-line no-undef
    },
    async blur() {
      // @ts-ignore
      if (!window.requestHotkey) {
        return;
      }
      // @ts-ignore
      await window.requestHotkey(false); // eslint-disable-line no-undef
    },
  },
});
</script>
