<template>
  <v-dialog v-model="setHotkeyModal" max-width="600px">
    <v-card v-if="sound">
      <v-card-title>
        <v-icon left>mdi-keyboard</v-icon>
        <span class="text-h5">{{ $t('hotkeys.setFor', { soundName: sound.name }) }}</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          id="hotkeyField"
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
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'SetHotkeyModal',
  computed: {
    ...mapGetters({
      sound: 'setHotkeySound',
    }),
    setHotkeyModal: {
      get(): boolean {
        return this.$store.getters.setHotkeyModal;
      },
      set(state: boolean) {
        this.$store.commit('setSetHotkeyModal', state);
      },
    },
  },
  watch: {
    // handler function when the modal was opened/closed
    // open: we register the hotkeyReceived method for the backend here
    // close: the use of this is overloaded with SettingsModal which is why we unregister it
    async setHotkeyModal(state: boolean): Promise<void> {
      if (state && this.sound) {
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

      // focus on open
      if (this.setHotkeyModal) {
        requestAnimationFrame(() => {
          const hotkeyField = document.getElementById('hotkeyField') as HTMLInputElement;
          hotkeyField.focus();
        });
      }
    },
  },
  methods: {
    reset() {
      this.$store.commit('setHotkeySequence', { sound: this.sound, hotkeySequence: '' });
      this.$store.dispatch('setHotkeys', { sound: this.sound, hotkeys: [] });
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
