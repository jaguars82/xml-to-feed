<template>
  <div>

    <div
      id="table-container"
      class="table-container"
    >
      <div
        class="table-row"
        v-for="(row, i) in grid.rows"
        :key="i"
      >
        <div
          class="cell"
          v-for="column in grid.columns"
          :key="`${row}${column}`"
        >
          {{row}}{{column}}
        </div>
      </div>

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

    <!--<span v-for="item in selected" :key="item">
      {{ item }} 
    </span>-->

  </div>
</template>

<script>
import { columnMap } from '../helpers/excel'
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
        columns: columnMap
      },

      
    }
  },
  methods: {
    onDragStart(e) {
      console.log("ds", e.inputEvent.target);
    },
    onSelectStart(e) {
      console.log("start", e);
      e.added.forEach(el => {
        el.classList.add("selected");
      });
      e.removed.forEach(el => {
        el.classList.remove("selected");
      });
    },
    onSelectEnd(e) {
      console.log("end", e);
      e.afterAdded.forEach(el => {
        el.classList.add("selected");
      });
      e.afterRemoved.forEach(el => {
        el.classList.remove("selected");
      });
    },
  }
}
</script>

<style scoped>

.table-container {
  width: 100%;
  height: 500px;
  overflow: scroll;
}

.table-row {
  white-space: nowrap;
}

.cell {
  display: inline-block;
  width: 50px;
  border: solid thin #ccc;
}

/** vue-selecto style */
.selected {
  background: #ccc;
}

</style>