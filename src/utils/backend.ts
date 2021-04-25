import $store from '@/store';
import i18n from '@/plugins/i18n';
import Vue from 'vue';
import { PlayingSound } from '@/types';

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
  window.getTranslation = (path: string) => {
    return `${i18n.t(path)}`;
  };

  // sound updates
  window.updateSound = (playingSound: PlayingSound) => {
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
  window.finishSound = (playingSound: PlayingSound) => {
    $store.commit('removeFromCurrentlyPlaying', playingSound);
  };
  window.onSoundPlayed = (playingSound: PlayingSound) => {
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
  // getOutputs has to be called after setSettings. otherwise the settings promise might resolve slower and overwrites the output value
  await $store.dispatch('getOutputs');
}
