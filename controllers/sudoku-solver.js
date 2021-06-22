class SudokuSolver {

  constructor(){ this.runCount = []}

  incRunCount(c) {
    this.runCount.push(c);
  }

  getRunCount() {
    return this.runCount;
  }

  generateGrid(puzzleString) {
    const a = [];

    for (let charCode = 65; charCode <= 73; charCode++)
      for (let j = 1; j <= 9; j++)
        a.push(`${String.fromCharCode(charCode)}${j}`);

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
    // console.log(populatedGrid)

    let cell = populatedGrid.filter(c => Object.keys(c)[0] === `${row.toUpperCase()}${column}`)[0]

    return Object.values(cell)[0] === value.toString() ? true : false
  }

  checkEmptySlot(puzzleString) {
    let populatedGrid = this.generateGrid(puzzleString);

    return populatedGrid.some(cell => Object.values(cell)[0] === '.');
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let dividedGrid = this.generateDividedGrid(puzzleString);

    // console.log(dividedGrid, hasEmptyCell)
    const rowNum = row.toUpperCase().charCodeAt();

    const currentRow = dividedGrid[rowNum - 65].map(cell => Object.values(cell)[0]);
    // console.log(currentRow);

    return !currentRow.includes(value.toString()) ? true : false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let dividedGrid = this.generateDividedGrid(puzzleString);

    // Witchcraft!
    const currentCol = dividedGrid.map(r => Object.values(r[parseInt(column) - 1])[0]);
    // console.log(currentCol);

    return !currentCol.includes(value.toString()) ? true : false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let dividedGrid = this.generateDividedGrid(puzzleString);
    let regionGrid = [];
    let cellKey = `${row.toUpperCase()}${column}`;

    // Generate 3x3 grids as subarrays
    for (let i = 0; i < 9; i += 3)
      for (let j = 0; j < 9; j += 3)
        regionGrid.push(
          dividedGrid.map(cell => [cell[j], cell[j + 1], cell[j + 2]]).slice(i, i + 3)
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
    try {
      if (!this.checkEmptySlot(puzzleString)) return puzzleString;

      let a = this.generateGrid(puzzleString);
      let puzzle = {}
      a.map(cell => puzzle[Object.keys(cell)[0]] = Object.values(cell)[0]);

      for (let cell in puzzle) 
        if (puzzle[cell] === '.') {
          let arr = [];
          for (let i=1; i<=9; i++) {
            let [rowPlacement, colPlacement, regPlacement] = [
              this.checkRowPlacement(puzzleString, cell[0], cell[1], i),
              this.checkColPlacement(puzzleString, cell[0], cell[1], i),
              this.checkRegionPlacement(puzzleString, cell[0], cell[1], i)
            ];
            if (rowPlacement && colPlacement && regPlacement) arr.push(i)
          }
          if (arr.length === 1) puzzle[cell] = arr[0].toString();
        }
      
      let solvedRound = Object.values(puzzle).join('')
      // console.log(solvedRound)
      let prevRuns = this.getRunCount();
      // console.log(prevRuns)
      if (prevRuns.length > 0 && prevRuns[prevRuns.length - 2] === puzzleString) throw 'Puzzle cannot be solved';

      this.incRunCount(solvedRound);

      if (this.checkEmptySlot(solvedRound)) return this.solve(solvedRound);

      console.log(solvedRound)
      return solvedRound;
    } catch (error) {
      console.log(error)
      return { error }
    }
  }
}

module.exports = SudokuSolver;

