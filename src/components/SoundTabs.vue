<template>
  <div>
    <v-tabs v-model="mutableActiveTabIndex">
      <draggable
        v-model="mutableTabs"
        class="v-slide-group__wrapper"
        v-bind="{
          animation: 200,
          ghostClass: 'ghost',
        }"
        @start="startDrag"
        @end="stopDrag"
      >
        <v-tab v-for="(tab, index) in $store.getters.tabs" :key="index">
          {{ tab.name }}
          <v-icon
            right
            small
            color="grey"
            style="cursor: pointer"
            @click.stop="$store.dispatch('deleteTab', tab)"
          >
            mdi-close-circle
          </v-icon>
        </v-tab>
      </draggable>
    </v-tabs>

    <v-tabs-items :value="$store.getters.activeTabIndex">
      <v-tab-item v-for="(tab, index) in $store.getters.tabs" :key="index">
        <GridView v-if="$store.getters.settings.gridView" :tab="tab"></GridView>
        <ListView v-else :tab="tab"></ListView>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PlayingSound, Tab } from '@/types';
import draggable from 'vuedraggable';
import GridView from '@/components/views/GridView.vue';
import ListView from '@/components/views/ListView.vue';

export default Vue.extend({
  name: 'SoundTabs',
  data() {
    return {
      beforeDragActive: null as Tab | null,
    };
  },
  mounted() {
    // @ts-ignore
    window.updateSound = (playingSound: PlayingSound) => {
      const sound = this.$store.getters.currentPlayingSounds.find(
        (x: PlayingSound) => x.id === playingSound.id
      );
      if (sound) {
        this.$store.commit('updateSound', { playing: sound, ms: playingSound.readInMs });
      } else {
        console.warn('Could not find sound for playingSound with id', playingSound.id);
      }
    };
    // @ts-ignore
    window.finishSound = (playingSound: PlayingSound) => {
      this.$store.commit('removeFromCurrentlyPlaying', playingSound);
    };
    // @ts-ignore
    window.onSoundPlayed = (playingSound: PlayingSound) => {
      if (playingSound) {
        this.$store.commit('addToCurrentlyPlaying', playingSound);
      }
    };
  },
  components: {
    ListView,
    GridView,
    draggable,
  },
  computed: {
    mutableTabs: {
      get() {
        return this.$store.getters.tabs;
      },
      set(tabs: Tab[]) {
        this.$store.commit('setTabs', tabs);
      },
    },
    mutableActiveTabIndex: {
      get() {
        return this.$store.getters.activeTabIndex;
      },
      set(newIndex: number) {
        this.$store.dispatch('setActiveTabIndex', newIndex);
      },
    },
  },
  methods: {
    startDrag(): void {
      // save for stopDrag
      this.beforeDragActive = this.$store.getters.tabs[this.$store.getters.activeTabIndex];
    },
    stopDrag(): void {
      // after dragging, the active tab index must be updated, as only the order in the tabs array is changed
      if (this.beforeDragActive) {
        this.$store.dispatch(
          'setActiveTabIndex',
          this.$store.getters.tabs.indexOf(this.beforeDragActive)
        );
      }
      this.$store.dispatch('moveTabs');
    },
  },
});
</script>

<style lang="scss">
// ghost class for vue draggable
.ghost {
  opacity: 0;
}

// we want our tabs to use the default cursor
.v-tab {
  cursor: default !important;
}
</style>
