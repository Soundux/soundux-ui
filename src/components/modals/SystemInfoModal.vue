<template>
  <v-dialog v-model="systemInfoModal" max-width="600px">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-desktop-mac-dashboard</v-icon>
        <span class="text-h5">{{ $t('systemInfo.title') }}</span>
      </v-card-title>
      <v-card-text>
        <v-alert dense type="info">
          {{ $t('systemInfo.description') }}
        </v-alert>
        <v-textarea id="systemInfoArea" :value="systemInfo" readonly dense filled></v-textarea>
        <v-row justify="center">
          <v-btn large color="primary" @click="copyToClipboard">
            <v-icon left>mdi-clipboard</v-icon>
            {{ $t('systemInfo.copyToClipboard') }}
          </v-btn>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="systemInfoModal = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SystemInfoModal',
  data() {
    return {
      systemInfo: '',
    };
  },
  computed: {
    systemInfoModal: {
      get(): boolean {
        return this.$store.getters.systemInfoModal;
      },
      set(newState: boolean) {
        this.$store.commit('setSystemInfoModal', newState);
      },
    },
  },
  async mounted() {
    this.systemInfo = (await window.getSystemInfo()) || 'Failed to fetch system information';
  },
  methods: {
    copyToClipboard() {
      const systemInfoArea = document.getElementById('systemInfoArea') as HTMLInputElement;
      if (systemInfoArea) {
        systemInfoArea.select();
        document.execCommand('copy');
      }
    },
  },
});
</script>
