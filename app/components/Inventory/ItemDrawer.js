import React, { Component, PropTypes } from 'react';

import ItemUpdate from './ItemUpdate';
import ItemHistory from './ItemHistory';

import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';

import styles from './styles';

export default class ItemDrawer extends Component {
  constructor() {
    super();

    this.state = {
      isEditing: false,
      isHistoryShowed: false,
      isFixed: false,
    };
  }

  componentDidMount() {
    this.refs.container.addEventListener('scroll', this.handleScroll);
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
    const { open, items, item = {}, initialValues, actions, closeItemDrawer, selectedIndex, } = this.props;

    return (
      <Drawer
        width={350}
        open={open}
        openSecondary
      >
        <div style={styles.itemDrawer}>
          {(() => {
            if (this.state.isEditing) {
              return (
                <Drawer
                  width={350}
                  open={open}
                  docked={false}
                  onRequestChange={() => {
                    this.setState({ isEditing: false });
                    closeItemDrawer();
                  }}
                  openSecondary
                >
                  <ItemUpdate
                    {...this.props}
                    cancelEditing={() => this.setState({ isEditing: false })}
                    selectedIndex={selectedIndex}
                    items={items}
                    isItemDrawerEdit
                  />
                </Drawer>
              );
            }

            if (this.state.isHistoryShowed) {
              return (
                <ItemHistory
                  item={item}
                  selectedIndex={selectedIndex}
                  actions={actions}
                  closeHistory={() => this.setState({ isHistoryShowed: false })}
                />
              );
            }

            return (
              <div ref="container" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                <div style={{ position: 'relative', width: '100%', height: 41 }}>
                  <Paper
                    ref="header"
                    style={
                      this.state.isFixed
                      ? { ...styles.itemDrawerTopButtons, position: 'fixed' }
                      : styles.itemDrawerTopButtons
                    }
                  >
                    <FlatButton
                      onTouchTap={closeItemDrawer}
                      label="Hide"
                      secondary
                    />
                    <FlatButton
                      onTouchTap={(e) => {
                        e.stopPropagation();
                        this.setState({ isHistoryShowed: true });
                      }}
                      label="Show History"
                      labelColor="#009688"
                      primary
                    />
                  </Paper>
                </div>
                <List style={styles.itemPropsList}>
                  <ListItem
                    primaryText="ID"
                    secondaryText={item.id}
                  />
                  <ListItem
                    primaryText="Item Name"
                    secondaryText={item.name}
                  />
                  <ListItem
                    primaryText="Stock"
                    secondaryText={item.stock}
                  />
                  <ListItem
                    primaryText="Product Cost"
                    secondaryText={item.cost}
                  />
                  <ListItem
                    primaryText="Selling Price"
                    secondaryText={item.sellingPrice}
                  />
                  <ListItem
                    primaryText="Category"
                    secondaryText={item.category || 'None'}
                  />
                  <ListItem
                    primaryText="Brand"
                    secondaryText={item.brand || 'None'}
                  />
                  <ListItem
                    primaryText="Supplier"
                    secondaryText={item.supplier || 'None'}
                  />
                  <ListItem
                    primaryText="Feet"
                    secondaryText={item.feet || 'None'}
                  />
                  <ListItem
                    primaryText="Description"
                    secondaryText={item.description || 'None'}
                  />
                  {/**
                    item.image
                    ? (
                      <ListItem>
                        <h4 style={{ margin: '5px 0 5px 0' }}>Item Image</h4>
                        <img src={item && item.image} alt={item && item.name} width="250" height="200" />
                      </ListItem>
                      )
                    : null
                  **/}
                </List>
                <RaisedButton
                  onTouchTap={() => this.setState({ isEditing: true })}
                  label="Edit"
                  style={styles.itemDrawerEditButton}
                  primary
                />
              </div>
            );
          })()}
        </div>
      </Drawer>
    );
  }
}
