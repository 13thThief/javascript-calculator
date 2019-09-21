/* Note to the auditing team, the display of
calculator in the project and the freeCodeCamp
sample project may look similar, that is because
while keeping the color scheme same, I have redone
the layout in CSS Grid (and as you can see, some 
parts are not proper). I hope that this means
no plagarism? If so, please contact me. Thank you */

import React from 'react';
import './App.css';

// Layout order
const buttons = {
  clear: 'AC',
  divide: '/',
  multiply: 'x',
  seven: '7',
  eight: '8',
  nine: '9',
  subtract: '-',
  four: '4',
  five: '5',
  six: '6',
  add: '+',
  one: '1',
  two: '2',
  three: '3',
  equals: '=',
  zero: '0',
  decimal: '.'
};

// Expression / Input
class DisplayInput extends React.Component {
  render() {
    return <div className='displayInput'>{this.props.value}</div>;
  }
}

// Value / Output
class DisplayOutput extends React.Component {
  render() {
    return (
      <div id='display' className='displayOutput'>
        {this.props.value}
      </div>
    );
  }
}

class Button extends React.Component {
  render() {
    const id = this.props.buttonID;
    return (
      <button
        id={id}
        value={this.props.buttonValue}
        className='button'
        style={{ 'grid-area': id }}
        onClick={this.props.handleClick}
      >
        {buttons[id]}
      </button>
    );
  }
}

let defaultState = {
  expression: '',
  currentValue: 0,
  previousValue: 0,
  isDecimal: false,
  isOperator: false,
  isZero: true,
  operator: null,
  evaluated: false
};

class App extends React.Component {
  state = defaultState;

  evaluate = () => {
    if(!this.state.expression)
      return;

    let expression = this.state.expression.replace(/x/g, '*');

    // https://www.geeksforgeeks.org/round-off-a-number-upto-2-decimal-place-using-javascript/
    // Method 2
    let result = Math.round(eval(expression) * 100000000000) / 100000000000;
    this.setState(state => ({
      currentValue: result.toString(),
      previousValue: state.currentValue,
      evaluated: true
    }));
  };

  onClick = e => {
    let input = e.target.value;

    if (input === 'AC') {
      // reset
      this.setState(defaultState);
      return;
    } else if (input === '=') {
      // equals
      this.evaluate();
    } else if (input === '0') {
      // zero
      if (!this.state.expression) {
        this.setState(state => ({
          isZero: false,
          expression: ''
        }));
        return;
      }

      this.setState(state => ({
        isZero: true,
        expression: state.expression + input,
        currentValue: state.currentValue + input
      }));
    } else if (
      input === '+' ||
      input === '-' ||
      input === 'x' ||
      input === '/'
    ) {
      // operator
      if(!this.state.expression)
        return;

      if (this.state.evaluated) {
        this.setState(state => ({
          expression: state.currentValue
        }));
      }

      let isNegative = input === '-';

      if (!this.state.isOperator) {
        this.setState(state => ({
          isOperator: true,
          expression: state.expression + input,
          currentValue: input,
          previousValue: state.currentValue,
          operator: input,
          isDecimal: false
        }));
      } else {
        if (/[+/x]-$/.test(this.state.expression)) {
          this.setState({
            expression:
              this.state.expression.slice(0, this.state.expression.length - 2) +
              input
          });
        }

        if (isNegative && this.state.operator !== '-') {
          this.setState(state => ({
            isOperator: true,
            expression: state.expression + input,
            currentValue: input,
            operator: input,
            isDecimal: false
          }));
          return;
        }

        if (this.state.operator === '-') {
          return;
        }

        this.setState(state => ({
          isOperator: true,
          expression:
            state.expression.slice(0, state.expression.length - 1) + input,
          currentValue: input,
          operator: input,
          isDecimal: false
        }));
      }
    } else if (input === '.') {
      // decimal
      !this.state.isDecimal &&
        this.setState(state => ({
          isDecimal: true,
          expression: !state.expression
            ? '0' + input
            : state.expression + input,
          currentValue: state.currentValue + input
        }));
    } else {
      // number
      if (this.state.expression === '' && this.state.currentValue === 0) {
        this.setState(state => ({
          expression: input,
          currentValue: input
        }));
        return;
      }

      this.setState(state => ({
        expression: state.expression + input,
        currentValue:
          state.isDecimal || !state.isOperator
            ? state.currentValue + input
            : input,
        isOperator: false
      }));
    }
  };

  componentDidMount() {
    const script = document.createElement('script');
    script.src =
      'https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js';
    document.body.appendChild(script);
  }

  render() {
    let buttonArray = [];
    for (let key in buttons) {
      let button = (
        <Button
          key={key}
          buttonID={key}
          buttonValue={buttons[key]}
          handleClick={this.onClick}
        />
      );
      buttonArray.push(button);
    }
    return (
      <div className='container'>
        <DisplayInput value={this.state.expression} />
        <DisplayOutput value={this.state.currentValue} />
        <div className='buttonGrid'>{buttonArray}</div>
      </div>
    );
  }
}

export default App;
