<template>
  <div id="grid-view" class="overflow-y-auto" style="height: calc(100vh - 283px)">
    <v-row no-gutters>
      <v-col v-for="(sound, sIndex) in tab.sounds" :key="sIndex" class="ma-2">
        <SoundContextMenu :sound="sound">
          <template #default="{ context }">
            <v-btn
              :id="`sound-${sound.id}`"
              class="pa-2 text-none"
              block
              height="50"
              @click="$store.dispatch('playSound', sound)"
              @contextmenu="context"
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

<style lang="scss" scoped>
@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.highlight::after {
  content: '\a0';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  border-top: 5px solid var(--v-primary-base);
  box-shadow: none !important;
  border-radius: 4px;
  opacity: 0;
  animation: blink 500ms linear;
  animation-iteration-count: 3;
}
</style>
