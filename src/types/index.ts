export interface Sound {
  id: number;
  name: string;
  path: string;
  hotkeys: number[];
  hotkeySequence: string;
}

export interface Thumbnail {
  height: number;
  url: string;
  width: number;
  resolution: string;
  id: string;
}

export interface YoutubeDlInfo {
  title: string;
  uploader: string;
  thumbnails: Thumbnail[];
}

export interface PlayingSound {
  id: number;
  lengthInMs: number;
  readInMs: number;
  paused: boolean;
  repeat: boolean;
  sound: Sound;
}

export interface Tab {
  id: number;
  name: string;
  selectedSoundIndex?: number;
  sounds: Sound[];
}

export interface Output {
  name: string;
  application: string;
  appIcon?: string; // Base64 image
}

export type Playing = PlayingSound | Output;

export interface Settings {
  output: string;
  selectedTab: number;
  allowOverlapping: boolean;
  darkTheme: boolean;
  stopHotkey: number[];
  tabHotkeysOnly: boolean;
  launchPadMode: boolean;
  gridView: boolean;
  localVolume: number;
  remoteVolume: number;
  useAsDefaultDevice: boolean;
  muteDuringPlayback: boolean;
}
