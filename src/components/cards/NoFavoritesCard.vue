<template>
  <v-card class="no-favorites">
    <v-card-title>{{ $t('empty.nothingToShow') }}</v-card-title>
    <v-card-text>
      {{ $t('empty.noFavorites') }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NoFavoritesCard',
});
</script>

<style scoped lang="scss">
.no-favorites {
  height: calc(100vh - 283px);
  background-image: url('~@/assets/undraw_Loving_it_re_jfh4.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 25%;
}
</style>
