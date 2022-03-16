<template>
  <div>
    <button
      @click="onGenerate"
    >
      Сгенерировать фид по выделению
    </button>
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
  computed: {
    isSelectionCorrect () {
      const byWidth = this.chessDimension[0] % this.flatDimension[0]
      const byHeight = this.chessDimension[1] % this.flatDimension[1]
      return byWidth === 0 && byHeight === 0
      // return [ byWidth, byHeight ]
    },
    floorsAmount() {
      return this.chessDimension[1] / this.flatDimension[1]
    },
    flatsOnFloor() {
      return this.chessDimension[0] / this.flatDimension[0]
    }
  },  
  methods: {
    onGenerate () {
      if (this.isSelectionCorrect) {
        alert('Match!')
      } else {
        alert('DOES NOT MATCH!!!')
      }
    },
    parseFlat() {
    },
    processFloor() {

    },
    processChessTable() {

    }
  }
}
</script>
