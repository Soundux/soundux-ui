<template>
  <v-row dense no-gutters class="mr-5">
    <v-col cols="1" align-self="center">
      <span class="sound-name">
        {{ output.name }}
      </span>
    </v-col>
    <v-col cols="auto">
      <v-btn icon :disabled="true"><v-icon>mdi-pause</v-icon></v-btn>
    </v-col>
    <v-col align-self="center">
      <v-slider :disabled="true" hide-details></v-slider>
    </v-col>
    <v-col cols="auto">
      <v-btn icon @click="stop"><v-icon>mdi-stop</v-icon></v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Output } from '@/types';

export default Vue.extend({
  name: 'PassthroughControl',
  props: {
    output: {
      type: Object as PropType<Output>,
      required: true,
    },
  },
  methods: {
    async stop(): Promise<void> {
      // @ts-ignore
      if (!window.stopPassthrough) {
        return;
      }
      // @ts-ignore
      await window.stopPassthrough(); // eslint-disable-line no-undef
      this.$store.commit('removeFromCurrentlyPlaying', this.output);
    },
  },
});
</script>
