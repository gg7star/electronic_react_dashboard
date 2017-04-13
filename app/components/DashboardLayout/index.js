import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Radium from 'radium';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import Notifications from 'material-ui/svg-icons/social/notifications';
import Accounts from 'material-ui/svg-icons/social/people';
import Close from 'material-ui/svg-icons/navigation/close';
import Apps from 'material-ui/svg-icons/navigation/apps';
import Cart from 'material-ui/svg-icons/action/shopping-cart';
import Folder from 'material-ui/svg-icons/file/folder';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import { clearCart } from './../../redux/modules/cart';

const styles = {
  bodyStyle: {
    width: '100%',
    height: '100vh',
    backgroundColor: '#EDECEC',
    overflow: 'hidden',
  },
  sideNav: {
    width: '100%',
  },
  mainContent: {
    height: '91vh',
    overflowY: 'auto',
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  hide: {
    display: 'none'
  },
  menuSpanWidth: {
    width: '50%',
  }
};

@Radium
@connect()
export default class DashboardLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render() {
    const { location, params, } = this.props;
    return (
      <div style={styles.bodyStyle}>
        <AppBar
          title={
            params.timestamp
            ? `Change Items - ${new Date(params.timestamp.slice(0, -3) * 1000).toLocaleString()}`
            : location.pathname.replace('/', '')
          }
          iconElementLeft={
            params.timestamp
            ? (
              <Link to="/Activities">
                <IconButton onTouchTap={() => this.props.dispatch(clearCart())}>
                  <Close color="white" />
                </IconButton>
              </Link>
            ) : (
              <IconMenu
                iconButtonElement={
                  <IconButton>
                    <Apps color="white" />
                  </IconButton>
                }
              >
                <Link to="/Inventory">
                  <MenuItem>
                    <div style={styles.menuItem}>
                      <Folder />
                      <span style={styles.menuSpanWidth}>Inventory</span>
                    </div>
                  </MenuItem>
                </Link>
                <Link to="/Activities">
                  <MenuItem>
                    <div style={styles.menuItem}>
                      <Notifications />
                      <span style={styles.menuSpanWidth}>Activities</span>
                    </div>
                  </MenuItem>
                </Link>
                {/** <Link to="/Analytics">
                  <MenuItem>
                    <div style={styles.menuItem}>
                      <ShowChart />
                      <span style={styles.menuSpanWidth}>Analytics</span>
                    </div>
                  </MenuItem>
                </Link> **/}
                <Link to="/Cashier">
                  <MenuItem>
                    <div style={styles.menuItem}>
                      <Cart />
                      <span style={styles.menuSpanWidth}>Cashier</span>
                    </div>
                  </MenuItem>
                </Link>
                <Link to="/Accounts">
                  <MenuItem>
                    <div style={styles.menuItem}>
                      <Accounts />
                      <span style={styles.menuSpanWidth}>Accounts</span>
                    </div>
                  </MenuItem>
                </Link>
              </IconMenu>
            )
          }
          onLeftIconButtonTouchTap={this.toggleDrawer}
          style={styles.appbar}
        />
        <div
          id="children"
          className="col-md-12"
          style={styles.mainContent}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
