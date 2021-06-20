class SudokuSolver {

  generateGrid(puzzleString) {
    const a = [];

    for (let i = 65; i <= 73; i++)
      for (let j = 1; j <= 9; j++)
        a.push(`${String.fromCharCode(i)}${j}`);

    return a.map((cell, i) => {
      let obj = {}
      obj[cell] = puzzleString[i];
      return obj;
    });
  }

  generateDividedGrid(puzzleString) {
    let populatedGrid = this.generateGrid(puzzleString);
    let dividedGrid = [];

    for (let i = 65; i <= 73; i++)
      dividedGrid.push(
        populatedGrid.filter(
          cell => Object.keys(cell)[0].includes(String.fromCharCode(i))
        )
      );
    
    return dividedGrid;
  }

  validate(puzzleString) {
    try {
      if (puzzleString === '') throw 'Required field missing';

      if (puzzleString.length !== 81) throw 'Expected puzzle to be 81 characters long';

      if (/[^1-9.]/g.test(puzzleString)) throw 'Invalid characters in puzzle';

      return puzzleString;
    } catch (error) {
      return { error };
    }
  }

  checkValueInCell(puzzleString, row, column, value) {
    let populatedGrid = this.generateGrid(puzzleString);

    let cell = populatedGrid.filter(c => Object.keys(c)[0] === `${row.toUpperCase()}${column}`)[0]

    return Object.values(cell)[0] === value.toString() ? true : false
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let dividedGrid = this.generateDividedGrid(puzzleString);

    const rowNum = row.toUpperCase().charCodeAt();

    const currentRow = dividedGrid[rowNum - 65].map(cell => Object.values(cell)[0]);
    // console.log(currentRow);

    return !currentRow.includes(value.toString()) ? true : false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let dividedGrid = this.generateDividedGrid(puzzleString);

    const currentCol = dividedGrid.map(r => Object.values(r[parseInt(column) - 1])[0]);
    // console.log(currentCol);

    return !currentCol.includes(value.toString()) ? true : false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let dividedGrid = this.generateDividedGrid(puzzleString);
    let regionGrid = [];
    let cellKey = `${row.toUpperCase()}${column}`;

    // Generate 3x3 grids as subarrays
    for (let i=0; i<9; i+=3)
      for (let j=0; j<9; j+=3)
        regionGrid.push(
          dividedGrid.map(cell => [cell[j], cell[j+1], cell[j+2]]).slice(i, i+3)
        );

    const regionGridFlat = regionGrid.map(region => region.flat())
    // console.log(regionGridFlat);

    const currentRegion = regionGridFlat.filter(
      region => region.map(cell => Object.keys(cell)).flat().includes(cellKey)
    ).flat(2);

    const currentRegionValues = currentRegion.map(cell => Object.values(cell)).flat();
    // console.log(value, currentRegionValues)

    return !currentRegionValues.includes(value.toString()) ? true : false;
  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

