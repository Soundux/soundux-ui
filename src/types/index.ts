export interface Sound {
  id: number;
  name: string;
  modifiedDate: number;
  path: string;
  hotkeys: number[];
  animationEvent?: (event: AnimationEvent) => void;
  hotkeySequence: string;
  isFavorite: boolean;
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
  uploader?: string;
  thumbnails?: Thumbnail[];
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
  sounds: Sound[];
}

export interface UpdateData {
  current: string;
  latest: string;
  outdated: boolean;
}

export interface Output {
  name: string;
  application: string;
  appIcon?: string; // Base64 image
}

export type Playing = PlayingSound | Output;

export enum SortMode {
  ModifiedDate_Ascending,
  ModifiedDate_Descending,
  Alphabetical_Ascending,
  Alphabetical_Descending,
}

export enum Theme {
  System,
  Dark,
  Light,
}

export enum ViewMode {
  List,
  Grid,
  EmulatedLaunchpad,
}

export interface Settings {
  output: string;
  selectedTab: number;
  allowOverlapping: boolean;
  deleteToTrash: boolean;
  syncVolumes: boolean;
  theme: Theme;
  viewMode: ViewMode;
  stopHotkey: number[];
  pushToTalkKeys: number[];
  sortMode: SortMode;
  tabHotkeysOnly: boolean;
  minimizeToTray: boolean;
  localVolume: number;
  remoteVolume: number;
  useAsDefaultDevice: boolean;
  muteDuringPlayback: boolean;
}
