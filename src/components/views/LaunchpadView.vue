<template>
  <div id="launchpad-view" class="overflow-y-auto pt-3 px-3" style="height: calc(100vh - 283px)">
    <div v-resize="updateColumns" class="launchpad-items">
      <div v-for="(sound, sIndex) in paginatedSounds" :key="sIndex">
        <SoundContextMenu :sound="sound">
          <template #default="{ context }">
            <v-btn
              :id="`sound-${sound.id}`"
              class="text-none text-truncate launchpad-button"
              block
              height="50"
              width="150"
              @click="$store.dispatch('playSound', sound)"
              @contextmenu="context"
            >
              <div class="content">
                <span class="text">{{ sound.name }}</span>
                <span class="indicator">
                  {{ keyboard[sIndex] }}
                </span>
              </div>
            </v-btn>
          </template>
        </SoundContextMenu>
      </div>
    </div>
    <div class="text-center mt-3">
      <v-pagination v-model="page" :length="pagesCount" circle></v-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Sound, Tab } from '@/types';
import SoundContextMenu from '@/components/SoundContextMenu.vue';

export default Vue.extend({
  name: 'LaunchpadView',
  components: { SoundContextMenu },
  props: {
    tab: {
      type: Object as PropType<Tab>,
      required: true,
    },
  },
  data() {
    return {
      page: 1,
      columns: 1,
    };
  },
  mounted() {
    document.addEventListener('keydown', this.keyDownHandler);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownHandler);
  },
  computed: {
    pagesCount(): number {
      return Math.ceil(this.tab.sounds.length / this.perPage);
    },
    perPage(): number {
      return this.columns * 4;
    },
    paginatedSounds(): Sound[] {
      return this.tab.sounds.slice(this.perPage * (this.page - 1), this.perPage * this.page);
    },
    keyboard(): string {
      const rows = [`1234567890`, `QWERTYUIOP`, `ASDFGHJKL;`, `ZXCVBNM,./`];
      return rows.map(x => x.substr(0, this.columns)).join('');
    },
  },
  watch: {
    tab() {
      this.updateColumns();
    },
  },
  methods: {
    updateColumns(): void {
      const grid = this.$el.querySelector('.launchpad-items');
      if (grid) {
        this.columns = window
          .getComputedStyle(grid, null)
          .getPropertyValue('grid-template-columns')
          .split(' ').length;
        if (this.page > this.pagesCount) {
          this.page = this.pagesCount;
        }
      }
    },
    keyDownHandler(event: KeyboardEvent): void {
      // only when the tab is active
      if (this.$store.getters.showFavorites) {
        if (this.tab.id !== -1) {
          return;
        }
      } else if (this.tab.id !== this.$store.getters.activeTabIndex) {
        return;
      }
      // TODO: !settingsModal && !helpModal
      if (
        !this.$store.getters.appPassThroughDrawer &&
        !this.$store.getters.searchModal &&
        !this.$store.getters.setHotkeyModal
      ) {
        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
          if (event.code === 'ArrowLeft') {
            if (this.page > 1) {
              this.page--;
              this.updateColumns();
            }
          } else if (event.code === 'ArrowRight') {
            if (this.page < this.pagesCount) {
              this.page++;
              this.updateColumns();
            }
          }

          const keys = [];
          for (const key of this.keyboard) {
            if (!isNaN(parseInt(key))) {
              keys.push(`Digit${key}`);
            } else if (key === ';') {
              keys.push('Semicolon');
            } else if (key === ',') {
              keys.push('Comma');
            } else if (key === '.') {
              keys.push('Period');
            } else if (key === '/') {
              keys.push('Slash');
            } else {
              keys.push(`Key${key}`);
            }
          }

          keys.forEach((keyCode, index) => {
            if (event.code === keyCode) {
              // console.log('play sound', keyCode, index);
              const sound = this.paginatedSounds[index];
              if (sound) {
                this.$store.dispatch('playSound', sound);
              }
            }
          });
        }
      }
    },
  },
});
</script>

<style lang="scss">
.launchpad-items {
  --repeat: auto-fit;
  @media (min-width: calc(180px * 10)) {
    --repeat: 10;
  }

  display: grid;
  // has to match the button width
  grid-template-columns: repeat(var(--repeat, auto-fill), minmax(150px, 1fr));
  // 4 keyboard rows
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 8px;
}

// class for launchpad buttons
.launchpad-button {
  // disable vuetify default padding
  padding: 0 !important;

  // overwrite vuetify button content
  > span.v-btn__content {
    height: 100%;
    width: 100%;

    .content {
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;

      .text {
        width: 100%;
        padding: 0 13px;
        white-space: pre-wrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .indicator {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 0.9rem;
        color: var(--v-primary-base);
      }
    }
  }
}
</style>
