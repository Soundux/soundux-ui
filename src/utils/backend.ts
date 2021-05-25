import $store from '@/store';
import i18n from '@/plugins/i18n';
import Vue from 'vue';
import { PlayingSound, PlaylistMode, Tab } from '@/types';

export async function openUrl(url: string): Promise<void> {
  await window.openUrl(url);
}

export async function initialize(): Promise<void> {
  // register functions for the backend to call

  // error handling
  window.onError = (error: string) => {
    Vue.$toast.error(`${i18n.t('errors.error')}: ${i18n.t('errors.' + error)}`);
  };

  // function for backend translations
  window.getTranslation = path => {
    return `${i18n.t(path)}`;
  };

  // expose store to backend for
  // - switch tab (e.g for hotkeys, CLI)
  // - settings updates (e.g. via system tray)
  // - when the backend stops playback of every sound
  window.getStore = () => {
    return $store;
  };

  // sound updates
  window.updateSound = playingSound => {
    const sound: PlayingSound = $store.getters.currentPlayingSounds.find(
      (x: PlayingSound) => x.id === playingSound.id
    );

    if ($store.getters.isDraggingSeekbar) {
      return;
    }

    if (sound) {
      $store.commit('updateSound', { playing: sound, ms: playingSound.readInMs });
    } else {
      console.warn('Could not find sound for playingSound with id', playingSound.id);
    }
  };

  // when a sound finishes playing
  window.finishSound = playingSound => {
    $store.commit('removeFromCurrentlyPlaying', playingSound);
    const { playlistMode } = $store.getters;
    // if the playlist mode is enabled, the playback was not force stopped (e.g. via hotkey) and there are no sounds playing continue with the next sound
    if (playlistMode !== PlaylistMode.Off && $store.getters.currentPlayingSounds.length === 0) {
      const soundId = playingSound.sound.id;

      const tabs: Tab[] = $store.getters.tabs;
      const favoritesTab: Tab = $store.getters.favoritesTab;

      const tabFromSound = $store.getters.showFavorites
        ? favoritesTab
        : tabs.find(({ sounds }) => sounds.map(({ id }) => id).includes(soundId));
      if (tabFromSound) {
        const sounds = tabFromSound.sounds;
        const soundInTab = sounds.find(({ id }) => id === soundId);
        if (soundInTab) {
          const currentIndex = sounds.indexOf(soundInTab);
          // find next sound to play
          const nextSound =
            playlistMode === PlaylistMode.Shuffle
              ? sounds[Math.floor(Math.random() * sounds.length)]
              : sounds[currentIndex + 1];
          if (nextSound) {
            $store.dispatch('playSound', nextSound);
          }
        } else {
          console.warn(`Sound ${playingSound.sound.name} not found`);
        }
      } else {
        console.warn(`Tab from playing sound ${playingSound.sound.name} not found`);
      }
    }
  };

  // when a sound started playing via hotkey
  window.onSoundPlayed = playingSound => {
    if (playingSound) {
      $store.commit('addToCurrentlyPlaying', playingSound);
    }
  };

  // initial data loading

  // load settings before, because we need the sortMode for getTabs
  await $store.dispatch('getSettings');

  // the order of these doesn't matter
  await Promise.all([
    // check for linux
    $store.dispatch('getIsLinux'),
    // data has to be loaded here since SoundTabs is only mounted when there are tabs
    $store.dispatch('getTabs'),
    // fetch new version
    $store.dispatch('getUpdateData'),
    // fetch favorites
    $store.dispatch('getFavorites'),
  ]);

  // getOutputs relies on settings, we supply the outputs from the settings to restore them
  await $store.dispatch('getOutputs', $store.state.settings.outputs);
}
