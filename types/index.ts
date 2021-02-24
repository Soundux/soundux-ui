export interface Sound {
  id: number;
  name: string;
  path: string;
}

export interface PlayingSound {
  id: number;
  length: number;
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

export interface Data {
  output: string;
  tabs: Tab[];
}

export interface App {
  name: string;
  icon: string;
}

export interface Settings {
  selectedTab: number;
  allowOverlapping: boolean;
  darkTheme: boolean;
  stopHotkey: number[];
  tabHotkeysOnly: boolean;
}
