import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import ArrowDropLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import FilterList from 'material-ui/svg-icons/content/filter-list';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import styles from './styles';

export default class ItemHistory extends Component {
  static propTypes = {
    name: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      filterProp: 'All',
      isFixed: false,
    };
  }

  componentDidMount() {
    const { item, actions, selectedIndex, } = this.props;

    actions.fetchItemHistory(selectedIndex, item.id);
    this.refs.container.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    const { item, actions, } = this.props;

    if (item.id !== nextProps.item.id) {
      actions.fetchItemHistory(nextProps.selectedIndex, nextProps.item.id);
    }
  }

  componentWillUnmount() {
    this.refs.container.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e) => {
    if (e.target.scrollTop >= 41) {
      if (!this.state.isFixed) {
        this.setState({ isFixed: true });
      }
    } else {
      if (this.state.isFixed && e.target.scrollTop !== 24) {
        this.setState({ isFixed: false });
      }
    }
  };

  render() {
    const { closeHistory, item = {}, item: { history = [] } } = this.props;

    return (
      <div ref="container" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <div style={{ position: 'relative', width: '100%', height: 41 }}>
          <Paper
            style={{
              position: this.state.isFixed ? 'fixed' : 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              zIndex: 2,
            }}
            ref="header"
          >
            <FlatButton
              label="Back"
              onTouchTap={closeHistory}
              secondary
            />
            <IconMenu
              iconButtonElement={
                <IconButton
                  tooltip="Filter"
                  tooltipStyles={{ fontSize: 12.5 }}
                  style={{ height: 41, padding: 0, }}
                >
                  <FilterList />
                </IconButton>
              }
              style={{ bottom: 5 }}
            >
              <MenuItem
                primaryText="All"
                style={{ textAlign: 'center' }}
                onTouchTap={() => this.setState({ filterProp: 'All' })}
              />
              <Divider />
              {Object.keys(item)
                .filter((itemProp) => history.some((his) => his.category === itemProp))
                .map((itemProp) => (
                  <MenuItem
                    value={itemProp}
                    primaryText={itemProp}
                    onTouchTap={() => this.setState({ filterProp: itemProp })}
                  />
                  )
                )}
            </IconMenu>
          </Paper>
        </div>
        <div style={history.length ? { display: 'none' } : styles.center}>
          <CircularProgress size={2} />
        </div>
        <div style={history[0] === 'None' ? styles.center : { display: 'none' }}>
          <h1 style={{ color: '#9e9e9e' }} >No Item History</h1>
        </div>
        <List style={{ display: history[0] !== 'None' ? 'block' : 'none' }}>
          {history
            .filter((his) => {
              if (this.state.filterProp !== 'All') {
                return his.category === this.state.filterProp;
              }

              return true;
            })
            .map(({ actor, oldVal, newVal, category, time, }) => {
              return (
                <div>
                  <ListItem
                    primaryText={time}
                    secondaryText={
                      <p style={styles.wordBreak}>
                        <span style={{ color: darkBlack }}>{actor}</span> --&nbsp;
                        {category}
                        <span style={styles.wordBreak}>New value: {newVal}</span>
                        <span style={styles.wordBreak}>Previous value: {oldVal}</span>
                      </p>
                    }
                    style={{
                      height: '100%'
                    }}
                    secondaryTextLines={2}
                  />
                  <Divider />
                </div>
              );
            })}
        </List>
      </div>
    );
  }
}
