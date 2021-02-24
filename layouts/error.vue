<template>
  <v-app dark>
    <v-main>
      <v-container>
        <v-card>
          <v-card-title v-if="error.statusCode === 404">
            {{ pageNotFound }}
          </v-card-title>
          <v-card-title v-else>
            {{ otherError }}
          </v-card-title>
          <v-card-actions>
            <NuxtLink to="/">Home page</NuxtLink>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { NuxtError } from '@nuxt/types';

export default Vue.extend({
  layout: 'empty',
  props: {
    error: {
      type: Object as PropType<NuxtError>,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    };
  },
  head(): object {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
});
</script>

<style scoped></style>
