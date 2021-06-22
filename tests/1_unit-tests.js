const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

const puzzles = puzzlesAndSolutions.map(p => ({ puzzle: p[0], solution: p[1] }));

suite('UnitTests', () => {
	test('Validates 81 characters in puzzle', done => {
		let puzzle = puzzles[0].puzzle;
		assert.lengthOf(puzzle, 81);
		assert.equal(solver.validate(puzzle), puzzle);
		assert.isString(solver.validate(puzzle));
		done();
	});

	test('Handle invalid characters in puzzle', done => {
		let testPuzzle = puzzles[0].puzzle.replace(/./g, 'x');
		assert.isObject(solver.validate(testPuzzle));
		assert.property(solver.validate(testPuzzle), 'error');
		assert.equal(solver.validate(testPuzzle).error, 'Invalid characters in puzzle');
		done();
	});

	test('Handle puzzle length not equal to 81', done => {
		let testPuzzle = puzzles[0].puzzle.slice(0, 80);
		assert.isObject(solver.validate(testPuzzle));
		assert.property(solver.validate(testPuzzle), 'error');
		assert.equal(solver.validate(testPuzzle).error, 'Expected puzzle to be 81 characters long');
		done();
	});

	test('Handle valid row placement', done => {
		const puzzle = puzzles[0].puzzle;
		const rowChecker = solver.checkRowPlacement(puzzle, 'A', 2, 3);
		assert.isBoolean(rowChecker)
		assert.isTrue(rowChecker);
		done();
	});

	test('Handle invalid row placement', done => {
		const puzzle = puzzles[0].puzzle;
		const rowChecker = solver.checkRowPlacement(puzzle, 'D', 1, 9);
		assert.isBoolean(rowChecker)
		assert.isFalse(rowChecker);
		done();
	});

	test('Handle valid column placement', done => {
		const puzzle = puzzles[0].puzzle;
		const columnChecker = solver.checkColPlacement(puzzle, 'B', 1, 9);
		assert.isBoolean(columnChecker, 'Column validation returns a boolean');
		assert.isTrue(columnChecker, 'Column validation returns true');
		done();
	});

	test('Handle invalid column placement', done => {
		const puzzle = puzzles[0].puzzle;
		const columnChecker = solver.checkColPlacement(puzzle, 'c', 4, 6);
		assert.isBoolean(columnChecker, 'Column validation returns a boolean');
		assert.equal(columnChecker, false,'Column validation returns false');
		done();
	});

	test('Handle valid region 3x3 grid placement', done => {
		const puzzle = puzzles[0].puzzle;
		const regionChecker = solver.checkRegionPlacement(puzzle, 'a', 2, 3);
		assert.isBoolean(regionChecker, 'Region placement check returns a boolean');
		assert.equal(regionChecker, true, 'Valid region placement returns true');
		done();
	});

	test('Handle invalid region (3x3) placement', done => {
		const puzzle = puzzles[0].puzzle;
		const regionChecker = solver.checkRegionPlacement(puzzle, 'a', 2, 6);
		assert.isBoolean(regionChecker, 'Invalid region placement check returns a boolean');
		assert.equal(regionChecker, false,'Invalid region placement returns false');
		done();
	});

	test('Valid puzzle strings pass the solver', done => {
		const puzzle = puzzles[0].puzzle;
		const solution = puzzles[0].solution
		const solve = solver.solve(puzzle);
		assert.isString(solve);
		assert.equal(solve, solution);
		done();
	});

	test('Invalid puzzles fail the solver', done => {
		const solve = solver.solve(puzzle);
		assert.isObject(solve);
		assert.property(solve, 'error')
		assert.equal(solve.error, 'Puzzle cannot be solved');
		assert.fail('Test not implemented');
		done();
	});

	test('Solver returns the expected solution for an incomplete puzzle', done => {
		assert.fail('Test not implemented');
		done();
	});
});
