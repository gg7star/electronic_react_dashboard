import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class SummaryModal extends Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor() {
    super();

    this.state = {
      cash: 0,
      discount: 0,
      error: '',
    };
  }

  render() {
    const { cartItems, isOpen, handleCancel, handleSubmit, cartTotal } = this.props;
    const change = this.state.cash - cartTotal;

    return (
      <div>
        <Dialog
          actions={[
            <FlatButton
              label="Cancel"
              onTouchTap={handleCancel}
              style={{ marginRight: 10 }}
              secondary
            />,
            <RaisedButton
              label="Submit"
              onTouchTap={() => {
                if (change >= 0) {
                  handleSubmit(change);
                }
              }}
              keyboardFocused
              primary
            />
          ]}
          open={isOpen}
          autoScrollBodyContent
        >
          {cartItems.map((item) => {
            return <h3>{item.name} {item.sellingPrice} x{item.quantity} = {item.sellingPrice * item.quantity}</h3>;
          })}
          <hr />
          <h2>
            Cash: {this.state.cash}
          </h2>
          <h2>
            Total {cartTotal}
          </h2>
          <h2>
            Change: {change}
          </h2>
          <TextField
            floatingLabelText="Cash"
            type="number"
            errorText={this.state.error}
            onChange={(e) => {
              this.setState({
                cash: e.target.value,
                error: e.target.value - cartTotal < 0 ? 'Insufficient cash' : '',
              })
            }}
          />
        </Dialog>
      </div>
    );
  }
}
