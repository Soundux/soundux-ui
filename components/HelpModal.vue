<template>
  <v-dialog v-model="helpModal" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
        block
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>mdi-help-circle-outline</v-icon>
        Help
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-help-circle-outline</v-icon>
        <span class="text-h5">Help</span>
      </v-card-title>
      <v-card-text>
        <ul>
          <li><code>CTRL</code> + <code>F</code> to <b>search</b></li>
          <li><code>Double-click</code> to <b>play</b></li>
        </ul>
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

export default Vue.extend({
  name: 'HelpModal',
  data() {
    return {
      helpModal: false,
    };
  },
});
</script>
