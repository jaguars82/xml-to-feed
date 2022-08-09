const chessParams = { 
  CityCenter1C: { 
    offsets: {
      flatNumber: [0, 0],
      floor: [1, 0],
      rooms: [0 ,1],
      area: [1, 0],
      price: [3, 1],
      floorRow: 7, // amount of spreadsheet rows for one floor (or for one flat)
      flatCell: 3 // amount of spreadsheet cells for one flat
    },
    filters: {
      rooms: function (cellValue) {
        const arr = cellValue.split(' ')
        return arr[0]
      },
      area: function (cellValue) {
        const arr = cellValue.split(' ')
        return parseFloat(arr[3].replaceAll(',', '.'))
      },
      price: function (cellValue) {
        return cellValue.replaceAll(/\s/g,'')
      }
    },
    flatDimension: [3, 7] // [amount of cells (flatCell), amount of rows (floorRows)]
  },
  CityCenter1CVar: { 
    offsets: {
      flatNumber: [2, 1],
      floor: [1, 0],
      rooms: [0 ,0],
      area: [1, 0],
      price: [4, 1],
      floorRow: 7,
      flatCell: 3
    },
    filters: {
      rooms: function (cellValue) {
        const arr = cellValue.split(' ')
        return arr[0]
      },
      area: function (cellValue) {
        const arr = cellValue.split(' ')
        return parseFloat(arr[3].replaceAll(',', '.'))
      },
      price: function (cellValue) {
        return cellValue.replaceAll(/\s/g,'')
      }
    },
    flatDimension: [3, 7]
  },
  VDK: {
    offsets: {
      flatNumber: [0, 0],
      floor: [0, -1],
      rooms: [0 ,2],
      area: [1, 0],
      price: [2, 1],
      floorRow: 3,
      flatCell: 3
    },
    filters: {},
    flatDimension: [3, 3]
  },
  Krays: {
    offsets: {
      flatNumber: [0, 0],
      floor: [0, -1],
      rooms: [0 ,1],
      area: [1, 0],
      price: [2, 1],
      floorRow: 3,
      flatCell: 2
    },
    filters: {},
    flatDimension: [2, 3]
  },
  Razvitie: {
    offsets: {
      flatNumber: [1, 1],
      floor: [1, -1],
      rooms: [6, 1],
      area: [7, 1],
      price: [4, 1],
      floorRow: 9,
      flatCell: 2
    },
    filters: {
      flatNumber: function (cellValue) {
        let processedCell = cellValue.replaceAll('= ', '').replaceAll(' =', '')
        return processedCell.replaceAll(/\s/g,'')
      },
      rooms: function (cellValue) {
        const arr = cellValue.split('-')
        return parseInt(arr[0])
      },
      area: function (cellValue) {
        const arr = cellValue.split('(')
        return parseFloat(arr[1].replaceAll(',', '.'))
      },
      price: function (cellValue) {
        return cellValue.replaceAll(/\s/g,'')
      }
    },
    flatDimension: [2, 9]
  }
}

export { chessParams }