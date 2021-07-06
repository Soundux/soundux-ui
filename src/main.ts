import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import i18n from './plugins/i18n';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import dayjs from 'dayjs';
import $store from '@/store';
import duration from 'dayjs/plugin/duration';
import {
  Key,
  Output,
  PlayingSound,
  RecordingDevice,
  Settings,
  SortMode,
  Sound,
  Tab,
  UpdateData,
  YoutubeDlInfo,
} from '@/types';
import vueDebounce from 'vue-debounce';

declare global {
  interface Window {
    // frontend callback functions
    downloadProgressed: ((progress: number, eta: string) => void) | undefined;
    hotkeyReceived: ((hotkey: string, hotkeyData: Key[]) => void) | undefined;
    finishSound: ((playingSound: PlayingSound) => void) | undefined;
    onSoundPlayed: ((playingSound: PlayingSound) => void) | undefined;
    updateSound: ((playingSound: PlayingSound) => void) | undefined;
    onError: ((error: number) => void) | undefined;
    getTranslation: ((path: string) => string) | undefined;
    getStore: (() => typeof $store) | undefined;
    // backend functions (here we can register both the arguments and the return types)

    // linux specific
    isLinux: () => Promise<boolean | null>;
    startPassthrough: (name: string) => Promise<boolean | null>;
    stopPassthrough: (name: string) => Promise<void>;
    // windows specific
    isVBCableProperlySetup: () => Promise<boolean | null>;
    getRecordingDevices: () => Promise<[RecordingDevice[], RecordingDevice] | null>;
    setupVBCable: (selectedRecording: string | null) => Promise<boolean | null>;
    restartAsAdmin: () => Promise<void>;
    // others
    openUrl: (url: string) => Promise<void>;
    moveTabs: (tabIds: number[]) => Promise<Tab[]>;
    setSortMode: (tabId: number, sortMode: SortMode) => Promise<Tab | null>;
    getSettings: () => Promise<Settings>;
    getOutputs: () => Promise<Output[]>;
    changeSettings: (settings: Settings) => Promise<Settings>;
    setHotkey: (id: number, hotkeys: Key[]) => Promise<void>;
    stopSounds: () => Promise<void>;
    playSound: (id: number) => Promise<PlayingSound | null>;
    pauseSound: (id: number) => Promise<PlayingSound | null>;
    resumeSound: (id: number) => Promise<PlayingSound | null>;
    toggleSoundPlayback: () => Promise<boolean | null>;
    seekSound: (id: number, newValue: number) => Promise<PlayingSound | null>;
    repeatSound: (id: number, state: boolean) => Promise<PlayingSound | null>;
    stopSound: (id: number) => Promise<boolean | null>;
    deleteSound: (id: number) => Promise<boolean | null>;
    setCustomLocalVolume: (id: number, localVolume: number | null) => Promise<Sound | null>;
    setCustomRemoteVolume: (id: number, remoteVolume: number | null) => Promise<Sound | null>;
    refreshTab: (activeTabIndex: number) => Promise<Tab | null>;
    removeTab: (deleteIndex: number) => Promise<Tab[] | null>;
    addTab: () => Promise<Tab[] | null>;
    getPlayback: () => Promise<Output[] | null>;
    getHotkeySequence: (hotkeys: Key[]) => Promise<string | null>;
    getKeyName: (key: Key) => Promise<string | null>;
    requestHotkey: (state: boolean) => Promise<void>;
    requestKnob: (state: boolean) => Promise<void>;
    getSystemInfo: () => Promise<string | null>;
    getTabs: () => Promise<Tab[] | null>;
    getFavorites: () => Promise<number[] | null>;
    markFavorite: (id: number, favorite: boolean) => Promise<number[] | null>;
    isOnFavorites: (state: boolean) => Promise<void>;
    isYoutubeDLAvailable: () => Promise<boolean | null>;
    getYoutubeDLInfo: (input: string) => Promise<YoutubeDlInfo | null>;
    startYoutubeDLDownload: (input: string) => Promise<boolean | null>;
    stopYoutubeDLDownload: () => Promise<void>;
    updateCheck: () => Promise<UpdateData | null>;
    openFolder: (tabId: number) => Promise<void>;
  }
}

Vue.use(vueDebounce);

Vue.use(Toast, {
  // toast options
  position: 'bottom-right',
  timeout: 3000,
  closeOnClick: false,
  // plugin options
  transition: 'Vue-Toastification__fade',
  maxToasts: 3,
  newestOnTop: true,
});

dayjs.extend(duration);

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app');
