<template>
  <SoundControl v-if="playing.lengthInMs" :playing-sound="playing"></SoundControl>
  <PassthroughControl v-else :output="playing"></PassthroughControl>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Playing } from '~/types';
import SoundControl from '~/components/SoundControl.vue';
import PassthroughControl from '~/components/PassthroughControl.vue';

export default Vue.extend({
  name: 'PlayingControl',
  components: { PassthroughControl, SoundControl },
  props: {
    playing: {
      type: Object as PropType<Playing>,
      required: true,
    },
  },
});
</script>

<style lang="scss">
/* TODO: do we have to overwrite these vuetify classes here? */
.v-input__prepend-outer {
  align-self: center;
}
.v-input__append-outer {
  align-self: center;
}
.sound-name {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
