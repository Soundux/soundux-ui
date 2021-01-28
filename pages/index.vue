<template>
  <div>
    <v-avatar color="primary" rounded size="64">
      <img src="icon.png" alt="Logo" />
    </v-avatar>
    <v-card-title class="headline">Soundux</v-card-title>
    <v-btn color="primary" x-large>
      <v-icon left dark>mdi-stop</v-icon>
      Stop
    </v-btn>
    <v-subheader>Local volume</v-subheader>
    <v-card-text>
      <v-slider
        v-model="localVolume"
        :thumb-label="true"
        prepend-icon="mdi-volume-high"
      ></v-slider>
    </v-card-text>
    <v-subheader>Remote volume</v-subheader>
    <v-card-text>
      <v-slider
        v-model="remoteVolume"
        :thumb-label="true"
        prepend-icon="mdi-volume-high"
      ></v-slider>
    </v-card-text>
    <v-checkbox v-model="syncVolume" :label="`Sync`"></v-checkbox>

    <v-combobox
      v-model="selectedApp"
      :items="availableApps"
      label="Output application"
      outlined
      dense
    ></v-combobox>
    <v-btn color="primary">
      <v-icon left dark>mdi-reload</v-icon>
      Refresh
    </v-btn>

    <v-row>
      <v-col cols="1" class="py-2 ma-5">
        <v-btn color="primary">
          <v-icon left dark>mdi-magnify</v-icon>
          Search
        </v-btn>
        <v-btn color="primary">
          <v-icon left dark>mdi-folder-plus</v-icon>
          Add tab
        </v-btn>
        <v-btn color="primary">
          <v-icon left dark>mdi-tab-minus</v-icon>
          Remove tab
        </v-btn>
        <v-btn color="primary">
          <v-icon left dark>mdi-refresh</v-icon>
          Refresh
        </v-btn>
        <v-btn color="primary">
          <v-icon left dark>mdi-keyboard</v-icon>
          Set hotkey
        </v-btn>
        <v-btn color="primary">
          <v-icon left dark>mdi-play</v-icon>
          Play
        </v-btn>
        <v-btn color="primary">
          <v-icon left dark>mdi-cog</v-icon>
          Settings
        </v-btn>
      </v-col>
    </v-row>

    <v-tabs v-model="activeTab">
      <v-tab v-for="(item, index) in tabs" :key="index">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item v-for="(item, index) in tabs" :key="index">
        <v-list>
          <v-list-item-group v-model="selectedItem" mandatory color="primary">
            <v-list-item v-for="i in 5" :key="i">
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

    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" nuxt to="/inspire"> Continue</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      availableApps: ['Discord', 'TeamSpeak'],
      selectedApp: 'Discord',
      syncVolume: true,
      activeTab: null,
      selectedItem: null,
      localVolume: 50,
      remoteVolume: 75,
      tabs: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5'],
    };
  },
};
</script>
