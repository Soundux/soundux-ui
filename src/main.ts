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
import duration from 'dayjs/plugin/duration';
import { Output, PlayingSound, Settings, Tab, UpdateData, YoutubeDlInfo } from '@/types';

declare global {
  interface Window {
    // frontend callback functions
    downloadProgressed: ((progress: number, eta: string) => void) | undefined;
    hotkeyReceived: ((hotkey: string, hotkeyData: number[]) => void) | undefined;
    finishSound: ((playingSound: PlayingSound) => void) | undefined;
    onSoundPlayed: ((playingSound: PlayingSound) => void) | undefined;
    updateSound: ((playingSound: PlayingSound) => void) | undefined;
    onError: ((error: string) => void) | undefined;
    getTranslation: (path: string) => string;
    // backend functions (here we can register both the arguments and the return types)
    isLinux: () => Promise<boolean | null>;
    openUrl: (url: string) => Promise<void>;
    moveTabs: (tabIds: number[]) => Promise<Tab[]>;
    getSettings: () => Promise<Settings>;
    getOutputs: () => Promise<Output[]>;
    changeSettings: (settings: Settings) => Promise<void>;
    setHotkey: (id: number, hotkeys: number[]) => Promise<void>;
    isSwitchOnConnectLoaded: () => Promise<boolean | null>;
    unloadSwitchOnConnect: () => Promise<void>;
    stopSounds: () => Promise<boolean | null>;
    startPassthrough: (name: string) => Promise<boolean | null>;
    stopPassthrough: () => Promise<void>;
    playSound: (id: number) => Promise<PlayingSound | null>;
    pauseSound: (id: number) => Promise<PlayingSound | null>;
    resumeSound: (id: number) => Promise<PlayingSound | null>;
    seekSound: (id: number, newValue: number) => Promise<PlayingSound | null>;
    repeatSound: (id: number, state: boolean) => Promise<PlayingSound | null>;
    stopSound: (id: number) => Promise<boolean | null>;
    deleteSound: (id: number) => Promise<boolean | null>;
    refreshTab: (activeTabIndex: number) => Promise<Tab | null>;
    removeTab: (deleteIndex: number) => Promise<Tab[] | null>;
    addTab: () => Promise<Tab | null>;
    getPlayback: () => Promise<Output[] | null>;
    getHotkeySequence: (hotkeys: number[]) => Promise<string | null>;
    requestHotkey: (state: boolean) => Promise<void>;
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
  }
}

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
