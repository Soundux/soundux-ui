<template>
  <div>
    <v-tabs v-model="mutableActiveTabIndex" show-arrows>
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
import { Tab } from '@/types';
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
    document.addEventListener('keydown', this.keyDownHandler);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownHandler);
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
    keyDownHandler(event: KeyboardEvent): void {
      if (
        this.$store.getters.settings.launchPadMode &&
        !this.$store.getters.appPassThroughDrawer &&
        !this.$store.getters.searchModal
      ) {
        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
          const keyboard = `1234567890QWERTYUIOPASDFGHJKL;ZXCVBNM,./`;
          const keys = [];
          for (const key of keyboard) {
            if (!isNaN(parseInt(key))) {
              keys.push(`Digit${key}`);
            } else if (key === ';') {
              keys.push('Semicolon');
            } else if (key === ',') {
              keys.push('Comma');
            } else if (key === '.') {
              keys.push('Period');
            } else if (key === '/') {
              keys.push('Slash');
            } else {
              keys.push(`Key${key}`);
            }
          }

          keys.forEach((keyCode, index) => {
            if (event.code === keyCode) {
              // console.log('play sound', keyCode, index);
              const sound = this.$store.getters.tabs[this.$store.getters.activeTabIndex].sounds[index];
              if (sound) {
                this.$store.dispatch('playSound', sound);
              }
            }
          });
        }
      }

      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.code === 'KeyR') {
        event.preventDefault();
        this.$store.dispatch('refreshTab');
      }
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
