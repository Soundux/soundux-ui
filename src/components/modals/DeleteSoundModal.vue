<template>
  <v-dialog v-model="modal" max-width="600px">
    <v-card v-if="sound">
      <v-card-title>{{ $t('actions.confirmation') }}</v-card-title>
      <v-card-text>
        <i18n path="deleteSound.question">
          <code slot="soundName">{{ sound.name }}</code>
        </i18n>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" dark @click="$store.dispatch('deleteSound', sound)">
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
import { Sound } from '@/types';

export default Vue.extend({
  name: 'DeleteSoundModal',
  computed: {
    sound: {
      get(): Sound | null {
        return this.$store.getters.soundToDelete;
      },
      set(sound: Sound | null) {
        this.$store.commit('setSoundToDelete', sound);
      },
    },
    modal: {
      get(): boolean {
        return this.$store.getters.deleteSoundModal;
      },
      set(state: boolean) {
        this.$store.commit('setDeleteSoundModal', state);
      },
    },
  },
});
</script>
