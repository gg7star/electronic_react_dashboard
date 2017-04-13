import React, { PropTypes } from 'react';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Cancel from 'material-ui/svg-icons/content/clear';
import Return from 'material-ui/svg-icons/content/undo';
import DatePicker from 'material-ui/DatePicker';
import styles from './styles';

const PastActivities = () => {
  return (
    <div>
      <Toolbar>
        <ToolbarGroup firstChild>
          <ToolbarTitle text="Past Activities" />
        </ToolbarGroup>
        <ToolbarGroup>
          <IconButton
            onTouchTap={() => this.setState({ selectedDate: '' })}
            touch
          >
            <Cancel />
          </IconButton>
          <DatePicker
            locale="en-US"
            hintText="Select Date"
            mode="landscape"
            container="inline"
            formatDate={(date) => date.toDateString()}
            onChange={
              (e, date) => this.setState({
                selectedDate: date.toLocaleDateString().replace(/\//g, '-')
              })
            }
          />
        </ToolbarGroup>
      </Toolbar>
      <div style={styles.past}>
      {Object.keys(activities)
        .map((activity) => (activity !== new Date().toLocaleDateString().replace(/\//g, '-') ? activity : null))
        .filter((activity) => (this.state.selectedDate ? activity === this.state.selectedDate : activity))
        .map((dayMonth) => (
          <Paper style={styles.listPaper}>
            <List>
              <Subheader>
                ({dayMonth}) Total Profit: ₱ {Object.keys(activities[dayMonth])
                                                .filter((timestamp) => !activities[dayMonth][timestamp].changedCartTime)
                                                .map((timestamp) => activities[dayMonth][timestamp].cart
                                                  .map((item) => item.sellingPrice * item.quantity)
                                                  .reduce((p, c) => p + c))
                                                .reduce((p, c) => p + c, 0)}
              </Subheader>
              <Divider />
            {activities && Object.keys(activities[dayMonth]).map((timestamp) => {
              const activity = activities[dayMonth][timestamp];

              return (
                <ListItem
                  nestedItems={
                    activity.cart.map((item) => (
                      <ListItem
                        nestedItems={[
                          <ListItem>
                            Price: {`₱${item.sellingPrice}`}
                          </ListItem>,
                          <ListItem>
                            Subtotal: {`₱${item.quantity * item.sellingPrice}`}
                          </ListItem>,
                          <ListItem>
                            Remaining Stock/s: {item.stock}
                          </ListItem>
                        ]}
                        primaryTogglesNestedList
                      >
                        {item.name} x{item.quantity}
                      </ListItem>
                    ))
                  }
                  primaryTogglesNestedList
                >
                  <Link to={`/cashier/${timestamp}`}>
                    <IconButton
                      className={activity.changedCartTime ? 'hide' : ''}
                      touch
                    >
                      <ModeEdit />
                    </IconButton>
                  </Link>
                  <IconButton
                    onTouchTap={() => actions.toggleActivity(timestamp, 'refund')}
                    className={activity.changedCartTime ? 'hide' : ''}
                    touch
                  >
                    <Return />
                  </IconButton>
                  <span style={{ textDecoration: activity.changedCartTime ? 'line-through' : 'none' }}>
                    ({new Date(timestamp.slice(0, -3) * 1000).toLocaleTimeString()})
                    Cart Total: ₱ {activity.cart
                                    .map((item) => item.quantity * item.sellingPrice)
                                    .reduce((p, c) => p + c)}
                  </span>
                </ListItem>
              );
            })}
            </List>
          </Paper>
      ))}
      </div>
    </div>
  );
};

PastActivities.propTypes = {
};
