<template>
  <v-row dense no-gutters class="mr-5">
    <v-col cols="1" align-self="center">
      <span class="sound-name">{{ getPrettyName(output) }}</span>
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
import { getPrettyName } from '@/utils';

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
      await window.stopPassthrough(this.output.application);
      this.$store.commit('removeFromCurrentlyPlaying', this.output);
    },
    getPrettyName,
  },
});
</script>
