<template>
  <v-footer v-if="currentPlaying.length > 0" app rounded max-height="50">
    <v-btn v-if="currentPlaying.length > 1" icon class="mr-5" @click="sheet = true">
      <v-badge overlap color="primary" :content="currentPlaying.length" :value="currentPlaying.length">
        <v-icon>mdi-chevron-up</v-icon>
      </v-badge>
    </v-btn>
    <PlayingControl :playing="currentPlaying[currentPlaying.length - 1]"></PlayingControl>
    <v-bottom-sheet v-model="sheet">
      <v-list nav dense>
        <v-list-item-group>
          <v-virtual-scroll :items="currentPlaying" item-height="40" bench="25" max-height="350">
            <template #default="{ item }" class="mt-3">
              <PlayingControl :playing="item"></PlayingControl>
            </template>
          </v-virtual-scroll>
        </v-list-item-group>
      </v-list>
    </v-bottom-sheet>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { PlayingSound } from '@/types';
import PlayingControl from '@/components/PlayingControl.vue';

export default Vue.extend({
  name: 'PlayingSoundsDrawer',
  components: { PlayingControl },
  data() {
    return {
      sheet: false,
    };
  },
  computed: {
    currentPlaying(): PlayingSound[] {
      return this.$store.getters.currentPlaying;
    },
  },
  watch: {
    currentPlaying() {
      // the sheet needs to be disabled when the there are less than 2 sounds playing
      if (this.currentPlaying.length < 2) {
        this.sheet = false;
      }
    },
  },
});
</script>
