<template>
  <div>

    <select v-model="selectedSource">
      <option v-for="source in exportSources" :key="source.value" :value="source.value">{{ source.text }}</option>
    </select>

    <select v-model="selectedMode">
      <option v-for="mode in exportModes" :key="mode.value" :value="mode.value">{{ mode.text }}</option>
    </select>

    <div>
      <label>ID здания</label>
      <input type="text" v-model="buildingID" />
    </div>

    <div>
      <label>ID подъезда</label>
      <input type="text" v-model="entranceID" />
    </div>

    <div v-if="selectedMode === 'sql'">
      <label>№ подъезда</label>
      <input type="text" v-model="section" />
    </div>

    <div>
      <input type="file" @change="onChange" />
    </div>
    
    <div
      id="table-container"
      class="table-container"
    >
      <table class="table" v-if="renderedTable">
        <tr
          class="table-row"
          v-for="(row, i) in renderedTable"
          :key="i"
        >
          <td
            class="cell"
            v-for="cell in row"
            :key="cell.address"
            :data-address="cell.address"
            :data-row="cell.row"
            :data-column="cell.column"
          >
            <span v-if="cell.value !== null">{{ cell.value }}</span>
          </td>
        </tr>
      </table>

      <vue-selecto
        :container="'table-container'"
        :selectableTargets="['.cell']"
        :dragContainer="dragContainer"
        :hitRate="5"
        :selectFromInside="false"
        :selectByClick="false"
        @dragStart="onDragStart"
        @selectStart="onSelectStart"
        @selectEnd="onSelectEnd"
      />

    </div>

    <div>Область формирования фида</div>

    <generator
      :exportSource="selectedSource"
      :exportMode="selectedMode"
      :buildingID="buildingID"
      :entranceID="entranceID"
      :section="section"
      :chessDimension="chessSectionDimension"
      :startRow="startRow"
      :startColumn="startColumn"
      :chessObject="renderdCells"
      :chessArray="renderdCellsArr"
    >
    </generator>

  </div>
</template>

<script>
import { columns } from '../helpers/excel'
import * as XLSX from 'xlsx'
import { VueSelecto } from 'vue-selecto'
import Generator from '../components/generators/Generator.vue'

export default {
  components: {
    VueSelecto,
    // Generator: () => import('../components/generators/Generator.vue'),
    Generator
  },
  data () {
    return {

      exportSources: [
        { value: 'CityCenter1C', text: 'шахматка 1С (Сити-Центр)' },
        { value: 'CityCenter1CVar', text: 'шахматка 1С (Сити-Центр), вариант' },
        { value: 'VDK', text: 'шахматка ВДК' },
        { value: 'Krays', text: 'шахматка КРАЙС' },
        { value: 'NewCode', text: 'шахматка НОВЫЙ КОД' },
        { value: 'Razvitie', text: 'шахматка РАЗВИТИЕ' },
        { value: 'OP_Alexandrovka', text: 'шахматка ОТДЕЛ ПРОДАЖ - АЛЕКСАНДРОВКА' },
      ],
      selectedSource: 'CityCenter1C',

      exportModes: [
        { value: 'xml', text: 'XML-фид' },
        { value: 'sql', text: 'SQL-запрос' }
      ],
      selectedMode: 'sql',
      
      // dragContainer: document.body,
      dragContainer: '.table-container',
      grid: {
        rows: 600,
        columns: columns
      },
      buildingID: '',
      entranceID: '',
      section: '',
      worksheet: null,
      renderedTable: null,
      renderdCells: {},
      renderdCellsArr: [],
      startRow: null,
      startColumn: '',
      chessSectionRange: {},
      chessSectionDimension: [],
      // feedComponent: 'Generator'
    }
  },
  methods: {
    onDragStart(e) {
      void(e)
    },
    onSelectStart(e) {
      e.added.forEach(el => {
        el.classList.add("selected")
      })
      e.removed.forEach(el => {
        el.classList.remove("selected")
      })
    },
    onSelectEnd(e) {
      const selectedCells = []
      const selectedRows = []
      const selectedColumns = []
      e.selected.forEach(el => {
        selectedCells.push(el.dataset.address)
        if(selectedRows.indexOf(el.dataset.row) === -1) {
          selectedRows.push(el.dataset.row)
        }
        if(!selectedColumns.includes(el.dataset.column)) {
          selectedColumns.push(el.dataset.column)
        }
      })
      const range = { start: selectedCells[0], end: selectedCells[selectedCells.length - 1] }
      this.startRow = selectedRows[0]
      this.startColumn = selectedColumns[0]
      this.chessSectionRange = range
      this.chessSectionDimension = [selectedColumns.length, selectedRows.length]

      e.afterAdded.forEach(el => {
        el.classList.add("selected")
      })
      e.afterRemoved.forEach(el => {
        el.classList.remove("selected")
      })
    },
    readWorksheet(event) {
      /* read worksheet from excel file */
      this.file = event.target.files ? event.target.files[0] : null
      // let ws = null
      if (this.file) {
        const reader = new FileReader()

        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result
          const wb = XLSX.read(bstr, { type: 'binary' })
          /* Get first worksheet */
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          /* Convert array of arrays */
          // const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          this.worksheet = ws
        }
        reader.readAsBinaryString(this.file)
        // const res = reader.readAsBinaryString(this.file);
        // console.log(res)
      }
    },
    buildTable(ws) {
      /* prepare object to build table */
      const tableObject = {}

      /** TO DO - выбрать между cellsObject и cellsArray более подходящий формат */
      const cellsObject = {}
      const cellsArray = []
      // console.log(ws)
      //for (let row in this.grid.rows) {
      for (let row = 1; row <= this.grid.rows; row++) {
        // console.log(row)
        const rowCells = []
        for (let column of this.grid.columns) {
          const cell = {}
          const cellAddress = `${column}${row}`
          cell['row'] = row
          cell['column'] = column
          cell['address'] = cellAddress
          let cellValue = cellAddress in ws ? ws[cellAddress].v : null
          if(cellValue === undefined) { cellValue = null }
          cell['value'] =  cellValue
          // cell['value'] =  cellAddress in this.worksheet ? this.worksheet[cellAddress].v : null
          rowCells.push(cell)
          cellsObject[cellAddress] = cell
          cellsArray.push(cell)
        }
        tableObject[row] = rowCells
      }
      // console.log(tableObject)
      this.renderedTable = tableObject
      this.renderdCells = cellsObject
      this.renderdCellsArr = cellsArray
      // console.log(cellsObject)
      // console.log(cellsArray)
    },
    onChange(event) {

      this.worksheet = null
      this.renderedTable = null
      this.readWorksheet(event)
      //console.log(data)
      setTimeout(() => { this.buildTable(this.worksheet) }, 100)
    },
  }
}
</script>

<style scoped>

.table {
  column-gap: 0;
  column-span: 0;
}

.table-container {
  width: 100%;
  /*height: 2500px;
  overflow: scroll;*/
}

.table-row {
  white-space: nowrap;
  /*border: solid thin #ccc;*/
}

.cell {
  display: inline-block;
  width: 50px;
  height: 14px;
  border: solid thin #ccc;
  font-size: 11px;
  overflow: visible;
}

/** vue-selecto style */
.selected {
  background: #ccc;
}

</style>