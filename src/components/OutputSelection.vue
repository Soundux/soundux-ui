<template>
  <v-select
    v-model="selectedOutputs"
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
    :multiple="$store.getters.settings.allowMultipleOutputs"
    outlined
    dense
  >
    <template #selection="{ item }">
      <v-row dense no-gutters align="center" class="text-truncate">
        <template v-if="$store.getters.settings.allowMultipleOutputs && selectedOutputs.length > 1">
          <v-chip outlined pill small>
            <v-img
              v-if="item.appIcon"
              :src="`data:image/png;base64,${item.appIcon}`"
              :alt="`${item.name} icon`"
              width="15"
              class="mr-1"
            />
            <span class="text-truncate">
              {{ item.application }}
            </span>
          </v-chip>
        </template>
        <template v-else>
          <v-col v-if="item.appIcon" cols="auto">
            <v-img
              :src="`data:image/png;base64,${item.appIcon}`"
              :alt="`${item.name} icon`"
              width="25"
              class="mr-1"
            />
          </v-col>
          <v-col class="text-truncate">
            {{ item.application }}
          </v-col>
        </template>
      </v-row>
    </template>
    <template #item="{ item, on, attrs }">
      <v-row dense no-gutters align="center" class="text-truncate">
        <v-col v-if="$store.getters.settings.allowMultipleOutputs" cols="auto">
          <v-simple-checkbox
            :value="selectedOutputs.includes(item)"
            v-on="on"
            v-bind="attrs"
          ></v-simple-checkbox>
        </v-col>
        <v-col v-if="item.appIcon" cols="auto">
          <v-img
            :src="`data:image/png;base64,${item.appIcon}`"
            :alt="`${item.name} icon`"
            width="25"
            class="mr-1"
          />
        </v-col>
        <v-col class="text-truncate">
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
  computed: {
    // this is dependent whether multiple outputs are allowed or not because v-select expects different things,
    // however, in the store selectedOutputs is always an array
    // allowMultipleOutputs -> Output[]
    // !allowMultipleOutputs -> Output | null
    selectedOutputs: {
      get(): (Output | null) | Output[] {
        const { selectedOutputs } = this.$store.getters;
        if (this.$store.getters.settings.allowMultipleOutputs) {
          return selectedOutputs;
        }
        return selectedOutputs.length === 0 ? null : selectedOutputs[0];
      },
      set(outputs: (Output | null) | Output[]) {
        if (Array.isArray(outputs)) {
          this.$store.dispatch('setSelectedOutputs', outputs);
        } else {
          this.$store.dispatch('setSelectedOutputs', outputs ? [outputs] : []);
        }
      },
    },
  },
  methods: {
    getPrettyName,
  },
});
</script>
