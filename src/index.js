import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import _ from "lodash";
import 'bootstrap/dist/css/bootstrap.min.css';

function Square(props) {
  return(
      <button className="square"
              onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

class Board extends React.Component {
  renderSquare(i,j) {
    return (<Square
              value={this.props.squares[i][j]}
              onClick={() => this.props.onClick(i,j)}
              />
            );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0,0)}
          {this.renderSquare(0,1)}
          {this.renderSquare(0,2)}
        </div>
        <div className="board-row">
          {this.renderSquare(1,0)}
          {this.renderSquare(1,1)}
          {this.renderSquare(1,2)}
        </div>
        <div className="board-row">
          {this.renderSquare(2,0)}
          {this.renderSquare(2,1)}
          {this.renderSquare(2,2)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: [
          [null, null, null],
          [null, null, null],
          [null, null, null]
        ],
        moveDesc: '',
      }],
      isXNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i,j){

    const history = [...this.state.history];
    const current = history[history.length-1];
    const squares = _.cloneDeep(current.squares);
    if (calculateWinner(squares) || squares[i][j] ) {
      return;
    }
    squares[i][j] = this.state.isXNext ? 'X' : 'O';


    this.setState({
      history: this.state.history.concat( [{
        squares: squares,
        moveDesc: "Placed an \"" + (this.state.isXNext ? 'X' : 'O') + "\" in row " + (i+1) + ", column " + (j+1),
      }] ),
      isXNext: !this.state.isXNext,
      stepNumber: history.length,
//      toggle: true,
      flexName: "Ascending"
    });

  }

  jumpTo(step) {
    this.setState({
      history: this.state.history.slice(0,step+1),
      stepNumber: step,
      isXNext: (step%2 === 0),
    });
  }

  reverseOrder(){
    this.setState({
        flexName: this.state.flexName === "Ascending" ? "Descending" : "Ascending",
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map( (step,move) => {
      const desc = move ?
        'Go To Move #' + move + ": " + history[move].moveDesc:
        'Start a New Game';
        return (
          <li key={move}>
            <button className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
    });



    let status;
    if (winner) {
      status = winner;
    } else {
      status = "Make a move player  " + (this.state.isXNext ? "X" : "O");
    }
    return (
      <div className="wrapper">
              <h1>Let's Play Tic-Tac-Toe!</h1>
                        <div className="status">{status}</div>
        <div className="game container-fluid">
          <div className="row">

          <div className="game-board col-sm">
            <Board
              squares={current.squares}
              onClick={(i,j) => this.handleClick(i,j)}
              />
          </div>

          <div className="game-info col-sm">
            <h4>Move History</h4>
            <ol className={this.state.flexName}>{moves}</ol>

          <button type="button"
                  className="btn btn-outline-dark"
                  onClick={() => this.reverseOrder()}>Reverse Order of Moves</button>

            </div>
          </div>
        </div>

      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {

  //look for horizontal wins
  for (let i=0; i<3; i++) {
    if (squares[i][0] === squares[i][1] && squares[i][1] === squares[i][2]) {
      if (!squares[i][0]) {
        return null;
      } else {
        return 'The winner is ' + squares[i][0];
      }
    }
  }
  //look for vertical wins
  for (let i=0; i<3; i++) {
    if (squares[0][i] === squares[1][i] && squares[0][i] === squares[2][1] && squares[1][i]=== squares[2][i]) {
      if (!squares[0][i]) {
        return null;
      } else {
        return 'The winner is ' + squares[0][i];
      }
    }
  }
  //look for diagonal wins (there are only 2 possibilities)
  if ( (squares[0][0] === squares[1][1] && squares[1][1]=== squares[2][2]) ||
      (squares[2][0] === squares[1][1] && squares [1][1] === squares[0][2]) ) {
        if ( !squares[1][1] ){
          return null;
        } else {
          return 'The winner is ' + squares[1][1];
        }
      }

  /*
  //check for draw
  let check = 0;
  for (let i=0; i<3; i++) {
    for (let j=0; j<3; j++) {
      if (!squares[i][j]) {
        check++;
      }
    }
  }
  if (check === 0 ) {
    return 'Game Over: DRAW!'
  } else {
    return null;
  }

*/
}
