<template>
  <div>
    <button
      @click="onGenerate"
    >
      Сгенерировать фид по выделению
    </button>
    <div>{{ processedFlats }}</div>
    <div>{{ resultingFlatsObject }}</div>
  </div>
</template>

<script>
import FeedMixin from './FeedMixin.vue'
import XML from 'xml'

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
        area: [1, 0],
        price: [3, 1],
        floorRow: 7,
        flatCell: 3

      },
      /**
       * amount of cells a flat occupies
       * array [horizontal, vertical]
       * 
       */
      flatDimension: [3, 7],
      processedFlats: []
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
    },
    resultingFlatsObject () {
      return {flats: this.processedFlats}
    }
  },  
  methods: {
    onGenerate () {
      if (this.isSelectionCorrect) {
        // alert('Match!')
        this.processChessTable(this.startRow, this.startColumn)
        // console.log(rawChess)
        console.log(this.processedFlats)
        console.log(this.resultingFlatsObject)
        console.log(XML(this.resultingFlatsObject))
      } else {
        alert('DOES NOT MATCH!!!')
      }
    },
    processCell(row, column, offset) {
      if (offset[0] !== 0) { row = parseInt(row) + offset[0] }
      if (offset[1] !== 0) {
        const mapKeys = Object.keys(this.columnMap)
        const currentColumnKey = mapKeys.find(key => this.columnMap[key] === column)
        const targetColumnKey = parseInt(currentColumnKey) + offset[1]
        column = this.columnMap[targetColumnKey]
      }
      const targetCelladdress = `${column}${row}`
      //console.log(targetCelladdress)
      //console.log(this.chessObject[targetCelladdress].value)
      return this.chessObject[targetCelladdress].value
    },
    parseFlat(startRow, startColumn) {
      const flat = {}

      // get flat number
      flat['apartment'] = this.processCell(startRow, startColumn, this.offsets.flatNumber)

      // get floor
      const rawFloor = this.processCell(startRow, startColumn, this.offsets.floor)
      // console.log(rawFloor)
      const floorArr = rawFloor.split(' ')
      flat['floor'] = floorArr[1]

      // get rooms
      const rawRoom = this.processCell(startRow, startColumn, this.offsets.rooms)
      const roomArr = rawRoom.split(' ')
      flat['room'] = roomArr[0]

      // get area
      const rawArea = this.processCell(startRow, startColumn, this.offsets.area)
      const areaArr = rawArea.split(' ')
      flat['area'] = areaArr[3]

      // get price
      flat['price'] = this.processCell(startRow, startColumn, this.offsets.price)

      this.processedFlats.push({ flat: flat })
      // return flat

    },
    processFloor(startRow, startColumn) {
      // const floorArr = []
      for (let flat = 1; flat <= this.flatsOnFloor; flat++) {
        let row = startRow
        let column = startColumn
        //floorArr.push( this.parseFlat(row, column) )
        this.parseFlat(row, column)
        const mapKeys = Object.keys(this.columnMap)
        const currentColumnKey = mapKeys.find(key => this.columnMap[key] === column)
        const targetColumnKey = parseInt(currentColumnKey) + this.offsets.flatCell
        column = this.columnMap[targetColumnKey]
      }
      // return floorArr
    },
    processChessTable(startRow, startColumn) {
      // const fullChess = []
      for (let floor = 1; floor <= this.floorsAmount; floor++) {
        let row = startRow
        let column = startColumn
        // fullChess.push( this.processFloor(row, column) )
        this.processFloor(row, column)
        row = parseInt(row) + this.offsets.floorRow
      }
      // return fullChess
    }
  }
}
</script>
