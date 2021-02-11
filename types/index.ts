export interface Sound {
  name: string;
  path: string;
}

export interface Tab {
  title: string;
  selectedItem: Sound | null;
  sounds: Sound[];
}

export interface App {
  name: string;
  icon: string;
}
