<template>
  <v-dialog v-model="settingsModal" max-width="600px" @input="stateChanged">
    <template #activator="{ on, attrs }">
      <v-btn
        :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
        block
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>mdi-cog</v-icon>
        Settings
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-cog</v-icon>
        <span class="text-h5">Settings</span>
      </v-card-title>
      <v-card-text>
        <v-checkbox v-model="tabHotkeysOnly" label="Hotkeys only for current tab"></v-checkbox>
        <v-checkbox v-model="allowOverlapping" label="Allow sound overlapping"></v-checkbox>
        <v-checkbox v-model="gridView" label="Grid view"></v-checkbox>
        <v-checkbox v-model="useAsDefaultDevice" label="Use as default device"></v-checkbox>
        <v-checkbox v-model="darkTheme" label="Dark theme"></v-checkbox>
        <v-text-field
          v-model="stopHotkey"
          label="Stop hotkey"
          prepend-icon="mdi-keyboard"
          readonly
          append-icon="mdi-close"
          hide-details
          @click:append="clearHotkey"
          @focus="focus"
          @blur="blur"
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
  computed: {
    tabHotkeysOnly: {
      get() {
        return this.$store.getters.settings.tabHotkeysOnly;
      },
      set(state: boolean) {
        this.$store.commit('setTabHotkeysOnly', state);
        this.$store.dispatch('saveSettings');
      },
    },
    allowOverlapping: {
      get() {
        return this.$store.getters.settings.allowOverlapping;
      },
      set(state: boolean) {
        this.$store.commit('setAllowOverlapping', state);
        this.$store.dispatch('saveSettings');
      },
    },
    gridView: {
      get() {
        return this.$store.getters.settings.gridView;
      },
      set(state: boolean) {
        this.$store.commit('setGridView', state);
        this.$store.dispatch('saveSettings');
      },
    },
    useAsDefaultDevice: {
      get() {
        return this.$store.getters.settings.useAsDefaultDevice;
      },
      set(state: boolean) {
        this.$store.dispatch('setUseAsDefaultDevice', state);
      },
    },
    darkTheme: {
      get() {
        return this.$store.getters.settings.darkTheme;
      },
      set(state: boolean) {
        this.$store.commit('setDarkTheme', state);
        this.$store.dispatch('saveSettings');
      },
    },
  },
  async mounted() {
    await this.$store.dispatch('getSettings');
    // @ts-ignore
    if (!window.getHotkeySequence) {
      return;
    }
    // @ts-ignore
    this.stopHotkey = await window.getHotkeySequence(this.$store.getters.settings.stopHotkey); // eslint-disable-line no-undef
  },
  methods: {
    // handler function when the modal was opened/closed
    // open: we register the hotkeyReceived method for the backend here
    // close: the use of this is overloaded with SetHotkeyModal which is why we unregister it
    stateChanged(state: boolean) {
      // @ts-ignore
      if (!window.getHotkeySequence) {
        return;
      }
      if (state) {
        // @ts-ignore
        window.hotkeyReceived = (hotkey: string, hotkeyData: number[]) => {
          this.stopHotkey = hotkey;
          this.$store.commit('setStopHotkey', hotkeyData);
          this.$store.dispatch('saveSettings');
        };
      } else {
        // @ts-ignore
        window.hotkeyReceived = undefined;
      }
    },
    clearHotkey() {
      this.stopHotkey = '';
      this.$store.commit('setStopHotkey', []);
      this.$store.dispatch('saveSettings');
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
