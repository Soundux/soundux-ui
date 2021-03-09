<template>
  <v-select
    v-model="selectedOutput"
    return-object
    :disabled="
      $store.getters.settings.useAsDefaultDevice ||
      (!$store.getters.isLinux && $store.getters.currentPlaying.length > 0)
    "
    item-text="name"
    :items="this.$store.getters.outputs"
    :label="$t(`${$store.getters.isLinux ? 'outputApp' : 'outputDevice'}`)"
    hide-details
    clearable
    outlined
    dense
  >
    <!--<template #selection="{ item }">
      <v-icon>{{ item.icon }}</v-icon> {{ item.name }}
    </template>-->
    <!--<template #item="{ item }">
      <v-icon>{{ item.icon }}</v-icon> {{ item.name }}
    </template>-->
  </v-select>
</template>

<script lang="ts">
import Vue from 'vue';
import { Output } from '@/types';

export default Vue.extend({
  name: 'OutputSelection',
  mounted() {
    // getOutputs has be called after setSettings. otherwise the settings promise might resolve slower and overwrites the output value
    // TODO: there might be a better way of enforcing that
    const unsubscribe = this.$store.subscribe(mutation => {
      if (mutation.type === 'setSettings') {
        this.$store.dispatch('getOutputs');
        unsubscribe();
      }
    });
  },
  computed: {
    selectedOutput: {
      get() {
        return this.$store.getters.selectedOutput;
      },
      set(output: Output) {
        this.$store.dispatch('setSelectedOutput', output);
      },
    },
  },
});
</script>
