//Currently at "Showing the moves"

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className="square" style={props.style} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderBoardRow(boardRowCount) {
		let boardRowArray = [],
			self = this,
			rowStartIndex = 0;

		for (let i = 0; i < boardRowCount; i++) {
			boardRowArray.push(<div key={i} className="board-row">{self.renderRow(rowStartIndex, 3 )}</div>);
			rowStartIndex += 3;
		}
		return boardRowArray;
	}
	renderRow(rowStart, rowLength) {
		let i,
			rowElementArray = [],
			self = this,
			rowEnd = rowStart + rowLength
		for (i = rowStart; i < rowEnd; i++) {
			rowElementArray.push(self.renderSquare(i));
		}
		return rowElementArray;
	}
	renderSquare(i) {
		let squareStyle = {};
		let latestSquareStyle = {
			color: "red"
		};
		let winnerSquareStyle = {
			color: "yellow"
		}

		if (this.props.latestSquareIndex === i) {
			squareStyle = latestSquareStyle;
		}

		if ((this.props.winnerObject != undefined ) && (this.props.winnerObject.winSlots.includes(i))) {
			squareStyle = winnerSquareStyle;
		}

		return ( <Square key={i} value={this.props.squares[i]} style={squareStyle} onClick={() => this.props.onClick(i)}/> );
	}
	render() {
		/*return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);*/
		/*return (
			<div>
				<div className="board-row">
					{this.renderRow(0, 3)}
				</div>
				<div className="board-row">
					{this.renderRow(3, 3)}
				</div>
				<div className="board-row">
					{this.renderRow(6, 3)}
				</div>
			</div>
		);*/
		return (
			<div>
				{this.renderBoardRow(3)}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor () {
		super();
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				squareLocation: Array(9).fill(null),
				stepLocation: []
			}],
			stepNumber: 0,
			xIsNext: true,
			coordArray: [
				{x: "1", y: "1"},
				{x: "1", y: "2"},
				{x: "1", y: "3"},
				{x: "2", y: "1"},
				{x: "2", y: "2"},
				{x: "2", y: "3"},
				{x: "3", y: "1"},
				{x: "3", y: "2"},
				{x: "3", y: "3"}
			],
			isDescending: false
		};
	}
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const squareLocation = current.squareLocation.slice();
		let stepLocation = current.stepLocation;

		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		squareLocation[i] = this.state.coordArray[i];
		stepLocation.push(squareLocation[i]);
		this.setState({
			history: history.concat([{
				squares : squares,
				squareLocation: squareLocation,
				stepLocation: stepLocation
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			latestSquareIndex: i
		});
	}
	toggleSortOrder() {
		this.setState({
			isDescending: !this.state.isDescending
		})
	}
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winnerObject = calculateWinner(current.squares);
		const stepLocation = current.stepLocation;
		let movesList;

		const moves = history.map((step, move) => {
			const desc = move ? "Move #" + stepLocation[move - 1].x + "," + stepLocation[move - 1].y : "Game start";
			return (
					<li key={move}>
						<a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
					</li>
			);
		});

		movesList = <ol>{moves}</ol>
		if (this.state.isDescending) {
			moves.reverse();
			movesList = <ol reversed>{moves}</ol>
		}

		let status;
		if (winnerObject) {
			status = "Winner is " + winnerObject.winner;
		} else {
			status = "Next player is " + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} winnerObject={winnerObject} latestSquareIndex={this.state.latestSquareIndex} onClick={(i) => this.handleClick(i)}/>
				</div>
				<div className="game-info">
					<button onClick={() => this.toggleSortOrder()}>Reverse Order</button>
					<div>{status}</div>
					{movesList}
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	let resultObject = {};

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			resultObject.winSlots = [a, b, c];
			resultObject.winner = squares[a];
			return resultObject;
		}
	}

	return null;
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
