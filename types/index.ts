export interface Sound {
  name: string;
  path: string;
}

export interface Tab {
  title: string;
  selectedSoundIndex: number;
  sounds: Sound[];
}

export interface App {
  name: string;
  icon: string;
}
