import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Radium from 'radium';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import styles from './styles';

@Radium
@reduxForm({
  form: 'new_account',
  fields: [
    'name',
    'photo',
    'mobile',
    'email',
    'password',
  ]
})
export default class AccountSetup extends Component {
  static propTypes = {
  }

  constructor() {
    super();

    this.state = { openDialog: false };
  }

  _handleDialogState = (e) => {
    e.preventDefault();
    this.setState({ openDialog: !this.state.openDialog });
  }

  _addNewAccount = (e) => {
    const { newAccount, values, editAccount, } = this.props;

    e.preventDefault();
    newAccount(values);
    this.setState({ showForm: !this.state.showForm });
    editAccount('');
  }

  render() {
    const {
      fields,
      account,
    } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this._handleDialogState}
        primary
      />,
      <FlatButton
        type="submit"
        label="Submit"
        onTouchTap={this._addNewAccount}
        primary
      />
    ];

    return (
      <div style={styles.addNew}>
        <IconButton
          onTouchTap={this._handleDialogState}
          iconStyle={styles.largeIcon}
          style={styles.large}
        >
          <AddCircleOutline />
        </IconButton>
        <Dialog
          title="Account Setup"
          actions={actions}
          open={this.state.openDialog}
          contentStyle={styles.dialog}
          titleStyle={styles.title}
          autoScrollBodyContent
        >
          <form onSubmit={this._addNewAccount}>
            <TextField
              {...fields.name}
              floatingLabelText="Name"
              fullWidth
            />
            <br />
            <TextField
              {...fields.photo}
              type="file"
              value={null}
              floatingLabelText="Photo"
              fullWidth
            />
            <br />
            <TextField
              {...fields.mobile}
              floatingLabelText="Mobile"
              fullWidth
            />
            <br />
            <TextField
              {...fields.email}
              floatingLabelText="Email"
              fullWidth
            />
            <br />
            <TextField
              {...fields.password}
              floatingLabelText="Password"
              fullWidth
            />
            <input className="hidden" type="submit" />
          </form>
        </Dialog>
      </div>
    );
  }
}
