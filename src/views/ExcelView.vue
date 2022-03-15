<template>
  <div>

    <input type="file" @change="onChange" />

    <div
      id="table-container"
      class="table-container"
    >
      <!--
      <div
        class="table-row"
        v-for="(row, i) in grid.rows"
        :key="i"
      >
        <div
          class="cell"
          v-for="column in grid.columns"
          :key="`${column}${row}`"
        >
          {{column}}{{row}}<br />
          <span v-if="worksheet" v-text="worksheet[ 'A' + 4 ].v"></span>
        </div>
      </div>
      -->

      <!--
      <template v-if="renderedTable">
        <div
          class="table-row"
          v-for="(row, i) in renderedTable"
          :key="i"
        >
          <div
            class="cell"
            v-for="cell in row"
            :key="cell.address"
          >
            <span v-if="cell.value !== null">{{ cell.value }}</span>
          </div>
        </div>
      </template>
      -->

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

  </div>
</template>

<script>
import { columns } from '../helpers/excel'
import * as XLSX from 'xlsx'
import { VueSelecto } from 'vue-selecto'

export default {
  components: {
    VueSelecto
  },
  data () {
    return {
      // dragContainer: document.body,
      dragContainer: '.table-container',
      grid: {
        rows: 150,
        columns: columns
      },
      worksheet: null,
      renderedTable: null,
      renderdCells: {},
      renderdCellsArr: [],
      chessSectionRange: {}
    }
  },
  methods: {
    onDragStart(e) {
      // console.log("ds", e.inputEvent.target)
      void(e)
    },
    onSelectStart(e) {
      // console.log("start", e)
      e.added.forEach(el => {
        el.classList.add("selected")
      })
      e.removed.forEach(el => {
        el.classList.remove("selected")
      })
    },
    onSelectEnd(e) {
      // console.log("end", e);

      const selectedCells = []
      e.selected.forEach(el => {
        // console.log(el.dataset.address)
        selectedCells.push(el.dataset.address)
      })
      const range = { start: selectedCells[0], end: selectedCells[selectedCells.length - 1] }
      console.log(selectedCells)
      console.log(range)
      this.chessSectionRange = range
      

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
          // console.log(ws);
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
  height: 500px;
  overflow: scroll;
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