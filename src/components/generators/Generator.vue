<template>
  <div>
    <button v-if="exportMode === 'xml'"
      @click="onGenerateXML"
    >
      Сгенерировать XML-фид по выделению
    </button>
    <button v-if="exportMode === 'sql'"
      @click="onGenerateSQL"
    >
      Сгенерировать SQL-запрос по выделению
    </button>
  </div>
</template>

<script>
import GeneratorMixin from './GeneratorMixin.vue'
import XML from 'xml'
import { chessParams } from '../../helpers/chess-params'

export default {
  mixins: [ GeneratorMixin ],
  data () {
    return {
      processedFlats: [],
      processedFlatsArrayOfObject: []
    }
  },
  computed: {
    offsets () {
      return chessParams[this.exportSource].offsets
    },
    filters () {
      return chessParams[this.exportSource].filters
    },
    flatDimension () {
      return chessParams[this.exportSource].flatDimension
    },
    isSelectionCorrect () {
      const byWidth = this.chessDimension[0] % this.flatDimension[0]
      const byHeight = this.chessDimension[1] % this.flatDimension[1]
      return byWidth === 0 && byHeight === 0
    },
    floorsAmount() {
      return this.chessDimension[1] / this.flatDimension[1]
    },
    flatsOnFloor() {
      return this.chessDimension[0] / this.flatDimension[0]
    },
    resultingFlatsObjectForXML () {
      return {flats: this.processedFlats}
    }
  },  
  methods: {
    onGenerateXML () {
      this.resetPreviousResults()
      if (this.isSelectionCorrect) {
        this.processChessTable(this.startRow, this.startColumn, 1)

        console.log(XML(this.resultingFlatsObjectForXML))
      } else {
        alert('DOES NOT MATCH!!!')
      }
    },
    onGenerateSQL () {
      this.resetPreviousResults()
      if (this.isSelectionCorrect) {
        this.processChessTable(this.startRow, this.startColumn, 1)
        // beginning of the query
        let sqlString = 'INSERT INTO `flat` (`newbuilding_id`, `entrance_id`, `address`, `detail`, `area`, `rooms`, `floor`, `price_cash`, `status`, `created_at`, `updated_at`, `unit_price_cash`, `discount`, `azimuth`, `notification`, `extra_data`, `composite_flat_id`, `section`, `number`, `layout`, `unit_price_credit`, `price_credit`, `floor_position`, `floor_layout`, `layout_coords`, `is_euro`, `is_studio`) VALUES '
        
        this.processedFlatsArrayOfObject.forEach( (flat, i) => {
          if (flat.apartment) {
            /** price for meter2 */ 
            const separator = i < this.processedFlatsArrayOfObject.length - 1 ? ', ' : ';'
            const priceForM2 = flat.price && flat.area ? parseFloat(flat.price / flat.area).toFixed(2) : 0
            const price = flat.price ? flat.price : 0

            const flatString = `(${this.buildingID}, ${this.entranceID}, NULL,	NULL,	${flat.area},	${flat.room},	${flat.floor},	${price},	2,	NOW(),	NOW(),	${priceForM2},	0,	NULL,	NULL,	NULL, NULL,	${this.section},	${flat.apartment},	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	${flat.is_euro},	${flat.is_studio})${separator}`

            sqlString = sqlString + flatString
          }
        })
        console.log(sqlString)
      } else {
        alert('DOES NOT MATCH!!!')
      }
    },
    resetPreviousResults () {
      this.processedFlats = []
      this.processedFlatsArrayOfObject =[]
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
      return this.chessObject[targetCelladdress].value
    },
    parseFlat(startRow, startColumn, orderOnTheFloor) {

      // check flat for ignore (to ignore commercial rooms, offices etc.)
      let ignoreFlat = false
      if ('ignoreFlatFactor' in this.offsets) {
        const rawIgnoreFactor = this.processCell(startRow, startColumn, this.offsets.ignoreFlatFactor)
        if (rawIgnoreFactor) {
          if ('ignoreFlatFactor' in this.filters && typeof this.filters.ignoreFlatFactor === 'function') {
            ignoreFlat = this.filters.ignoreFlatFactor(rawIgnoreFactor)
          }
        }
      }

      const flat = []
      const flatObj = {}

      if (!ignoreFlat) {
        // get flat number
        let flatNumber = 0
        const rawflatNumber = this.processCell(startRow, startColumn, this.offsets.flatNumber)
        
        if (rawflatNumber) {
          if ('flatNumber' in this.filters && typeof this.filters.flatNumber === 'function') {
            flatNumber = this.filters.flatNumber(rawflatNumber)
          } else {
            flatNumber = rawflatNumber
          }
        }
        
        if (flatNumber) {
          // set flat ID
          flat.push({ flat_id: `${this.buildingID}_${flatNumber}` })
          // set flat number
          flat.push({ apartment: flatNumber })
          flatObj['apartment'] = flatNumber
        }

        // get floor
        if (this.exportSource === 'CityCenter1C' || this.exportSource === 'CityCenter1CVar') {
          const rawFloor = this.processCell(startRow, startColumn, this.offsets.floor)
          if (rawFloor) {
            const floorArr = rawFloor.split(' ')
            flat.push({ floor: floorArr[1] })
            flatObj['floor'] = floorArr[1]
          }
        } else {
          if (orderOnTheFloor === 1) {
            let floor = 0
            const rawFloor = this.processCell(startRow, startColumn, this.offsets.floor)
            if (rawFloor) {
              if ('floor' in this.filters && typeof this.filters.floor === 'function') {
                floor = this.filters.floor(rawFloor)
              } else {
                floor = rawFloor
              }
            }
            this.currentlyProcessingFloor = floor
          }
          flat.push({ floor: this.currentlyProcessingFloor })
          flatObj['floor'] = this.currentlyProcessingFloor
        }

        // get rooms
        let room = 1
        const rawRoom = this.processCell(startRow, startColumn, this.offsets.rooms)

        if (rawRoom) {
          if ('rooms' in this.filters && typeof this.filters.rooms === 'function') {
            room = this.filters.rooms(rawRoom)
          } else {
            room = parseInt(rawRoom)
          }
        }

        if (room) {
          flat.push({ room: room })
          flatObj['room'] = room       
        } 
        
        /* if (rawRoom) {
          if (this.exportSource === 'CityCenter1C' || this.exportSource === 'CityCenter1CVar') {
            const roomArr = rawRoom.split(' ')
            flat.push({ room: roomArr[0] })
            flatObj['room'] = roomArr[0]
          } else {
            let room = 1
            if (parseInt(rawRoom) > 1) {
              room = rawRoom
            }
            flat.push({ room: room })
            flatObj['room'] = room
          }
        } */

        // get price
        let price = 0
        const rawPrice = this.processCell(startRow, startColumn, this.offsets.price)

        if (rawPrice) {
          if ('price' in this.filters && typeof this.filters.price === 'function') {
            price = this.filters.price(rawPrice)
          } else {
            price = parseInt(rawPrice)
          }
        }

        if (price) {
          flat.push({ price: price })
          flatObj['price'] = price
        }

        /* if (rawPrice) {
          if (this.exportSource === 'CityCenter1C' || this.exportSource === 'CityCenter1CVar') {
            const price = rawPrice.replaceAll(/\s/g,'')
            flat.push({ price: price })
            flatObj['price'] = price
          } else {
            price = rawPrice
            flat.push({ price: price })
            flatObj['price'] = price
          }
        } */
        
        // get area
        let area = 0.00
        const rawArea = this.processCell(startRow, startColumn, this.offsets.area)
        
        if (rawArea) {
          if ('area' in this.filters && typeof this.filters.area === 'function') {
            area = this.filters.area(rawArea)
          } else {
            area = parseFloat(rawArea)
          }
        }

        if (area) {
          flat.push({ area: area })
          flatObj['area'] = area       
        } 
        
        // get is_euro flag (optional)
        let is_euro = 0
        if ('is_euro' in this.offsets) {
          const rawIsEuro = this.processCell(startRow, startColumn, this.offsets.is_euro)

          if (rawIsEuro) {
            if ('is_euro' in this.filters && typeof this.filters.is_euro === 'function') {
              is_euro = this.filters.is_euro(rawIsEuro)
            } else {
              is_euro = parseInt(rawIsEuro)
            }
          }
        }

        flat.push({ is_euro: is_euro })
        flatObj['is_euro'] = is_euro

        // get is_studio flag (optional)
        let is_studio = 0
        if ('is_studio' in this.offsets) {
          const rawIsStudio = this.processCell(startRow, startColumn, this.offsets.is_euro)

          if (rawIsStudio) {
            if ('is_studio' in this.filters && typeof this.filters.is_studio === 'function') {
              is_studio = this.filters.is_studio(rawIsStudio)
            } else {
              is_studio = parseInt(rawIsStudio)
            }
          }
        }

        flat.push({ is_studio: is_studio })
        flatObj['is_studio'] = is_studio
      }

      // add flat to Processed Flats (object and array)
      if (!ignoreFlat && flat.length > 0) {
        this.processedFlats.push({ flat: flat }) // for XML-export
        this.processedFlatsArrayOfObject.push(flatObj) // for SQL-export
      }
    },
    processFloor(startRow, startColumn, flat) {
      
      if (flat > this.flatsOnFloor) { return }
      this.parseFlat(startRow, startColumn, flat)

      const mapKeys = Object.keys(this.columnMap)
      const currentColumnKey = mapKeys.find(key => this.columnMap[key] === startColumn)
      const targetColumnKey = parseInt(currentColumnKey) + this.offsets.flatCell
      const column = this.columnMap[targetColumnKey]

      this.processFloor(startRow, column, flat + 1)
    },
    processChessTable(startRow, startColumn, floor) {
      if(floor > this.floorsAmount) { return }
      
      this.processFloor(startRow, startColumn, 1)
      this.processChessTable(parseInt(startRow) + this.offsets.floorRow, startColumn, floor + 1)
    }
  }
}
</script>
