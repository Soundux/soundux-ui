import Vue from 'vue';
import i18n from '../i18n';

export enum BackendFunction {
  IS_LINUX = 'isLinux',
  OPEN_URL = 'openUrl',
  MOVE_TABS = 'moveTabs',
  GET_SETTINGS = 'getSettings',
  GET_OUTPUTS = 'getOutputs',
  CHANGE_SETTINGS = 'changeSettings',
  SET_HOTKEY = 'setHotkey',
  IS_SWITCH_ON_CONNECT_LOADED = 'isSwitchOnConnectLoaded',
  UNLOAD_SWITCH_ON_CONNECT = 'unloadSwitchOnConnect',
  STOP_SOUNDS = 'stopSounds',
  START_PASS_THROUGH = 'startPassthrough',
  STOP_PASS_THROUGH = 'stopPassthrough',
  PLAY_SOUND = 'playSound',
  PAUSE_SOUND = 'pauseSound',
  RESUME_SOUND = 'resumeSound',
  SEEK_SOUND = 'seekSound',
  REPEAT_SOUND = 'repeatSound',
  STOP_SOUND = 'stopSound',
  REFRESH_TAB = 'refreshTab',
  REMOVE_TAB = 'removeTab',
  ADD_TAB = 'addTab',
  GET_PLAYBACK_APPS = 'getPlayback',
  GET_HOTKEY_SEQUENCE = 'getHotkeySequence',
  REQUEST_HOTKEY = 'requestHotkey',
  GET_TABS = 'getTabs',
}

export async function callBackend<Type = null>(
  functionName: BackendFunction,
  ...args: unknown[]
): Promise<Type | null> {
  // @ts-ignore
  if (!window[functionName]) {
    Vue.$toast.error(
      i18n.t('errors.error') + ': ' + i18n.t('errors.backendFunctionMissing', { functionName })
    );
    return null;
  }
  // @ts-ignore
  return (await window[functionName](...args)) as Type | null; // TODO: we can just assume it returns Type | null here
}

export async function openUrl(url: string): Promise<void> {
  await callBackend(BackendFunction.OPEN_URL, url);
}

export function registerCallbacks(): void {
  // TODO: move all callback functions and initial function calls here
}
