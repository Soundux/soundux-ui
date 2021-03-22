<template>
  <v-dialog v-model="setHotkeyModal" max-width="600px" @input="stateChanged">
    <template #activator="{ on, attrs }">
      <v-btn
        :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
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
          autofocus
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
    reset(): void {
      this.$store.commit('setHotkeySequence', { sound: this.sound, hotkeySequence: '' });
      this.$store.dispatch('setHotkeys', { sound: this.sound, hotkeys: [] });
    },
    // handler function when the modal was opened/closed
    // open: we register the hotkeyReceived method for the backend here
    // close: the use of this is overloaded with SettingsModal which is why we unregister it
    async stateChanged(state: boolean): Promise<void> {
      if (state) {
        this.$store.commit('setHotkeySequence', {
          sound: this.sound,
          hotkeySequence: (await window.getHotkeySequence(this.sound.hotkeys)) || '',
        });

        window.hotkeyReceived = (hotkey: string, hotkeyData: number[]) => {
          this.$store.commit('setHotkeySequence', { sound: this.sound, hotkeySequence: hotkey });
          this.$store.dispatch('setHotkeys', { sound: this.sound, hotkeys: hotkeyData });
        };
      } else {
        window.hotkeyReceived = undefined;
      }
    },
    async focus(): Promise<void> {
      await window.requestHotkey(true);
    },
    async blur(): Promise<void> {
      await window.requestHotkey(false);
    },
  },
});
</script>
