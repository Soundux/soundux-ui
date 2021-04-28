<template>
  <v-dialog v-model="settingsModal" max-width="750px">
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
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <div v-on="on" class="d-inline-block">
                  <v-select
                    :items="themes"
                    v-model="theme"
                    item-text="name"
                    item-value="id"
                    :label="$t('settings.theme.title')"
                    hide-details
                    prepend-icon="mdi-brightness-4"
                    class="ma-0"
                    v-bind="attrs"
                    v-on="on"
                  ></v-select>
                </div>
              </template>
              <span>Select the theme Soundux should use</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <div v-on="on" class="d-inline-block">
                  <v-select
                    :items="viewModes"
                    item-text="name"
                    item-value="id"
                    v-model="viewMode"
                    :label="$t('settings.viewMode.title')"
                    hide-details
                    prepend-icon="mdi-eye"
                    class="ma-0"
                    v-bind="attrs"
                    v-on="on"
                  ></v-select>
                </div>
              </template>
              <span>Select your preferred view</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <div v-on="on" class="d-inline-block">
                  <v-checkbox
                    v-model="tabHotkeysOnly"
                    :label="$t('settings.tabHotkeysOnly')"
                    hide-details
                    prepend-icon="mdi-tab-unselected"
                    class="ma-0"
                    v-bind="attrs"
                    v-on="on"
                  ></v-checkbox>
                </div>
              </template>
              <span>
                Only trigger sound hotkeys if they are in the current tab / favorites (can be used to map
                2 sounds from different tabs to the same key)
              </span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <div v-on="on" class="d-inline-block">
                  <v-checkbox
                    v-model="allowOverlapping"
                    :label="$t('settings.allowOverlapping')"
                    hide-details
                    prepend-icon="mdi-surround-sound"
                    class="ma-0"
                    v-bind="attrs"
                    v-on="on"
                  ></v-checkbox>
                </div>
              </template>
              <span>Allows multiple sounds to be played at the same time</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <div v-on="on" class="d-inline-block">
                  <v-checkbox
                    v-model="deleteToTrash"
                    :label="$t('settings.deleteToTrash')"
                    hide-details
                    prepend-icon="mdi-delete-outline"
                    class="ma-0"
                    v-bind="attrs"
                    v-on="on"
                  ></v-checkbox>
                </div>
              </template>
              <span>
                When deleting sounds move them to the trash instead of deleting them permanently
              </span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <div v-on="on" class="d-inline-block">
                  <v-checkbox
                    v-model="useAsDefaultDevice"
                    :disabled="!$store.getters.isLinux"
                    :label="$t('settings.useAsDefaultDevice')"
                    hide-details
                    prepend-icon="mdi-speaker"
                    class="ma-0"
                    v-bind="attrs"
                    v-on="on"
                  ></v-checkbox>
                </div>
              </template>
              <span>Use Soundux as default input device (useful for games)</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <div v-on="on" class="d-inline-block">
                  <v-checkbox
                    v-model="muteDuringPlayback"
                    :disabled="!$store.getters.isLinux"
                    :label="$t('settings.muteDuringPlayback')"
                    hide-details
                    prepend-icon="mdi-volume-mute"
                    class="ma-0"
                    v-bind="attrs"
                    v-on="on"
                  ></v-checkbox>
                </div>
              </template>
              <span>Mute your microphone during playback of sounds</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <div v-on="on" class="d-inline-block">
                  <v-checkbox
                    v-model="minimizeToTray"
                    :label="$t('settings.minimizeToTray')"
                    hide-details
                    prepend-icon="mdi-window-minimize"
                    class="ma-0"
                    v-bind="attrs"
                    v-on="on"
                  ></v-checkbox>
                </div>
              </template>
              <span>When closing the window, minimize to the system tray instead</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="stopHotkey"
                  id="stopHotkeyField"
                  :label="$t('settings.stopHotkey')"
                  prepend-icon="mdi-keyboard"
                  readonly
                  append-icon="mdi-close"
                  hide-details
                  class="ma-0"
                  v-bind="attrs"
                  v-on="on"
                  @click:append="clearStopHotkey"
                  @focus="focus"
                  @blur="blur"
                ></v-text-field>
              </template>
              <span>Set a hotkey to stop all sounds</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="pushToTalkKeys"
                  id="pushToTalkKeysField"
                  :label="$t('settings.pushToTalkKeys')"
                  prepend-icon="mdi-keyboard-variant"
                  readonly
                  append-icon="mdi-close"
                  hide-details
                  class="ma-0"
                  v-bind="attrs"
                  v-on="on"
                  @click:append="clearPushToTalkKeys"
                  @focus="focus"
                  @blur="blur"
                ></v-text-field>
              </template>
              <span>A set of keys to press while playing a sound (useful for games)</span>
            </v-tooltip>
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
import { Theme, ViewMode } from '@/types';

interface Option {
  id: number;
  name: string;
}

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
    viewModes(): Option[] {
      return [
        { id: 0, name: this.$t('settings.viewMode.listView').toString() },
        { id: 1, name: this.$t('settings.viewMode.gridView').toString() },
        { id: 2, name: this.$t('settings.viewMode.launchpadMode').toString() },
      ];
    },
    themes(): Option[] {
      return [
        { id: 0, name: this.$t('settings.theme.system').toString() },
        { id: 1, name: this.$t('settings.theme.dark').toString() },
        { id: 2, name: this.$t('settings.theme.light').toString() },
      ];
    },
    tabHotkeysOnly: {
      get(): boolean {
        return this.$store.getters.settings.tabHotkeysOnly;
      },
      set(state: boolean) {
        this.$store.commit('setTabHotkeysOnly', state);
        this.$store.dispatch('saveSettings');
      },
    },
    viewMode: {
      get(): ViewMode {
        return this.$store.getters.settings.viewMode;
      },
      set(state: ViewMode) {
        this.$store.commit('setViewMode', state);
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
    deleteToTrash: {
      get(): boolean {
        return this.$store.getters.settings.deleteToTrash;
      },
      set(state: boolean) {
        this.$store.commit('setDeleteToTrash', state);
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
    theme: {
      get(): Theme {
        return this.$store.getters.settings.theme;
      },
      set(state: Theme) {
        this.$store.commit('setTheme', state);
        this.$store.dispatch('saveSettings');
      },
    },
  },
  watch: {
    // handler function when the modal was opened/closed
    // open: we register the hotkeyReceived method for the backend here
    // close: the use of this is overloaded with SetHotkeyModal which is why we unregister it
    settingsModal(state: boolean) {
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
  },
  methods: {
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
  grid-gap: 20px 10px;
}
</style>
