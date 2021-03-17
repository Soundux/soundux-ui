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
    <template #selection="{ item }">
      <v-row dense no-gutters class="text-truncate">
        <v-col v-if="item.appIcon" cols="auto">
          <img
            :src="`data:image/png;base64,${item.appIcon}`"
            :alt="`${item.application} icon`"
            width="32"
          />
        </v-col>
        <v-col align-self="center" class="text-truncate">
          {{ item.name }}
        </v-col>
      </v-row>
    </template>
    <template #item="{ item }">
      <v-row dense no-gutters class="text-truncate">
        <v-col v-if="item.appIcon" cols="auto">
          <img
            :src="`data:image/png;base64,${item.appIcon}`"
            :alt="`${item.application} icon`"
            width="32"
          />
        </v-col>
        <v-col align-self="center" class="text-truncate">
          {{ getPrettyName(item) }}
        </v-col>
      </v-row>
    </template>
  </v-select>
</template>

<script lang="ts">
import Vue from 'vue';
import { Output } from '@/types';
import { getPrettyName } from '@/utils';

export default Vue.extend({
  name: 'OutputSelection',
  mounted() {
    // getOutputs has to be called after setSettings. otherwise the settings promise might resolve slower and overwrites the output value
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
  methods: {
    getPrettyName,
  },
});
</script>
