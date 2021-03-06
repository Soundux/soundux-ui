<template>
  <v-dialog v-model="$store.getters.switchOnConnectLoaded" persistent max-width="600px">
    <v-card>
      <v-toolbar color="red lighten-1" dark>
        <v-icon left>mdi-alert-octagon-outline</v-icon>
        <span class="text-h5">{{ $t('switchOnConnect.title') }}</span>
      </v-toolbar>
      <v-card-text class="pt-3">
        <i18n path="switchOnConnect.explanation.line1" tag="span">
          <code slot="moduleName">module-switch-on-connect</code>
        </i18n>
        <br />{{ $t('switchOnConnect.explanation.line2') }}<br />
        {{ $t('switchOnConnect.explanation.line3') }}<br /><br />
        <i18n path="switchOnConnect.explanation.line4" tag="span">
          <a slot="wikiPage" target="#" @click="openWikiPage">{{
            $t('switchOnConnect.explanation.wikiPage')
          }}</a>
        </i18n>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$store.dispatch('unloadSwitchOnConnect')">
          {{ $t('switchOnConnect.disable') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { openUrl } from '@/utils/backend';

export default Vue.extend({
  name: 'SwitchOnConnectModal',
  mounted() {
    this.$store.dispatch('isSwitchOnConnectLoaded');
  },
  methods: {
    openWikiPage() {
      openUrl('https://github.com/Soundux/Soundux/wiki/Problems-with-switch-on-connect-module');
    },
  },
});
</script>

<style scoped></style>
