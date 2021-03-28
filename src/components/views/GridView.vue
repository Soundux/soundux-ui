<template>
  <div id="grid-view" class="overflow-y-auto" style="height: calc(100vh - 283px)">
    <v-row no-gutters>
      <v-col v-for="(sound, sIndex) in tab.sounds" :key="sIndex" class="ma-2">
        <SoundContextMenu :sound="sound">
          <template #default="slotProps">
            <v-btn
              :id="`sound-${sound.id}`"
              class="pa-2 text-none"
              block
              height="50"
              @click="$store.dispatch('playSound', sound)"
              @contextmenu="slotProps.context"
            >
              {{ sound.name }}
            </v-btn>
          </template>
        </SoundContextMenu>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Tab } from '@/types';
import SoundContextMenu from '@/components/SoundContextMenu.vue';

export default Vue.extend({
  name: 'GridView',
  components: { SoundContextMenu },
  props: {
    tab: {
      type: Object as PropType<Tab>,
      required: true,
    },
  },
});
</script>
