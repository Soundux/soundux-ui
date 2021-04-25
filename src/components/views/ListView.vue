<template>
  <v-list id="list-view" class="overflow-y-auto" style="height: calc(100vh - 283px)">
    <v-list-item-group active-class="no-active">
      <div v-for="sound in tab.sounds" :key="sound.id">
        <SoundContextMenu :sound="sound">
          <template #default="{ context }">
            <v-list-item
              :id="`sound-${sound.id}`"
              @click="$store.dispatch('playSound', sound)"
              @contextmenu="context"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ sound.name }}
                </v-list-item-title>
                <v-list-item-action-text>
                  {{ sound.hotkeySequence }}
                </v-list-item-action-text>
              </v-list-item-content>
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click.stop="$store.dispatch('toggleFavorite', sound)"
                  >
                    <v-icon :color="sound.isFavorite ? 'red' : ''">mdi-heart</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('favorites.favorite') }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click.stop="$store.commit('setSetHotkeySound', sound)"
                  >
                    <v-icon>mdi-keyboard</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('hotkeys.title') }}</span>
              </v-tooltip>
            </v-list-item>
          </template>
        </SoundContextMenu>
      </div>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Tab } from '@/types';
import SoundContextMenu from '@/components/SoundContextMenu.vue';

export default Vue.extend({
  name: 'ListView',
  components: { SoundContextMenu },
  props: {
    tab: {
      type: Object as PropType<Tab>,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.v-list-item--active.no-active:not(:focus):not(:hover)::before {
  opacity: 0 !important;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0;
  }
}

.v-list-item.highlight:before {
  background-color: var(--v-primary-base) !important;
  opacity: 0 !important;
  animation: blink 500ms linear;
  animation-iteration-count: 3;
}
</style>
