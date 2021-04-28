<template>
  <v-card style="height: calc(100vh - 283px)">
    <v-card-title>{{ $t('empty.nothingToShow') }}</v-card-title>
    <v-card-text>
      {{ $t('empty.noFavorites') }}
      <v-img src="../assets/undraw_Loving_it_re_jfh4.svg" height="150" contain></v-img>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NoFavoritesCard',
});
</script>
