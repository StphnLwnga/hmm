'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      try {
        const { puzzle, coordinate, value } = req.body;

        if (!puzzle || puzzle === '' || !coordinate || coordinate === '' || !value || value === '')
          throw 'Required field(s) missing';

        if (coordinate.length !== 2 || /[^a-iA-I]/g.test(coordinate[0]) || /[^1-9]/g.test(coordinate[1]))
          throw 'Invalid coordinate';

        if (parseInt(value) < 1 || parseInt(value) > 9)
          throw 'Invalid value';

        let validPuzzle = solver.validate(puzzle);

        if (validPuzzle.error) throw validPuzzle.error;

        const data = {}
        const conflict = [];

        const row = coordinate[0];
        const column = coordinate[1];

        solver.checkRegionPlacement(validPuzzle, row, column, value)

        if (solver.checkValueInCell(validPuzzle, row, column, value)) {
          data.valid = true;
        } else {

          const rowPlace = solver.checkRowPlacement(validPuzzle, row, column, value);
          const colPlace = solver.checkColPlacement(validPuzzle, row, column, value);
          const regionPlace = solver.checkRegionPlacement(validPuzzle, row, column, value);

          if (!rowPlace) conflict.push('row');

          if (!colPlace) conflict.push('column');

          if (!regionPlace) conflict.push('region');

          data.valid = colPlace && rowPlace && regionPlace ? true : false;

          if (conflict.length > 0) { data.conflict = conflict; }
        }

        return res.json(data);
      } catch (error) {
        console.log(error)
        return res.json({ error })
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      try {
        let { puzzle } = req.body;
        // console.log(puzzle)

        const data = {};

        if (!puzzle) throw 'Required field missing';

        let validPuzzle = solver.validate(puzzle);

        if (validPuzzle.error) throw validPuzzle.error

        let solved = solver.solve(validPuzzle);

        // if (solved.error) throw 'Puzzle cannot be solved';

        // data.solution = solved;

        return res.json(data);

      } catch (error) {
        console.log(error)
        return res.json({ error })
      }
    });
};
