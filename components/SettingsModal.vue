<template>
  <v-dialog v-model="settingsModal" max-width="600px">
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
          hide-details
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
  mounted() {
    this.$store.dispatch('getSettings');
    // @ts-ignore
    window.hotkeyReceived = (hotkey: string, hotkeyData: number[]) => {
      console.log(hotkey);
      this.stopHotkey = hotkey;
      this.$store.state.settings.stopHotkey = hotkeyData;
    };
  },
  methods: {
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

<style scoped></style>
