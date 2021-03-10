<template>
  <v-dialog v-model="settingsModal" max-width="600px" @input="stateChanged">
    <template #activator="{ on, attrs }">
      <v-btn
        :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>mdi-cog</v-icon>
        {{ $t('settings.title') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-cog</v-icon>
        <span class="text-h5">{{ $t('settings.title') }}</span>
      </v-card-title>
      <v-card-text>
        <v-checkbox v-model="tabHotkeysOnly" :label="$t('settings.tabHotkeysOnly')"></v-checkbox>
        <v-checkbox v-model="allowOverlapping" :label="$t('settings.allowOverlapping')"></v-checkbox>
        <v-checkbox v-model="gridView" :label="$t('settings.gridView')"></v-checkbox>
        <v-checkbox
          v-model="useAsDefaultDevice"
          :disabled="!$store.getters.isLinux"
          :label="$t('settings.useAsDefaultDevice')"
        ></v-checkbox>
        <v-checkbox v-model="darkTheme" :label="$t('settings.darkTheme')"></v-checkbox>
        <v-text-field
          v-model="stopHotkey"
          :label="$t('settings.stopHotkey')"
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
import { BackendFunction, callBackend } from '@/utils/backend';

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
    this.stopHotkey =
      (await callBackend<string>(
        BackendFunction.GET_HOTKEY_SEQUENCE,
        this.$store.getters.settings.stopHotkey
      )) || '';
  },
  methods: {
    // handler function when the modal was opened/closed
    // open: we register the hotkeyReceived method for the backend here
    // close: the use of this is overloaded with SetHotkeyModal which is why we unregister it
    stateChanged(state: boolean): void {
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
    clearHotkey(): void {
      this.stopHotkey = '';
      this.$store.commit('setStopHotkey', []);
      this.$store.dispatch('saveSettings');
    },
    async focus(): Promise<void> {
      await callBackend(BackendFunction.REQUEST_HOTKEY, true);
    },
    async blur(): Promise<void> {
      await callBackend(BackendFunction.REQUEST_HOTKEY, false);
    },
  },
});
</script>
