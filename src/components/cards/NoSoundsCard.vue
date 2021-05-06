<template>
  <v-card v-if="$store.getters.currentTab" style="height: calc(100vh - 283px)">
    <v-card-title>{{ $t('empty.nothingToShow') }}</v-card-title>
    <v-card-text>
      <i18n path="empty.noSounds">
        <code slot="path">{{ $store.getters.currentTab.path }}</code>
      </i18n>
      <v-img src="@/assets/undraw_compose_music_ovo2.svg" height="150" contain></v-img>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NoSoundsCard',
});
</script>
