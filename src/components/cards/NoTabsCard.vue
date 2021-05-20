<template>
  <v-card style="height: calc(100vh - 235px)">
    <v-card-title>{{ $t('welcome.title', { programName: 'Soundux' }) }}</v-card-title>
    <v-card-text>
      <i18n path="welcome.noTabs">
        <b slot="addTab">{{ $t('actions.addTab') }}</b>
      </i18n>
      <br />
      <br />
      <template v-if="$store.getters.isLinux">
        {{ $t('welcome.linuxDetected') }}
        <br />
        {{ $t('welcome.linuxGuide1') }}
        <br />
        {{ $t('welcome.linuxGuide2') }}
      </template>
      <template v-else>
        {{ $t('welcome.windowsDetected') }}
        <br />
        <i18n path="welcome.windowsGuide1">
          <a slot="seenOnWebsite" @click="openWindowsSetupPage">
            {{ $t('welcome.windowsGuide2') }}
          </a>
        </i18n>
      </template>

      <v-img src="@/assets/undraw_empty_xct9.svg" height="150" contain></v-img>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { openUrl } from '@/utils/backend';

export default Vue.extend({
  name: 'NoTabsCard',
  methods: {
    openWindowsSetupPage(): void {
      openUrl('https://soundux.rocks/windows-setup');
    },
  },
});
</script>
