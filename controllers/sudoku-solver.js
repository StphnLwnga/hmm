class SudokuSolver {
	
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

    let cell = populatedGrid.filter(c => Object.keys(c)[0] === `${row.toUpperCase()}${column}`)[0]

    return Object.values(cell)[0] === value.toString() ? true : false
  }

  checkEmptySlot(puzzleString) {
    let populatedGrid = this.generateGrid(puzzleString);
    return populatedGrid.some(cell => Object.values(cell)[0] === '.');
  }

	checkSolvablePuzzle(puzzleString) {
		let dividedGrid = this.generateGrid(puzzleString);
		let puzzle = {};
		let regionGrid = [];

		dividedGrid
			.filter(cell => Object.values(cell)[0] !== '.')
			.map(cell => puzzle[Object.keys(cell)[0]] = Object.values(cell)[0]);

		let allGrid = this.generateDividedGrid(puzzleString);

		for (let i = 0; i < 9; i += 3)
      for (let j = 0; j < 9; j += 3)
        regionGrid.push(
          allGrid.map(cell => [cell[j], cell[j + 1], cell[j + 2]]).slice(i, i + 3)
        );

    const regionGridFlat = regionGrid.map(region => region.flat())

		for (let cell in puzzle) {
			let [row, column, value] = [cell[0], cell[1], puzzle[cell]];

			const rowNum = row.toUpperCase().charCodeAt();
			const valueInRow = allGrid[rowNum - 65]
				.filter(c => Object.keys(c)[0] !== cell)
				.map(c => Object.values(c)[0])
				.includes(value);
			
			if (valueInRow) return false;

			const valueInCol = allGrid
				.map(r => r[parseInt(column) - 1])
				.filter(c => Object.keys(c)[0] !== cell)
				.map(c => Object.values(c)[0])
				.includes(value);

			if (valueInCol) return false

			const valueInRegion = regionGridFlat
				.filter(region => region.map(r => Object.keys(r)).flat().includes(cell))
				.flat(2).filter(reg => Object.keys(reg)[0] !== cell)
				.map(c => Object.values(c)[0])
				.includes(value)
			
			if (valueInRegion) return false;
		}
		return true;
	}

  checkRowPlacement(puzzleString, row, column, value) {
    let dividedGrid = this.generateDividedGrid(puzzleString);

    const rowNum = row.toUpperCase().charCodeAt();

    const currentRow = dividedGrid[rowNum - 65].map(cell => Object.values(cell)[0]);

    return !currentRow.includes(value.toString()) ? true : false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let dividedGrid = this.generateDividedGrid(puzzleString);

    // Witchcraft!
    const currentCol = dividedGrid.map(r => Object.values(r[parseInt(column) - 1])[0]);

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

    const currentRegion = regionGridFlat.filter(
      region => region.map(cell => Object.keys(cell)).flat().includes(cellKey)
    ).flat(2);

    const currentRegionValues = currentRegion.map(cell => Object.values(cell)).flat();

    return !currentRegionValues.includes(value.toString()) ? true : false;
  }

  solve(puzzleString) {
		if (!this.checkEmptySlot(puzzleString)) return puzzleString;

		let a = this.generateGrid(puzzleString);
		let puzzle = {}
		a.map(cell => puzzle[Object.keys(cell)[0]] = Object.values(cell)[0]);

		for (let cell in puzzle) {
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
		}

		let solvedRound = Object.values(puzzle).join('');

		if (this.checkEmptySlot(solvedRound)) return this.solve(solvedRound);

		console.log(solvedRound)
		return { solution: solvedRound }
  }
}

module.exports = SudokuSolver;

