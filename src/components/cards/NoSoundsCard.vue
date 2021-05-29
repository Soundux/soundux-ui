<template>
  <v-card v-if="$store.getters.currentTab" class="no-sounds">
    <v-card-title>{{ $t('empty.nothingToShow') }}</v-card-title>
    <v-card-text>
      <i18n path="empty.noSounds">
        <code slot="path">{{ $store.getters.currentTab.path }}</code>
      </i18n>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NoSoundsCard',
});
</script>

<style scoped lang="scss">
.no-sounds {
  height: calc(100vh - 283px);
  background-image: url('~@/assets/undraw_compose_music_ovo2.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 25%;
}
</style>
