<template>
  <v-dialog v-model="administrativeModal" persistent max-width="600px">
    <v-card>
      <v-toolbar color="orange" dark>
        <v-icon left>mdi-shield-account-outline</v-icon>
        <span class="text-h5">{{ $t('windows.administrativePrivilegesNeeded') }}</span>
      </v-toolbar>
      <v-card-text class="pt-3">
        {{ $t('windows.administrativePrivilegesNeeded') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="setup">
          <v-icon left>mdi-restart-alert</v-icon>
          {{ $t('windows.restartAsAdmin') }}
        </v-btn>
        <v-btn text color="primary" @click="administrativeModal = false">
          <v-icon left>mdi-cancel</v-icon>
          {{ $t('actions.ignore') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'WindowsAdministrativeModal',

  computed: {
    administrativeModal: {
      get(): boolean {
        return this.$store.getters.administrativeModal;
      },
      set(value: boolean) {
        this.$store.commit('setAdministrativeModal', value);
      },
    },
  },

  methods: {
    async setup() {
      this.administrativeModal = false;
      await window.restartAsAdmin();
    },
  },
});
</script>
