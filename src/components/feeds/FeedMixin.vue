<template>
  <div>
    
  </div>
</template>

<script>
import { columnMap } from '../../helpers/excel'

export default {
  name: 'Feed',
  props: ['chessDimension', 'startRow', 'startColumn'],
  data () {
    return { 
      columnMap: columnMap
    }
  },
}
</script>
