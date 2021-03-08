<template>
  <v-dialog v-model="helpModal" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'" v-bind="attrs" v-on="on">
        <v-icon left>mdi-help-circle-outline</v-icon>
        {{ $t('help.title') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-help-circle-outline</v-icon>
        <span class="text-h5">{{ $t('help.title') }}</span>
      </v-card-title>
      <v-card-text>
        <ul>
          <i18n path="help.search.text" tag="li">
            <code slot="ctrl">{{ $t('help.ctrl') }}</code>
            <code slot="f">F</code>
            <b slot="search">{{ $t('help.search.search') }}</b>
          </i18n>
          <i18n v-if="$store.getters.isLinux" path="help.appPassThrough.text" tag="li">
            <code slot="ctrl">{{ $t('help.ctrl') }}</code>
            <code slot="g">G</code>
            <b slot="show">{{ $t('help.appPassThrough.show') }}</b>
          </i18n>
          <i18n path="help.reloadSounds.text" tag="li">
            <code slot="ctrl">{{ $t('help.ctrl') }}</code>
            <code slot="r">R</code>
            <b slot="reload">{{ $t('help.reloadSounds.reload') }}</b>
          </i18n>
          <i18n path="help.play.text" tag="li">
            <code slot="doubleClick">{{ $t('help.play.doubleClick') }}</code>
            <b slot="play">{{ $t('help.play.play') }}</b>
          </i18n>
        </ul>
        <br />
        <div>
          <v-icon left>mdi-web</v-icon>
          <a href="#" @click="openWebsite">{{ $t('help.visitOurWebsite') }}</a>
        </div>
        <div>
          <v-icon left>mdi-discord</v-icon>
          <a href="#" @click="openDiscord">{{ $t('help.joinOurDiscord') }}</a>
        </div>
        <div>
          <v-icon left>mdi-github</v-icon>
          <a href="#" @click="openGitHub">{{ $t('help.viewSourceCode') }}</a>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="helpModal = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { openUrl } from '@/utils/backend';

export default Vue.extend({
  name: 'HelpModal',
  data() {
    return {
      helpModal: false,
    };
  },
  methods: {
    openWebsite(): void {
      openUrl('https://soundux.rocks');
    },
    openDiscord(): void {
      openUrl('https://discord.gg/4HwSGN4Ec2');
    },
    openGitHub(): void {
      openUrl('https://github.com/Soundux');
    },
  },
});
</script>

<style scoped lang="scss">
ul {
  padding-left: 0;
  list-style-position: inside;
}
</style>
