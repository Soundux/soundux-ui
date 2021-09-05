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
            <v-select
              v-model="theme"
              :items="themes"
              item-text="name"
              item-value="id"
              :label="$t('settings.theme.title')"
              hide-details
              prepend-icon="mdi-theme-light-dark"
              class="ma-0"
            >
              <template #selection="{ item }">
                <v-row dense no-gutters align="center">
                  <v-col v-if="item.icon" cols="auto">
                    <v-icon left v-text="item.icon"></v-icon>
                  </v-col>
                  <v-col>
                    {{ item.name }}
                  </v-col>
                </v-row>
              </template>
              <template #item="{ item }">
                <v-row dense no-gutters align="center">
                  <v-col v-if="item.icon" cols="auto">
                    <v-icon left v-text="item.icon"></v-icon>
                  </v-col>
                  <v-col>
                    {{ item.name }}
                  </v-col>
                </v-row>
              </template>
            </v-select>
            <v-select
              v-model="viewMode"
              :items="viewModes"
              item-text="name"
              item-value="id"
              :label="$t('settings.viewMode.title')"
              hide-details
              prepend-icon="mdi-eye"
              class="ma-0"
            >
              <template #selection="{ item }">
                <v-row dense no-gutters align="center">
                  <v-col v-if="item.icon" cols="auto">
                    <v-icon left v-text="item.icon"></v-icon>
                  </v-col>
                  <v-col>
                    {{ item.name }}
                  </v-col>
                </v-row>
              </template>
              <template #item="{ item }">
                <v-row dense no-gutters align="center">
                  <v-col v-if="item.icon" cols="auto">
                    <v-icon left v-text="item.icon"></v-icon>
                  </v-col>
                  <v-col>
                    {{ item.name }}
                  </v-col>
                </v-row>
              </template>
            </v-select>
            <template v-if="$store.getters.isLinux">
              <v-select
                v-model="audioBackend"
                :items="audioBackends"
                item-text="name"
                item-value="id"
                :label="$t('settings.audioBackend')"
                hide-details
                prepend-icon="mdi-cast-audio"
                class="ma-0"
              >
              </v-select>
              <v-checkbox
                v-model="useAsDefaultDevice"
                :disabled="$store.getters.settings.audioBackend === 1"
                :label="$t('settings.useAsDefaultDevice')"
                hide-details
                prepend-icon="mdi-speaker"
                class="ma-0"
              ></v-checkbox>
            </template>
            <v-checkbox
              v-model="tabHotkeysOnly"
              :label="$t('settings.tabHotkeysOnly')"
              hide-details
              prepend-icon="mdi-tab-unselected"
              class="ma-0"
            ></v-checkbox>
            <v-checkbox
              v-model="allowOverlapping"
              :label="$t('settings.allowOverlapping')"
              hide-details
              prepend-icon="mdi-surround-sound"
              class="ma-0"
            ></v-checkbox>
            <v-checkbox
              v-model="deleteToTrash"
              :label="$t('settings.deleteToTrash')"
              hide-details
              prepend-icon="mdi-delete-outline"
              class="ma-0"
            ></v-checkbox>
            <v-checkbox
              v-model="allowMultipleOutputs"
              :disabled="!$store.getters.isLinux"
              :label="$t('settings.allowMultipleOutputs')"
              hide-details
              prepend-icon="mdi-speaker-multiple"
              class="ma-0"
            ></v-checkbox>
            <v-checkbox
              v-model="muteDuringPlayback"
              :label="$t('settings.muteDuringPlayback')"
              hide-details
              prepend-icon="mdi-volume-mute"
              class="ma-0"
            ></v-checkbox>
            <v-checkbox
              v-model="minimizeToTray"
              :label="$t('settings.minimizeToTray')"
              hide-details
              prepend-icon="mdi-window-minimize"
              class="ma-0"
            ></v-checkbox>
            <v-text-field
              id="stopHotkeyField"
              v-model="stopHotkey"
              :label="$t('settings.stopHotkey')"
              prepend-icon="mdi-keyboard"
              readonly
              append-icon="mdi-close"
              hide-details
              class="ma-0"
              @click:append="clearStopHotkey"
              @focus="focus"
              @blur="blur"
            ></v-text-field>
            <v-text-field
              id="pushToTalkKeysField"
              v-model="pushToTalkKeys"
              :label="$t('settings.pushToTalkKeys')"
              prepend-icon="mdi-keyboard-variant"
              readonly
              append-icon="mdi-close"
              hide-details
              class="ma-0"
              @click:append="clearPushToTalkKeys"
              @focus="focus"
              @blur="blur"
            ></v-text-field>
            <v-text-field
              id="localVolumeKnobField"
              v-model="localVolumeKnob"
              :label="$t('settings.localVolumeKnob')"
              prepend-icon="mdi-alpha-k-circle-outline"
              readonly
              append-icon="mdi-close"
              hide-details
              class="ma-0"
              @click:append="clearLocalVolumeKnob"
              @focus="focusKnob"
              @blur="blurKnob"
            ></v-text-field>
            <v-text-field
              id="remoteVolumeKnobField"
              v-model="remoteVolumeKnob"
              :label="$t('settings.remoteVolumeKnob')"
              prepend-icon="mdi-alpha-k-circle-outline"
              readonly
              append-icon="mdi-close"
              hide-details
              class="ma-0"
              @click:append="clearRemoteVolumeKnob"
              @focus="focusKnob"
              @blur="blurKnob"
            ></v-text-field>
            <v-select
              v-model="language"
              :items="languages"
              item-text="name"
              item-value="locale"
              :label="$t('settings.language')"
              hide-details
              prepend-icon="mdi-translate"
              clearable
              class="ma-0"
            >
            </v-select>
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
import { AudioBackend, Key, Theme, ViewMode } from '@/types';
import VueI18n from 'vue-i18n';
import { getNativeName } from '@/utils';

interface Option {
  id: number;
  name: string;
  icon?: string;
}

interface Locale {
  id: number;
  name: string;
  locale: string;
}

export default Vue.extend({
  name: 'SettingsModal',
  data() {
    return {
      settingsModal: false,
      stopHotkey: '',
      pushToTalkKeys: '',
      localVolumeKnob: '',
      remoteVolumeKnob: '',
    };
  },
  computed: {
    viewModes(): Option[] {
      return [
        { id: 0, name: this.$t('settings.viewMode.listView').toString(), icon: 'mdi-view-list' },
        { id: 1, name: this.$t('settings.viewMode.gridView').toString(), icon: 'mdi-grid' },
        { id: 2, name: this.$t('settings.viewMode.launchpadMode').toString(), icon: 'mdi-gamepad' },
      ];
    },
    themes(): Option[] {
      return [
        { id: 0, name: this.$t('settings.theme.system').toString(), icon: 'mdi-brightness-auto' },
        { id: 1, name: this.$t('settings.theme.dark').toString(), icon: 'mdi-brightness-4' },
        { id: 2, name: this.$t('settings.theme.light').toString(), icon: 'mdi-brightness-6' },
      ];
    },
    audioBackends(): Option[] {
      return [
        { id: 1, name: 'PipeWire' },
        { id: 2, name: 'PulseAudio' },
      ];
    },
    languages(): Locale[] {
      const availableLocales: VueI18n.Locale[] = this.$i18n.availableLocales;
      return availableLocales.map((locale, id) => {
        const name = getNativeName(locale);
        return {
          id,
          name,
          locale,
        };
      });
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
    audioBackend: {
      get(): AudioBackend {
        return this.$store.getters.settings.audioBackend;
      },
      set(state: AudioBackend) {
        this.$store.commit('setAudioBackend', state);
        this.$store.dispatch('saveSettings');
      },
    },
    language: {
      get(): string | null {
        return this.$store.getters.settings.language;
      },
      set(state: string | null) {
        this.$store.commit('setLanguage', state);
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
    allowMultipleOutputs: {
      get(): boolean {
        return this.$store.getters.settings.allowMultipleOutputs;
      },
      set(state: boolean) {
        this.$store.commit('setAllowMultipleOutputs', state);
        this.$store.dispatch('saveSettings');
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
        window.hotkeyReceived = (hotkey: string, hotkeyData: Key[]) => {
          const stopHotkeyField = document.getElementById('stopHotkeyField') as HTMLElement;
          const pushToTalkKeysField = document.getElementById('pushToTalkKeysField') as HTMLElement;
          const localVolumeKnobField = document.getElementById('localVolumeKnobField') as HTMLElement;
          const remoteVolumeKnobField = document.getElementById('remoteVolumeKnobField') as HTMLElement;

          const { activeElement } = document;
          if (activeElement === stopHotkeyField) {
            this.stopHotkey = hotkey;
            this.$store.commit('setStopHotkey', hotkeyData);
          } else if (activeElement === pushToTalkKeysField) {
            this.pushToTalkKeys = hotkey;
            this.$store.commit('setPushToTalkKeys', hotkeyData);
          } else if (activeElement === localVolumeKnobField) {
            this.localVolumeKnob = hotkey;
            this.$store.commit('setLocalVolumeKnob', hotkeyData[0]);
            localVolumeKnobField.blur();
          } else if (activeElement === remoteVolumeKnobField) {
            this.remoteVolumeKnob = hotkey;
            this.$store.commit('setRemoteVolumeKnob', hotkeyData[0]);
            remoteVolumeKnobField.blur();
          }
          this.$store.dispatch('saveSettings');
        };
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
      this.localVolumeKnob =
        (await window.getKeyName(this.$store.getters.settings.localVolumeKnob)) || '';
      this.remoteVolumeKnob =
        (await window.getKeyName(this.$store.getters.settings.remoteVolumeKnob)) || '';
    },
    clearStopHotkey() {
      this.stopHotkey = '';
      this.$store.commit('setStopHotkey', []);
      this.$store.dispatch('saveSettings');
    },
    clearPushToTalkKeys() {
      this.pushToTalkKeys = '';
      this.$store.commit('setPushToTalkKeys', []);
      this.$store.dispatch('saveSettings');
    },
    clearLocalVolumeKnob() {
      this.localVolumeKnob = '';
      this.$store.commit('setLocalVolumeKnob', null);
      this.$store.dispatch('saveSettings');
    },
    clearRemoteVolumeKnob() {
      this.remoteVolumeKnob = '';
      this.$store.commit('setRemoteVolumeKnob', null);
      this.$store.dispatch('saveSettings');
    },
    async focus(): Promise<void> {
      await window.requestHotkey(true);
    },
    async blur(): Promise<void> {
      await window.requestHotkey(false);
    },
    async focusKnob(): Promise<void> {
      await window.requestKnob(true);
    },
    async blurKnob(): Promise<void> {
      await window.requestKnob(false);
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
  align-items: center;
}
</style>
