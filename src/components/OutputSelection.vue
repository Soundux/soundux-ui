<template>
  <v-select
    v-model="selectedOutput"
    return-object
    :disabled="$store.getters.currentPlaying.length > 0"
    item-text="name"
    :items="this.$store.getters.outputs"
    :label="$t(`${$store.getters.isLinux ? 'outputApp' : 'outputDevice'}.title`)"
    outlined
    :messages="$t(`${$store.getters.isLinux ? 'outputApp' : 'outputDevice'}.info`)"
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
    this.$store.dispatch('getOutputs');
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
