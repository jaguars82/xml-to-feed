<template>
  <div>
  </div>
</template>

<script>
import { columnMap } from '../../helpers/excel'

export default {
  name: 'Feed',
  props: ['exportSource', 'exportMode', 'section', 'buildingID', 'chessDimension', 'startRow', 'startColumn', 'chessObject', 'chessArray'],
  data () {
    return { 
      columnMap: columnMap
    }
  },
}
</script>
