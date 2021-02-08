<template>
  <v-container>
    <v-row>
      <v-col>
        <v-avatar color="primary" rounded size="64">
          <img src="icon.png" alt="Logo" />
        </v-avatar>
        <span class="headline">Soundux</span>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="selectedApp"
          :loading="appsLoading"
          :disabled="appsLoading"
          item-text="name"
          :items="availableApps"
          label="Output application"
          outlined
          messages="The application to play the sound to"
          dense
        >
          <template #selection="{ item }">
            <v-icon>{{ item.icon }}</v-icon> {{ item.name }}
          </template>
          <template #item="{ item }">
            <v-icon>{{ item.icon }}</v-icon> {{ item.name }}
          </template>
        </v-select>
        <v-btn color="primary" block @click="refreshApps">
          <v-icon left dark>mdi-reload</v-icon>
          Refresh
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense no-gutters>
      <v-col cols="1">
        <v-btn color="primary" x-large>
          <v-icon left dark>mdi-stop</v-icon>
          Stop
        </v-btn>
      </v-col>
      <v-col>
        <v-slider
          v-model="localVolume"
          messages="Local volume"
          :thumb-label="true"
          prepend-icon="mdi-volume-high"
        ></v-slider>
        <v-slider
          v-model="remoteVolume"
          messages="Remote volume"
          :thumb-label="true"
          prepend-icon="mdi-volume-high"
        ></v-slider>
      </v-col>
      <v-col cols="1" align-self="center">
        <v-checkbox v-model="syncVolume" :label="`Sync`"></v-checkbox>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <v-row>
      <v-col>
        <v-tabs v-model="activeTab">
          <v-tab v-for="(item, index) in tabs" :key="index">
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
          <v-tab-item v-for="(item, index) in tabs" :key="index">
            <v-list>
              <v-list-item-group
                v-model="selectedItem"
                mandatory
                color="primary"
              >
                <v-list-item v-for="i in 30" :key="i">
                  <v-list-item-content>
                    <v-list-item-title>
                      Tab {{ index }} item {{ i }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col cols="2">
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-magnify</v-icon>
          Search
        </v-btn>
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-folder-plus</v-icon>
          Add tab
        </v-btn>
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-tab-minus</v-icon>
          Remove tab
        </v-btn>
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-refresh</v-icon>
          Refresh
        </v-btn>
        <v-spacer></v-spacer>
        <SetHotkeyModal></SetHotkeyModal>
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-play</v-icon>
          Play
        </v-btn>
        <SettingsModal></SettingsModal>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SettingsModal from '~/components/SettingsModal';
import SetHotkeyModal from '~/components/SetHotkeyModal';
export default {
  components: { SetHotkeyModal, SettingsModal },
  data() {
    return {
      appsLoading: false,
      availableApps: [
        { name: 'Discord', icon: 'mdi-discord' },
        { name: 'Teams', icon: 'mdi-microsoft-teams' },
      ],
      selectedApp: null,
      syncVolume: true,
      activeTab: null,
      selectedItem: null,
      localVolume: 50,
      remoteVolume: 75,
      volume: 50,
      tabs: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5'],
    };
  },
  /* watch: {
    localVolume(val: number) {
      if (this.syncVolume) {
        this.remoteVolume = val;
      }
    },
    remoteVolume(val: number) {
      if (this.syncVolume) {
        this.localVolume = val;
      }
    },
  }, */
  methods: {
    refreshApps() {
      this.appsLoading = true;
      window.setTimeout(() => {
        this.appsLoading = false;
      }, 1000);
    },
  },
};
</script>

<style lang="scss">
* {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
</style>
