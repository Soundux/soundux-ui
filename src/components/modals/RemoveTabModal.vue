<template>
  <v-dialog v-model="modal" max-width="600px">
    <v-card v-if="tab">
      <v-card-title>{{ $t('removeTab.confirmation') }}</v-card-title>
      <v-card-text>
        <i18n path="removeTab.question">
          <code slot="tabName">{{ tab.name }}</code>
        </i18n>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="$store.dispatch('removeTab', tab)">
          <v-icon left>mdi-delete-alert</v-icon>
          {{ $t('actions.yes') }}
        </v-btn>
        <v-btn color="primary" @click="modal = false">
          <v-icon left>mdi-delete-off</v-icon>
          {{ $t('actions.no') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Tab } from '@/types';

export default Vue.extend({
  name: 'RemoveTabModal',
  computed: {
    tab: {
      get(): Tab | null {
        return this.$store.getters.tabToRemove;
      },
      set(tab: Tab | null) {
        this.$store.commit('setTabToRemove', tab);
      },
    },
    modal: {
      get(): boolean {
        return this.$store.getters.removeTabModal;
      },
      set(state: boolean) {
        this.$store.commit('setRemoveTabModal', state);
      },
    },
  },
});
</script>
