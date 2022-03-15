<template>
  <div>

  </div>
</template>

<script>
import FeedMixin from './FeedMixin.vue'

export default {
  mixins: [ FeedMixin ],
  data () {
    return {
      /**
       *  offsets relitive to base (start) cell
       *  array [row offset, column offset]
       * 
       * */
      offsets: {
        flatNumber: [0, 0],
        floor: [1, 0],
        rooms: [0 ,1],
        area: [1, 1],
        price: [3, 1]
      },
      /**
       * amount of cells a flat occupies
       * array [horizontal, vertical]
       * 
       */
      flatDimension: [3, 7]
    }
  },
  methods: {
    parseFlat()
  }
}
</script>
