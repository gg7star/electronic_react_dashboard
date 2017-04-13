import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

import {
  Table,
  TableBody,
  TableHeader,
  TableFooter,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import ItemUpdate from './ItemUpdate';
import ItemDrawer from './ItemDrawer';
import ItemSetupContainer from '././../../containers/ItemSetupContainer';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Delete from 'material-ui/svg-icons/action/delete';
import Cancel from 'material-ui/svg-icons/content/clear';
import FilterList from 'material-ui/svg-icons/content/filter-list';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Search from 'material-ui/svg-icons/action/search';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import ArrowDropLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowDropRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import More from 'material-ui/svg-icons/navigation/more-horiz';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import styles from './styles';

@Radium
export default class Inventory extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    selectedItems: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    suppliers: PropTypes.array.isRequired,
    isDeletionEnabled: PropTypes.bool.isRequired,
    rowItemEdit: PropTypes.number.isRequired,
  }

  constructor() {
    super();

    this.state = {
      selectedRows: [],
      isDrawerOpen: false,
      selectedItem: -1,
      selectedItemTemp: -1,
    };
  }

  componentWillMount() {
    const { actions, } = this.props;

    actions.fetchListenToInventory();
  }

  componentWillUnmount() {
    const { actions, } = this.props;

    actions.removeListenersToInventory();
  }

  selectRows = (rowIndex) => {
    const { actions } = this.props;

    this.setState({ selectedRows: rowIndex });

    if (rowIndex === 'all') actions.selectAllItems();
    else if (rowIndex === 'none') actions.unselectAllItems();
    else actions.selectItems(rowIndex);
  }

  removeSelectedItems = (e) => {
    const { actions, selectedItems } = this.props;

    e.preventDefault();
    actions.removeItems(selectedItems);
    actions.toggleDeletion();
  }

  handleItemDrawer = (id) => {
    if (this.state.selectedItemTemp === id) {
      this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
    } else {
      this.setState({ isDrawerOpen: true, selectedItemTemp: id });
    }
  };

  render() {
    const { actions, categories, items, selectedItems, isDeletionEnabled, rowItemEdit, brands, suppliers, initialValues, selectedIndex, } = this.props;

    const ItemSelectedLength = () => (
      <div style={styles.selectedLength}>
        <FlatButton
          label="Cancel"
          onTouchTap={actions.toggleDeletion}
          secondary
        />
        {isDeletionEnabled
          ? (
            <FlatButton
              label={`Delete selected ${selectedItems.length > 1 ? 'items' : 'item'} (${selectedItems.length})`}
              onTouchTap={isDeletionEnabled ? this.removeSelectedItems : null}
              primary
            />
          )
          : null}
      </div>
    );

    return (
      <div style={styles.container}>
        <Paper zDepth={1} className="col-xs-11" style={{ padding: 0 }}>
          <ItemDrawer
            open={this.state.isDrawerOpen}
            item={items[this.state.selectedItem]}
            items={items}
            actions={actions}
            closeItemDrawer={() => this.setState({ isDrawerOpen: false })}
            updateItem={actions.updateItem}
            itemsName={items.map((item) => item.name)}
            initialValues={initialValues}
            loadInitialValues={actions.loadInitialValues}
            selectedIndex={selectedIndex}
          />
          <Table
            height="65vh"
            onRowSelection={this.selectRows}
            multiSelectable={isDeletionEnabled}
            onCellClick={(rowNumber) => this.setState({ selectedItem: rowNumber })}
            style={{ overflow: 'auto' }}
            fixedHeader
            fixedFooter
          >
            <TableHeader
              adjustForCheckbox={isDeletionEnabled}
              displaySelectAll={isDeletionEnabled}
            >
              <TableRow onTouchTap={(e) => e.preventDefault()} >
                <TableHeaderColumn colSpan="7">
                  <div style={styles.superheader}>
                    {isDeletionEnabled
                    ? <ItemSelectedLength />
                    : (
                      <div style={{ display: 'inline-flex' }}>
                        <ItemSetupContainer disabled={rowItemEdit !== -1} />
                        <FlatButton
                          label="Remove"
                          onTouchTap={actions.toggleDeletion}
                          disabled={rowItemEdit !== -1}
                          primary
                        />
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'inline-flex', width: '30vw' }}>
                        <TextField
                          hintText="Search by item name"
                          onChange={(e) => actions.searchItem(e.target.value.trim())}
                          fullWidth
                        />
                        <IconMenu
                          label="Filter"
                          iconButtonElement={
                            <IconButton
                              tooltip="Filter"
                              tooltipStyles={{ fontSize: 12.5 }}
                              style={{ height: 41, padding: 0, }}
                            >
                              <FilterList />
                            </IconButton>
                          }
                        >
                          <MenuItem
                            primaryText="All"
                            style={{ textAlign: 'center' }}
                            disabled={rowItemEdit !== -1}
                            onTouchTap={() => actions.changeFilter('All')}
                          />
                          <Divider inset />
                          <MenuItem
                            primaryText="Category"
                            leftIcon={<ArrowDropLeft />}
                            menuItems={
                              categories.map((cat) => (
                                <MenuItem
                                  value={cat}
                                  primaryText={cat}
                                  onTouchTap={() => actions.changeFilter('category', cat)}
                                />))}
                          />
                          <MenuItem
                            primaryText="Brand"
                            leftIcon={<ArrowDropLeft />}
                            menuItems={
                              brands.map((brand) => (
                                <MenuItem
                                  value={brand}
                                  primaryText={brand}
                                  onTouchTap={() => actions.changeFilter('brand', brand)}
                                />)
                            )}
                          />
                          <MenuItem
                            primaryText="Supplier"
                            leftIcon={<ArrowDropLeft />}
                            menuItems={
                              suppliers.map((sup) => (
                                <MenuItem
                                  value={sup}
                                  primaryText={sup}
                                  onTouchTap={() => actions.changeFilter('supplier', sup)}
                                />)
                            )}
                          />
                        </IconMenu>
                      </div>
                    </div>
                  </div>
                </TableHeaderColumn>
              </TableRow>
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Item Name</TableHeaderColumn>
                <TableHeaderColumn>Product Cost</TableHeaderColumn>
                <TableHeaderColumn>Selling Price</TableHeaderColumn>
                <TableHeaderColumn>Stock</TableHeaderColumn>
                <TableHeaderColumn>More</TableHeaderColumn>
                <TableHeaderColumn />
              </TableRow>
              <LinearProgress
                style={{
                  display: items.length ? 'none' : 'block',
                  width: '84vw',
                }}
              />
            </TableHeader>
            <TableBody
              displayRowCheckbox={isDeletionEnabled}
              deselectOnClickaway={false}
              stripedRows
            >
              {items.length
              ? items[0] === 'None'
                ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '84vw',
                      height: '60vh',
                    }}
                  >
                    <h1 style={{ color: '#9e9e9e' }}>No Items</h1>
                  </div>
                )
                : null
              : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '84vw',
                    height: '60vh',
                  }}
                >
                  <h1 style={{ color: '#9e9e9e' }}>Loading Items...</h1>
                </div>
              )}
              {items.map((item, i) => {
                if (item === 'None') {
                  return null;
                }

                if (rowItemEdit === i && !this.state.isDrawerOpen) {
                  return (
                    <ItemUpdate
                      key={item.id}
                      item={item}
                      items={items}
                      actions={actions}
                      initialValues={initialValues}
                      selected={this.state.selectedRows.includes(i)}
                      itemsName={items.map(({ name }) => name)}
                      selectedIndex={i}
                    />
                  );
                }

                return ( // TODO: select all checkboxes is throws an error map undefined
                  <TableRow key={item.id} selected={this.state.selectedRows.includes(i)}>
                    <TableRowColumn>{item.id}</TableRowColumn>
                    <TableRowColumn>{item.name}</TableRowColumn>
                    <TableRowColumn>{item.cost}</TableRowColumn>
                    <TableRowColumn>{item.sellingPrice}</TableRowColumn>
                    <TableRowColumn>{item.stock} / {item.initialStock}</TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={() => this.handleItemDrawer(item.id)} touch>
                        <More />
                      </IconButton>
                    </TableRowColumn>
                    <TableRowColumn>
                      {this.state.isDrawerOpen
                        ? null
                        : (
                          <IconButton onTouchTap={() => actions.editRowItem(i)} touch>
                            <ModeEdit />
                          </IconButton>
                        )
                      }
                    </TableRowColumn>
                    <Table />
                  </TableRow>
                );
              })}
            </TableBody>
            {/** <TableFooter>
              <TableRow>
                <TableRowColumn />
                <TableRowColumn />
                <TableRowColumn />
                <TableRowColumn />
                <TableRowColumn />
                <TableRowColumn />
                <TableRowColumn>
                  <IconButton touch>
                    <ArrowDropLeft />
                  </IconButton>
                  <IconButton touch>
                    <ArrowDropRight />
                  </IconButton>
                </TableRowColumn>
              </TableRow>
            </TableFooter> **/}
          </Table>
        </Paper>
      </div>
    );
  }
}
