import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

import AccountSetup from './AccountSetup';
import Paper from 'material-ui/Paper';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import Lock from 'material-ui/svg-icons/action/lock';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';

const styles = {
  accountContainer: {
    display: 'flex',
    height: '90vh',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  paper: {
    width: 310,
    height: 300,
    marginTop: 20,
  }
};

@Radium
export default class Accounts extends Component {
  static propTypes = {

  }

  componentWillMount() {
    this.props.actions.fetchAllAccounts();
  }

  render() {
    const { actions, users, } = this.props;

    const IconButtonElement = (
      <IconButton
        tooltip="more"
        tooltipPosition="bottom-left"
        touch
      >
        <MoreVertIcon />
      </IconButton>
    );

    return (
      <div style={styles.accountContainer}>
        {users.map((account) => (
          <Paper style={styles.paper}>
            <List>
              <ListItem
                leftAvatar={
                  <Avatar
                    src={account.photo}
                    size={45}
                  />
                }
                rightIconButton={
                  <IconMenu iconButtonElement={IconButtonElement}>
                    <MenuItem onTouchTap={() => actions.editAccount(account.email)}>Edit</MenuItem>
                    <MenuItem onTouchTap={() => actions.removeAccount(account)}>Remove</MenuItem>
                  </IconMenu>
                }
                primaryText={account.name}
                secondaryText="Name"
                disable
              />
              <Divider inset />
              <ListItem
                leftIcon={<CommunicationCall />}
                primaryText={account.mobile}
                secondaryText="Mobile"
              />
              <ListItem
                leftIcon={<CommunicationEmail />}
                primaryText={account.email}
                secondaryText="Email"
              />
              <ListItem
                leftIcon={<Lock />}
                primaryText={account.password}
                secondaryText="Password"
              />
            </List>
          </Paper>
        ))}
        <AccountSetup newAccount={actions.newAccount} editAccount={actions.editAccount} />
      </div>
    );
  }
}
