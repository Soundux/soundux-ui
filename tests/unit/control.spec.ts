import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import PassthroughControl from '@/components/PassthroughControl.vue';
import SoundControl from '@/components/SoundControl.vue';
import Vuetify from 'vuetify';
import { Output, PlayingSound, Sound } from '@/types';

jest.mock('dayjs', () => ({
  duration(a: number) {
    return {
      hours() {
        return a;
      },
      format() {
        return `${a}`;
      },
    };
  },
}));

jest.mock('@/plugins/i18n', () => ({
  t(key: string) {
    return key;
  },
}));

describe('PassthroughControl.vue', () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('renders name when passed', () => {
    const output: Output = {
      name: 'DiscordCanary',
      application: 'WEBRTC VoiceEngine',
    };

    const wrapper = mount(PassthroughControl, {
      localVue,
      vuetify,
      propsData: { output },
    });
    expect(wrapper.text()).toContain(output.name);
    // console.log(wrapper.html());
    const buttons = wrapper.findAll('v-btn'); // TODO: should be .v-btn when vuetify resolve works
    expect(buttons.length).toBeGreaterThan(0);
    // TODO: expect only stop button to be enabled. Try to click: should destroy it. We have to mock VueX for this
  });
});

describe('SoundControl.vue', () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('renders sound name when passed', () => {
    const sound: Sound = {
      id: 1,
      name: 'Sound',
      path: '/sound.mp3',
      hotkeys: [],
      modifiedDate: 0,
      hotkeySequence: '',
      isFavorite: false,
    };
    const playingSound: PlayingSound = {
      id: 1,
      repeat: false,
      lengthInMs: 100,
      readInMs: 50,
      paused: false,
      sound,
    };
    const wrapper = shallowMount(SoundControl, {
      localVue,
      vuetify,
      propsData: { playingSound },
    });
    expect(wrapper.text()).toContain(sound.name);
  });
});
