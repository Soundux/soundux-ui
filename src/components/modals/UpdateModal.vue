<template>
  <v-dialog v-if="$store.getters.updateData" v-model="updateModal" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-update</v-icon>
        <span class="text-h5">{{ $t('update.title') }}</span>
      </v-card-title>
      <v-card-text>
        <div>
          <v-icon left>mdi-calendar-blank</v-icon>
          {{ $t('update.yourVersion') }}: {{ $store.getters.updateData.current }}
        </div>
        <div>
          <v-icon left>mdi-calendar-plus</v-icon>
          {{ $t('update.latestVersion') }}: {{ $store.getters.updateData.latest }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="updateModal = false">{{ $t('update.ignore') }}</v-btn>
        <v-btn color="primary" @click="openDownloadPage">
          <v-icon left>mdi-cellphone-arrow-down</v-icon>
          {{ $t('update.updateNow') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { openUrl } from '@/utils/backend';

export default Vue.extend({
  name: 'UpdateModal',
  data() {
    return {
      updateModal: false,
      unsubscribe: null as (() => void) | null,
    };
  },
  mounted() {
    this.unsubscribe = this.$store.subscribe(mutation => {
      if (mutation.type === 'setUpdateData') {
        this.updateModal = this.$store.getters.updateData.outdated;
      }
    });
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    openDownloadPage(): void {
      openUrl('https://soundux.rocks/download');
    },
  },
});
</script>
