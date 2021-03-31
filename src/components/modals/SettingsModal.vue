<template>
  <v-dialog v-model="settingsModal" max-width="700px" @input="stateChanged">
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
        <v-row justify="center">
          <div class="settings-grid my-5 mx-3">
            <v-checkbox
              v-model="tabHotkeysOnly"
              :label="$t('settings.tabHotkeysOnly')"
              hide-details
              prepend-icon="mdi-tab-unselected"
            ></v-checkbox>
            <v-checkbox
              v-model="launchpadMode"
              :label="$t('settings.launchpadMode')"
              hide-details
              prepend-icon="mdi-gamepad-square-outline"
            ></v-checkbox>
            <v-checkbox
              v-model="allowOverlapping"
              :label="$t('settings.allowOverlapping')"
              hide-details
              prepend-icon="mdi-surround-sound"
            ></v-checkbox>
            <v-checkbox
              v-model="gridView"
              :label="$t('settings.gridView')"
              hide-details
              prepend-icon="mdi-grid"
            ></v-checkbox>
            <v-checkbox
              v-model="useAsDefaultDevice"
              :disabled="!$store.getters.isLinux"
              :label="$t('settings.useAsDefaultDevice')"
              hide-details
              prepend-icon="mdi-speaker"
            ></v-checkbox>
            <v-checkbox
              v-model="muteDuringPlayback"
              :disabled="!$store.getters.isLinux"
              :label="$t('settings.muteDuringPlayback')"
              hide-details
              prepend-icon="mdi-volume-mute"
            ></v-checkbox>
            <v-checkbox
              v-model="minimizeToTray"
              :label="$t('settings.minimizeToTray')"
              hide-details
              prepend-icon="mdi-window-minimize"
            ></v-checkbox>
            <v-checkbox
              v-model="darkTheme"
              :label="$t('settings.darkTheme')"
              hide-details
              prepend-icon="mdi-brightness-4"
            ></v-checkbox>
            <v-text-field
              v-model="stopHotkey"
              id="stopHotkeyField"
              :label="$t('settings.stopHotkey')"
              prepend-icon="mdi-keyboard"
              readonly
              append-icon="mdi-close"
              hide-details
              @click:append="clearStopHotkey"
              @focus="focus"
              @blur="blur"
            ></v-text-field>
            <v-text-field
              v-model="pushToTalkKeys"
              id="pushToTalkKeysField"
              :label="$t('settings.pushToTalkKeys')"
              prepend-icon="mdi-keyboard-variant"
              readonly
              append-icon="mdi-close"
              hide-details
              @click:append="clearPushToTalkKeys"
              @focus="focus"
              @blur="blur"
            ></v-text-field>
          </div>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$store.commit('setSystemInfoModal', true)">
          <v-icon left>mdi-desktop-mac-dashboard</v-icon>
          {{ $t('systemInfo.title') }}
        </v-btn>
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
      pushToTalkKeys: '',
    };
  },
  computed: {
    tabHotkeysOnly: {
      get(): boolean {
        return this.$store.getters.settings.tabHotkeysOnly;
      },
      set(state: boolean) {
        this.$store.commit('setTabHotkeysOnly', state);
        this.$store.dispatch('saveSettings');
      },
    },
    launchpadMode: {
      get(): boolean {
        return this.$store.getters.settings.launchPadMode;
      },
      set(state: boolean) {
        this.$store.commit('setLaunchpadMode', state);
        this.$store.dispatch('saveSettings');
      },
    },
    muteDuringPlayback: {
      get(): boolean {
        return this.$store.getters.settings.muteDuringPlayback;
      },
      set(state: boolean) {
        this.$store.commit('setMuteDuringPlayback', state);
        this.$store.dispatch('saveSettings');
      },
    },
    allowOverlapping: {
      get(): boolean {
        return this.$store.getters.settings.allowOverlapping;
      },
      set(state: boolean) {
        this.$store.commit('setAllowOverlapping', state);
        this.$store.dispatch('saveSettings');
      },
    },
    gridView: {
      get(): boolean {
        return this.$store.getters.settings.gridView;
      },
      set(state: boolean) {
        this.$store.commit('setGridView', state);
        this.$store.dispatch('saveSettings');
      },
    },
    minimizeToTray: {
      get(): boolean {
        return this.$store.getters.settings.minimizeToTray;
      },
      set(state: boolean) {
        this.$store.commit('setMinimizeToTray', state);
        this.$store.dispatch('saveSettings');
      },
    },
    useAsDefaultDevice: {
      get(): boolean {
        return this.$store.getters.settings.useAsDefaultDevice;
      },
      set(state: boolean) {
        this.$store.dispatch('setUseAsDefaultDevice', state);
        // this automatically saves the settings as it also updates the selected output and we don't want to save them twice
      },
    },
    darkTheme: {
      get(): boolean {
        return this.$store.getters.settings.darkTheme;
      },
      set(state: boolean) {
        this.$store.commit('setDarkTheme', state);
        this.$store.dispatch('saveSettings');
      },
    },
  },
  methods: {
    // handler function when the modal was opened/closed
    // open: we register the hotkeyReceived method for the backend here
    // close: the use of this is overloaded with SetHotkeyModal which is why we unregister it
    stateChanged(state: boolean): void {
      if (state) {
        window.hotkeyReceived = (hotkey: string, hotkeyData: number[]) => {
          const stopHotkeyField = document.getElementById('stopHotkeyField');
          const pushToTalkKeysField = document.getElementById('pushToTalkKeysField');
          if (document.activeElement === stopHotkeyField) {
            this.stopHotkey = hotkey;
            this.$store.commit('setStopHotkey', hotkeyData);
          } else if (document.activeElement === pushToTalkKeysField) {
            this.pushToTalkKeys = hotkey;
            this.$store.commit('setPushToTalkKeys', hotkeyData);
          }
          this.$store.dispatch('saveSettings');
        };
        // the settings may have been changed by the backend (e.g. tray icon)
        this.$store.dispatch('getSettings');
        // update hotkey sequences
        this.updateHotkeySequences();
      } else {
        window.hotkeyReceived = undefined;
      }
    },
    async updateHotkeySequences(): Promise<void> {
      this.stopHotkey = (await window.getHotkeySequence(this.$store.getters.settings.stopHotkey)) || '';
      this.pushToTalkKeys =
        (await window.getHotkeySequence(this.$store.getters.settings.pushToTalkKeys)) || '';
    },
    clearStopHotkey(): void {
      this.stopHotkey = '';
      this.$store.commit('setStopHotkey', []);
      this.$store.dispatch('saveSettings');
    },
    clearPushToTalkKeys(): void {
      this.pushToTalkKeys = '';
      this.$store.commit('setPushToTalkKeys', []);
      this.$store.dispatch('saveSettings');
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

<style scoped lang="scss">
.settings-grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  row-gap: 0;
  grid-gap: 10px;
}
</style>
