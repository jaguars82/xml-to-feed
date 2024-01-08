const chessParams = { 
  CityCenter1C: { 
    offsets: {
      /* 
       * in each pair of params:
       * the first digit is a vertical offset (Y axis)
       * the second digit is a horizontal offset  (X axis)
       */
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
  },
  OP_Alexandrovka: {
    offsets: {
      flatNumber: [0, 1],
      floor: [0, -1],
      rooms: [0 ,0],
      area: [1, 0],
      price: [3, 1],
      floorRow: 4,
      flatCell: 2
    },
    filters: {
      floor: function (cellValue) {
        return parseInt(cellValue)
      },
      flatNumber: function (cellValue) {
        return parseInt(cellValue.replace('№', ''))
      },
      rooms: function (cellValue) {
        return parseInt(cellValue)
      },
    },
    flatDimension: [2, 4]
  },
  NewCode: { 
    offsets: {
      flatNumber: [1, 0],
      floor: [1, -1],
      rooms: [0 ,0],
      area: [2, 0],
      price: [0, 0], // (there is no price cell in the chess spreadsheet)
      is_euro: [0, 0],
      is_studio: [0, 0],
      floorRow: 3,
      flatCell: 1
    },
    filters: {
      rooms: function (cellValue) {
        return Array.from(cellValue)[1]
      },
      area: function (cellValue) {
        return parseFloat(cellValue)
      },
      price: function () {
        return 0
      },
      is_euro: function (cellValue) {
        return Array.from(cellValue)[3] === 'е' ? 1 : 0
      },
      is_studio: function (cellValue) {
        return Array.from(cellValue)[3] == '0' ? 1 : 0
      },
    },
    flatDimension: [1, 3]
  },
  ComfortStroy: { 
    offsets: {
      ignoreFlatFactor: [0, 0],
      flatNumber: [1, 0],
      floor: [0, -1],
      rooms: [0 ,0],
      area: [2, 0],
      price: [0, 0], // (there is no price cell in the chess spreadsheet)
      is_euro: [0, 0],
      is_studio: [0, 0],
      floorRow: 3,
      flatCell: 1
    },
    filters: {
      ignoreFlatFactor: function (ignoreFactorValue) {
        let ignore = false
        if (ignoreFactorValue === 'офис' || ignoreFactorValue === 'ком помещ' || ignoreFactorValue === 'кком помещ') { 
          ignore = true
        }
        return ignore
      },
      rooms: function (cellValue) {
        const firstSymbol = Array.from(cellValue)[0]
        return firstSymbol === 'С' ? 1 : firstSymbol
      },
      area: function (cellValue) {
        // return cellValue ? parseFloat(cellValue.replaceAll(',', '.')) : 0
        return cellValue ? parseFloat(cellValue) : 0
      },
      price: function () {
        return 0
      },
      is_euro: function (cellValue) {
        return Array.from(cellValue)[1] === 'е' ? 1 : 0
      },
      is_studio: function (cellValue) {
        return Array.from(cellValue)[0] === 'С' ? 1 : 0
      },
    },
    flatDimension: [1, 3]
  },
}

export { chessParams }