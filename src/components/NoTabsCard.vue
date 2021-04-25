<template>
  <v-card style="height: calc(100vh - 283px)">
    <v-card-title>{{ $t('welcome.title', { programName: 'Soundux' }) }}</v-card-title>
    <v-card-text>
      <i18n path="welcome.noTabs">
        <b slot="addTab">{{ $t('actions.addTab') }}</b>
      </i18n>

      <v-img src="../assets/undraw_empty_xct9.svg" height="150" contain></v-img>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'NoTabsCard',
});
</script>
