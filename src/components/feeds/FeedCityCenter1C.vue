<template>
  <div>
    <button
      @click="onGenerate"
    >
      Сгенерировать фид по выделению
    </button>
    <!--<div>{{ processedFlats }}</div>
    <div>{{ resultingFlatsObject }}</div>-->
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
        this.processChessTable(this.startRow, this.startColumn, 1)
        // console.log(rawChess)
        // console.log(this.processedFlats)
        // console.log(this.resultingFlatsObject)
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
      const flat = []

      // get flat number
      const flatNumber = this.processCell(startRow, startColumn, this.offsets.flatNumber)
      if (flatNumber) {
        // set flat ID
        flat.push({ flat_id: `${this.buildingID}_${flatNumber}` })
        // set flat number
        flat.push({ apartment: flatNumber })
      }

      // get floor
      const rawFloor = this.processCell(startRow, startColumn, this.offsets.floor)
      if (rawFloor) {
        const floorArr = rawFloor.split(' ')
        flat.push({ floor: floorArr[1] })
      }

      // get rooms
      const rawRoom = this.processCell(startRow, startColumn, this.offsets.rooms)
        if (rawRoom) {
        const roomArr = rawRoom.split(' ')
        flat.push({ room: roomArr[0] })
      }

      // get price
      const flatPrice = this.processCell(startRow, startColumn, this.offsets.price)
      if (flatPrice) {
        flat.push({ price: flatPrice.replaceAll(/\s/g,'') })
      }
      
      // get area
      const rawArea = this.processCell(startRow, startColumn, this.offsets.area)
      if (rawArea) {
        const areaArr = rawArea.split(' ')
        flat.push({ area: parseFloat(areaArr[3].replaceAll(',', '.')) })
      }

      if (flat.length > 0) {
        this.processedFlats.push({ flat: flat })
      }
    },
    processFloor(startRow, startColumn, flat) {
      
      if (flat > this.flatsOnFloor) { return }
      //console.log(flat)
      //console.log(this.flatsOnFloor)
      //console.log(startColumn)
      this.parseFlat(startRow, startColumn)

      const mapKeys = Object.keys(this.columnMap)
      const currentColumnKey = mapKeys.find(key => this.columnMap[key] === startColumn)
      const targetColumnKey = parseInt(currentColumnKey) + this.offsets.flatCell
      const column = this.columnMap[targetColumnKey]

      this.processFloor(startRow, column, flat + 1)
    },
    processChessTable(startRow, startColumn, floor) {
      if(floor > this.floorsAmount) { return }
      // console.log(startRow)
      this.processFloor(startRow, startColumn, 1)
      this.processChessTable(parseInt(startRow) + this.offsets.floorRow, startColumn, floor + 1)
    }
  }
}
</script>
