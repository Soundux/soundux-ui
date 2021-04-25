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
        <v-tab v-for="(tab, index) in $store.getters.tabs" :key="index" :disabled="showFavorites">
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

    <div :class="{ 'd-none': showFavorites }">
      <v-tabs-items :value="$store.getters.activeTabIndex">
        <v-tab-item v-for="(tab, index) in $store.getters.tabs" :key="index">
          <LaunchpadView v-if="$store.getters.settings.launchPadMode" :tab="tab"></LaunchpadView>
          <GridView v-else-if="$store.getters.settings.gridView" :tab="tab"></GridView>
          <ListView v-else :tab="tab"></ListView>
        </v-tab-item>
      </v-tabs-items>
    </div>

    <div :class="[{ 'd-none': !showFavorites }, 'theme--dark', 'v-tabs-items']">
      <template v-if="favorites.sounds.length > 0">
        <LaunchpadView v-if="$store.getters.settings.launchPadMode" :tab="favorites"></LaunchpadView>
        <GridView v-else-if="$store.getters.settings.gridView" :tab="favorites"></GridView>
        <ListView v-else :tab="favorites"></ListView>
      </template>
      <template v-else>
        <v-card style="height: calc(100vh - 283px)">
          <v-card-title>{{ $t('favorites.nothingToShow') }}</v-card-title>
          <v-card-text>
            {{ $t('favorites.noFavorites') }}
            <v-img src="../assets/undraw_Loving_it_re_jfh4.svg" height="150" contain></v-img>
          </v-card-text>
        </v-card>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Tab } from '@/types';
import draggable from 'vuedraggable';
import GridView from '@/components/views/GridView.vue';
import ListView from '@/components/views/ListView.vue';
import LaunchpadView from '@/components/views/LaunchpadView.vue';
import { mapGetters } from 'vuex';

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
    LaunchpadView,
    ListView,
    GridView,
    draggable,
  },
  computed: {
    mutableTabs: {
      get(): Tab[] {
        return this.$store.getters.tabs;
      },
      set(tabs: Tab[]) {
        this.$store.commit('setTabs', tabs);
      },
    },
    mutableActiveTabIndex: {
      get(): number {
        return this.$store.getters.activeTabIndex;
      },
      set(newIndex: number) {
        this.$store.dispatch('setActiveTabIndex', newIndex);
      },
    },
    ...mapGetters({
      favorites: 'favoritesTab',
    }),
    showFavorites: {
      get(): boolean {
        return this.$store.getters.showFavorites;
      },
      set(newValue: boolean) {
        this.$store.dispatch('setShowFavorites', newValue);
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
