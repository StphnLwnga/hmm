const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solvedPuzzles = puzzlesAndSolutions

suite('Functional Tests', () => {

	suite('POST /api/solve test suite', () => {

		test('Solve a puzzle with a valid string', done => {
			let puzzle = solvedPuzzles[0][0];
			let solution = solvedPuzzles[0][1];
			chai.request(server)
				.post('/api/solve')
				.send({ puzzle })
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body)
					assert.property(res.body, 'solution');
					assert.isString(res.body.solution);
					assert.equal(res.body.solution, solution);
					done();
				});
		});

		test('Solve a puzzle with missing puzzle string', done => {
			let puzzle = '';
			let value = 9
			chai.request(server)
				.post('/api/solve')
				.send({
					coordinate: 'A3',
					value
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body)
					assert.property(res.body, 'error');
					assert.isString(res.body.error);
					assert.equal(res.body.error, 'Required field missing');
					assert.fail('Missing solve method')
					done();
				});
		});

		test('Solve a puzzle with invalid characters', done => {
			let puzzle = solvedPuzzles[0][0].replace(/./g, 'x');
			chai.request(server)
				.post('/api/solve')
				.send({ puzzle })
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body)
					assert.property(res.body, 'error');
					assert.isString(res.body.error);
					assert.equal(res.body.error, 'Invalid characters in puzzle');
					done();
				});
		});

		test('Solve a puzzle with incorrect length', done => {
			let puzzle = solvedPuzzles[0][0].slice(0, 80);
			chai.request(server)
				.post('/api/solve')
				.send({ puzzle })
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body)
					assert.property(res.body, 'error');
					assert.isString(res.body.error);
					assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
					done();
				});
		});

		test('Solve a puzzle that cannot be solved', done => {
			let puzzle = solvedPuzzles[0][0].replace(/1/, 2);
			chai.request(server)
				.post('/api/solve')
				.send({ puzzle })
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body)
					assert.property(res.body, 'error');
					assert.isString(res.body.error);
					assert.equal(res.body.error, 'Puzzle cannot be solved');
					done();
				});
		});

	});

	suite('POST /api/check test suite', () => {

		test('Check a puzzle placement with all fields', done => {
			let puzzle = solvedPuzzles[0][0];
			let value = solvedPuzzles[0][1][1]
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle,
					coordinate: 'A2',
					value
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.isTrue(res.body.valid);
					assert.notProperty(res.body, 'conflict');
					done();
				});
		});

		test('Check a puzzle placement with single placement conflict', done => {
			let puzzle = solvedPuzzles[0][0];
			let value = 9
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle,
					coordinate: 'A2',
					value
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.isFalse(res.body.valid);
					assert.property(res.body, 'conflict');
					assert.lengthOf(res.body.conflict, 1);
					done();
				});
		});

		test('Check a puzzle placement with multiple placement conflicts', done => {
			let puzzle = solvedPuzzles[0][0];
			let value = 7
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle,
					coordinate: 'B2',
					value
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.isFalse(res.body.valid);
					assert.property(res.body, 'conflict');
					assert.isAbove(res.body.conflict.length, 1);
					done();
				});
		});

		test('Check a puzzle placement with all placement conflicts', done => {
			let puzzle = solvedPuzzles[0][1];
			let value = 2;
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle,
					coordinate: 'B2',
					value
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.isFalse(res.body.valid);
					assert.property(res.body, 'conflict');
					assert.lengthOf(res.body.conflict, 3);
					['row', 'column', 'region'].every(conflict => assert.include(res.body.conflict, conflict));
					done();
				});
		});

		test('Check a puzzle placement with missing required fields', done => {
			let puzzle = solvedPuzzles[0][0];
			let value = solvedPuzzles[0][1][1];
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle,
					value
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, 'error');
					assert.equal(res.body.error, 'Required field(s) missing');
					done();
				});
		});

		test('Check a puzzle placement with invalid characters', done => {
			let puzzle = solvedPuzzles[0][0].replace(/./g, 'x');
			let value = solvedPuzzles[0][1][1];
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle,
					coordinate: 'A2',
					value
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, 'error');
					assert.equal(res.body.error, 'Invalid characters in puzzle');
					done();
				});
		});

		test('Check a puzzle placement with incorrect length', done => {
			let puzzle = solvedPuzzles[0][0].slice(0, 80);
			let value = solvedPuzzles[0][1][1];
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle,
					coordinate: 'A2',
					value
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, 'error');
					assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
					done();
				});
		});

		test('Check a puzzle placement with invalid placement coordinate', done => {
			let puzzle = solvedPuzzles[0][0];
			let value = solvedPuzzles[0][1][1];
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle,
					coordinate: 'j0',
					value
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, 'error');
					assert.equal(res.body.error, 'Invalid coordinate');
					done();
				});
		});

		test('Check a puzzle placement with invalid placement value', done => {
			let puzzle = solvedPuzzles[0][0];
			let value = 10;
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle,
					coordinate: 'A2',
					value
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, 'error');
					assert.equal(res.body.error, 'Invalid value');
					done();
				});
		});

	});

});

