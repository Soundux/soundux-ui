<template>
  <v-dialog v-model="downloaderModal" :persistent="loading" max-width="850px">
    <template #activator="{ on, attrs }">
      <v-btn
        :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>mdi-download</v-icon>
        {{ $t('downloader.title') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-download</v-icon>
        <span class="text-h5">{{ $t('downloader.title') }}</span>
      </v-card-title>
      <template v-if="isYoutubeDLAvailable">
        <v-card-text>
          <v-text-field
            v-model="inputText"
            v-if="!loading"
            :label="$t('downloader.placeholder')"
            hide-details
            filled
            autofocus
            prepend-inner-icon="mdi-link"
            :loading="fetchingInfo"
            v-debounce:300="updateInfoCard"
          ></v-text-field>

          <v-card v-if="info" outlined class="mt-3">
            <v-card-title>{{ info.title }}</v-card-title>
            <v-card-text>
              <v-row justify="center">
                <v-img
                  v-if="info.thumbnails"
                  :src="info.thumbnails[info.thumbnails.length - 1].url"
                  height="300"
                  contain
                ></v-img>
              </v-row>
              <v-row v-if="info.uploader" justify="center" class="text-h5">
                {{ info.uploader }}
              </v-row>
            </v-card-text>
          </v-card>

          <v-card v-if="loading" outlined class="mt-3">
            <v-card-title>{{ $t('downloader.progress') }}: {{ progress.toFixed(2) }}%</v-card-title>
            <v-card-text>
              <v-progress-linear
                :value="progress"
                :indeterminate="progress === 100"
                :stream="progress < 100"
                buffer-value="0"
              ></v-progress-linear>
              <div v-if="progress === 100">{{ $t('downloader.converting') }}…</div>
              <div v-else-if="eta">{{ $t('downloader.eta') }}: {{ eta }}</div>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="loading" text color="primary" :disabled="progress === 100" @click="cancel">
            <v-icon left>mdi-cancel</v-icon>
            {{ $t('downloader.cancelDownload') }}
          </v-btn>
          <v-btn v-else text color="primary" @click="downloaderModal = false">
            <v-icon left>mdi-close</v-icon>
            {{ $t('downloader.close') }}
          </v-btn>
          <v-btn color="primary" :disabled="!inputText || loading || !info" @click="submit">
            <v-icon left>mdi-download</v-icon>
            {{ $t('downloader.startDownload') }}
          </v-btn>
        </v-card-actions>
      </template>
      <template v-else>
        <v-card-text>
          <v-alert text type="error">
            <i18n path="downloader.notAvailable" tag="span">
              <code slot="youtube-dl">youtube-dl</code>
              <code slot="ffmpeg">ffmpeg</code>
            </i18n>
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="downloaderModal = false">
            {{ $t('downloader.close') }}
          </v-btn>
          <v-btn color="primary" @click="installNow">
            <v-icon left>mdi-auto-fix</v-icon>
            {{ $t('downloader.installNow') }}
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { YoutubeDlInfo } from '@/types';
import { openUrl } from '@/utils/backend';

export default Vue.extend({
  name: 'DownloaderModal',
  data() {
    return {
      isYoutubeDLAvailable: false,
      downloaderModal: false,
      inputText: '',
      fetchingInfo: false,
      loading: false,
      info: null as YoutubeDlInfo | null,
      progress: 0,
      eta: '',
    };
  },
  async mounted() {
    const isYoutubeDLAvailable = await window.isYoutubeDLAvailable();
    if (isYoutubeDLAvailable) {
      this.isYoutubeDLAvailable = isYoutubeDLAvailable;
    }
    window.downloadProgressed = (progress: number, eta: string) => {
      this.progress = progress;
      this.eta = eta;
    };
  },
  beforeDestroy() {
    window.downloadProgressed = undefined;
  },
  methods: {
    reset() {
      this.loading = false;
      this.progress = 0;
      this.eta = '';
      this.inputText = '';
      this.info = null;
    },
    async installNow() {
      await openUrl('https://github.com/Soundux/Soundux/wiki/Downloader-support');
      this.downloaderModal = false;
    },
    async updateInfoCard(input: string): Promise<void> {
      if (!input) {
        this.info = null;
        return;
      }
      this.fetchingInfo = true;
      try {
        const result = await window.getYoutubeDLInfo(input);
        if (result) {
          this.info = result;
        } else {
          this.info = null;
        }
      } catch (e) {
        console.error(e);
        this.info = null;
      }
      this.fetchingInfo = false;
    },
    async submit(): Promise<void> {
      this.loading = true;
      try {
        const success = await window.startYoutubeDLDownload(this.inputText);
        if (success) {
          await this.$store.dispatch('refreshTab');
          this.$toast.success(this.$t('downloader.success', { title: this.info?.title || '' }));
        }
      } catch (e) {
        console.error(e);
      }
      this.reset();
    },
    async cancel() {
      this.reset();
      await window.stopYoutubeDLDownload();
    },
  },
});
</script>
