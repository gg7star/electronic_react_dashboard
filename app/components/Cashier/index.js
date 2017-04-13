import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import EventListener from 'react-event-listener';

import Paper from 'material-ui/Paper';
import { GridList, GridTile } from 'material-ui/GridList';
import AppBar from 'material-ui/AppBar';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Back from 'material-ui/svg-icons/hardware/keyboard-backspace';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';
import Cancel from 'material-ui/svg-icons/content/clear';
import ViewList from 'material-ui/svg-icons/action/view-list';
import Info from 'material-ui/svg-icons/action/info-outline';
import RemoveCart from 'material-ui/svg-icons/action/remove-shopping-cart';
import FilterList from 'material-ui/svg-icons/content/filter-list';
import Sort from 'material-ui/svg-icons/content/sort';
import DropDownMenu from 'material-ui/DropDownMenu';
import SummaryModal from './SummaryModal';
import styles from './styles';

@Radium
export default class Cashier extends Component {
  static propTypes = {
  }

  constructor() {
    super();

    this.state = {
      isQuantifying: false,
      isUpdating: false,
      selectedItem: {},
      quantity: 1,
      quantityError: '',
      searchText: '',
      currentFilter: 'All',
      currentSort: 'Price (ASC)',
      isSummaryOpen: false,
    };
  }

  componentDidMount() {
    const { params = {}, activities = {}, actions, items = [], } = this.props;

    if (params.timestamp) {
      const date = new Date(params.timestamp.slice(0, -3) * 1000)
        .toLocaleDateString()
        .replace(/\//g, '-');

      const activityCart = activities[date][params.timestamp].cart.map((rItem) => {
        const rItemIndex = items.findIndex((item) => item.id === rItem.id);

        return {
          ...rItem,
          stock: items[rItemIndex].stock
        };
      });


      actions.clearCart();
      actions.addCart(activityCart);
    }

    actions.fetchListenToInventory();
  }

  componentWillUnmount() {
    const { actions, } = this.props;

    actions.removeListenersToInventory();
  }

  toggleQuantifying = (prop = {}, isUpdating = false, next) => {
    const { state } = this;

    this.setState({
      isQuantifying: prop && !state.isQuantifying,
      selectedItem: prop,
      quantity: prop.quantity || 1,
      quantityError: '',
      isUpdating,
    });

    if (!isUpdating && next) {
      next(state.selectedItem);
    }
  }

  handleQuantity = (e = { target: { value: 1 } }) => {
    const { props: { activities, cart, params, }, state } = this;
    const value = +e.target.value;
    const stock = Math.floor(state.selectedItem.stock);

    if (value.toString().indexOf('.') === -1) {
      if (value > state.selectedItem.stock) {
        if (!state.quantityError) {
          if (stock === 0) {
            this.setState({
              quantity: value,
              quantityError: `${state.selectedItem.name} is currently out of stock`,
            });
          } else {
            this.setState({
              quantity: value,
              quantityError: `The maximum value is ${stock}`,
            });
          }
        }
      } else if (value === 0) {
        if (stock === 0) {
          this.setState({
            quantity: value,
            quantityError: `${state.selectedItem.name} is currently out of stock`,
          });
        } else {
          this.setState({
            quantity: value,
            quantityError: 'The minimum value is 1',
          });
        }
      } else {
        this.setState({
          quantity: value,
          quantityError: '',
        });
      }
    }
  }

  submitQuantity = (e) => {
    e.preventDefault();
    const {
      props: {
        activities,
        cart,
        params,
        actions,
      },
      state
    } = this;
    const item = {
      ...state.selectedItem,
      quantity: state.quantity
    };

    // if (params.timestamp) {
    //   const date = new Date(params.timestamp.slice(0, -3) * 1000)
    //     .toLocaleDateString()
    //     .replace(/\//g, '-');
    //   const getCartTotal = cart.length ? cart.map((item) => item.sellingPrice * item.quantity)
    //     .reduce((p, c) => p + c) + (item.quantity * item.sellingPrice) : item.quantity * item.sellingPrice;
    //   const getActivitiesCartTotal = activities[date][params.timestamp].cart
    //     .map((item) => item.sellingPrice * item.quantity)
    //     .reduce((p, c) => p + c);
    //
    //   if (getCartTotal > getActivitiesCartTotal) {
    //     this.setState({
    //       quantityError: `${getCartTotal} > ${getActivitiesCartTotal}`
    //     });
    //
    //     return;
    //   }
    // }

    if (!state.quantityError && state.selectedItem !== undefined) {
      actions.addCartItem(item);
      this.handleQuantity();
      this.toggleQuantifying();
    }
  }

  updateCartItem = (e) => {
    e.preventDefault();
    const { state } = this;
    const { actions } = this.props;

    if (!state.quantityError) {
      this.toggleQuantifying(false, null, (selectedItem) => {
        actions.updateCartItem(selectedItem.id, state.quantity);
        this.setState({ isUpdating: false });
      });
    }
  }

  submitCart = (change) => {
    const {
      props: {
        actions,
        activities,
        params,
        cart,
      },
      state,
    } = this;
    let activityCart = false;

    if (params.timestamp) {
      const date = new Date(params.timestamp.slice(0, -3) * 1000)
       .toLocaleDateString()
       .replace(/\//g, '-');

      activityCart = {
        cart: activities[date][params.timestamp].cart,
        timestamp: params.timestamp,
      };
    }

    if (!state.quantityError && cart.length !== 0) {
      actions.submitCart(cart, activityCart, (err, msg) => {
        if (err) actions.toggleSnackbar(`Error: ${err}`);
        else actions.toggleSnackbar(`${msg} was synced.`);
      });
    }
    this.setState({ isSummaryOpen: false });
  }

  handleSearch = (e) => {
    if (!this.state.isQuantifying && !this.state.isSummaryOpen) {
      if (e.which === 8) {
        this.setState({
          searchText: this.state.searchText.slice(0, -1)
        });
      }

      if (e.which === 27) {
        this.setState({
          searchText: ''
        });
      }

      if (e.which === 32 || e.which <= 90 && e.which >= 48) {
        this.setState({
          searchText: this.state.searchText + e.key
        });
      }
    }
  }

  render() {
    const {
      props: {
        cashier: {
          snackMessage,
          selectedFilter,
          selectedGroup
        },
        items,
        tiles = [],
        cart,
        actions,
        params,
      },
      state,
    } = this;

    const isCartItem = (id) => (
      cart.map((item) => item.id)
        .indexOf(id) > -1
    );

    const cartTotal = cart.reduce((p, c) => p + (c.quantity * c.sellingPrice), 0);

    return (
      <div>
        <SummaryModal
          cartItems={cart}
          handleSubmit={this.submitCart}
          handleCancel={() => this.setState({ isSummaryOpen: false })}
          isOpen={state.isSummaryOpen}
          cartTotal={cartTotal}
        />
        <EventListener target={document} onKeyUp={this.handleSearch} capture />
        <Snackbar
          open={snackMessage}
          message={snackMessage}
          autoHideDuration={4000}
          onRequestClose={() => actions.toggleSnackbar('')}
        />
        <Dialog
          title={`${state.selectedItem.name} Quantity`}
          open={state.isQuantifying}
          onRequestClose={this.toggleQuantifying}
          contentStyle={styles.quantity}
          titleStyle={styles.quantityTitle}
        >
          <form onSubmit={state.isUpdating ? this.updateCartItem : this.submitQuantity}>
            <TextField
              type="number"
              step="any"
              min={1}
              name="quantity"
              value={state.quantity}
              onChange={this.handleQuantity}
              onFocus={(e) => e.target.select()}
              errorText={state.quantityError}
              inputStyle={styles.quantityFont}
              fullWidth
              autoFocus
            />
            <RaisedButton
              type="submit"
              label="Done"
              primary
              style={{ width: '100%' }}
            />
            <h5 style={{ margin: 0 }}>
              Subtotal: ₱{state.quantity * state.selectedItem.sellingPrice}
              <span className="pull-right">
                Stock: {`${Math.floor(state.selectedItem.stock - state.quantity)}/${Math.floor(state.selectedItem.stock)}`}
              </span>
              {state.selectedItem.feet ?
                <span className="pull-right">
                  Feet: {`${Math.floor(state.quantity * state.selectedItem.feet)}ft/${Math.floor(state.selectedItem.totalFeet)}ft`}&nbsp;
                </span>
                : null
              }
            </h5>
          </form>
        </Dialog>
        <div className="col-md-9" style={styles.interface}>
          <div className="col-md-12" style={{ padding: 0, marginBottom: 15 }}>
            <AppBar
              title={
                <div>
                  {
                    selectedGroup
                    ? <span>{selectedGroup}&nbsp;</span>
                    : (<IconMenu
                        value={selectedFilter}
                        onItemTouchTap={(_, child) => {
                          actions.selectFilter(child.props.value);
                          this.setState({ currentFilter: child.props.primaryText });
                        }}
                        iconButtonElement={<IconButton><FilterList color="white" /></IconButton>}
                      >
                        <MenuItem value="all" primaryText="All" />
                        <MenuItem value="category" primaryText="Category" />
                        <MenuItem value="brand" primaryText="Brand" />
                        <MenuItem value="supplier" primaryText="Supplier" />
                      </IconMenu>)
                   }
                  {state.currentFilter}
                  <IconMenu
                    value={selectedFilter}
                    onItemTouchTap={(_, child) => {
                      actions.selectSort(child.props.value);
                      this.setState({ currentSort: child.props.primaryText });
                    }}
                    iconButtonElement={<IconButton><Sort color="white" /></IconButton>}
                  >
                    <MenuItem value="price_asc" primaryText="Price (ASC)" />
                    <MenuItem value="price_desc" primaryText="Price (DESC)" />
                    <MenuItem value="stock_asc" primaryText="Stock (ASC)" />
                    <MenuItem value="stock_desc" primaryText="Stock (DESC)" />
                  </IconMenu>
                  {state.currentSort}
                </div>
            }
              showMenuIconButton={selectedGroup !== ''}
              iconElementLeft={
                <IconButton onTouchTap={() => actions.selectGroup('')} touch>
                  <Back />
                </IconButton>
              }
              iconElementRight={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    paddingRight: 15,
                  }}
                >
                  <IconButton
                    onTouchTap={() => this.setState({ searchText: '' })}
                    className={state.searchText ? '' : 'hidden'}
                    touch
                  >
                    <Cancel color="white" />
                  </IconButton>
                  <p style={{ display: state.searchText ? 'block' : 'none' }}>
                    Searching for:&nbsp;
                  </p>
                  <h3 style={{ display: 'inline-block' }}>
                    {state.searchText}
                  </h3>
                </div>
              }
              style={{
                backgroundColor: '#00acc1',
              }}
            />
          </div>
          <div style={tiles.length > 0 ? styles.hide : styles.tilesLoader}>
            <CircularProgress size={240} thickness={6.5} />
          </div>
          <div className="col-md-12">
            <div style={styles.tilesContainer}>
              <GridList cellHeight={205} cols={4} padding={9}>
                {tiles.filter((tile) => RegExp(`(${state.searchText})+`, 'ig').test(tile.feet ? `${tile.feet}ft ${tile.name}` : tile.name || tile))
                  .map((tile, i) => (
                    <Paper
                      zDepth={2}
                      style={
                        isCartItem(tile.id)
                        ? styles.hide
                        : styles.gridTilePaper
                      }
                    >
                      <GridTile
                        key={i}
                        title={tile.name ? null : <span style={{ ...styles.gridTileTitle, fontSize: 'calc(8.3px + 1.5vw)' }}>{tile}</span>}
                        titlePosition={tile.name ? 'bottom' : 'top'}
                        onTouchTap={tile.name ? () => tile.stock && this.toggleQuantifying(tile) : () => actions.selectGroup(tile)}
                        style={styles.gridTile}
                        subtitle={
                          tile.sellingPrice
                            ? null
                            : (
                              <h3
                                style={{
                                  fontSize: 'calc(8.5px + 1vw)',
                                  lineHeight: '1',
                                  wordWrap: 'break-word',
                                  whiteSpace: 'pre-line',
                                  margin: 0,
                                }}
                              >
                                {items.filter((item) => item[selectedFilter] === tile).length} item/s
                              </h3>
                            )
                        }
                        actionIcon={
                          tile.name ?
                            (<IconButton onTouchTap={(e) => e.stopPropagation()} touch>
                              <Info color="#EEEEEE" />
                            </IconButton>) :
                            (<IconMenu
                              onTouchTap={(e) => e.stopPropagation()}
                              iconButtonElement={<IconButton><ViewList color="#EEEEEE" /></IconButton>}
                              touch
                            >
                              {items.filter((item) => item[selectedFilter] === tile && cart.map((cItem) => cItem.id)
                                .indexOf(item.id) === -1)
                                .map((item) => (
                                  <MenuItem
                                    key={item.id}
                                    onTouchTap={() => this.toggleQuantifying(item)}
                                    primaryText={item.feet ? `${item.feet}ft item.name` : item.name}
                                  />))}
                            </IconMenu>)
                        }
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            width: '100%',
                            height: '100%',
                            padding: '0 12px 2px 12px',
                          }}
                        >
                          {tile.name ? (
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexGrow: '1',
                                width: '100%',
                                fontSize: 'calc(18px + 1vw)',
                                lineHeight: '1',
                                wordWrap: 'break-word',
                              }}
                            >
                              {tile.feet ? (
                                <span>
                                  <span style={{ backgroundColor: '#263238', padding: '0 4px 0 4px', borderRadius: '2px' }}>
                                    {`${tile.feet}ft`}
                                  </span>
                                  &nbsp;{tile.name}
                                </span>
                              )
                              : tile.name}
                            </span>
                          )
                          : null}
                          {tile.sellingPrice
                            ? (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'flex-end',
                                  alignItems: 'flex-end',
                                  flexGrow: '1',
                                  fontSize: 'calc(8.5px + 1.2vw)',
                                  paddingLeft: '0.5vw',
                                }}
                              >
                                <span style={{ marginBottom: '-6px', }}>
                                  ₱<b style={{ fontSize: 'calc(25px + 1.7vw)', }}>{tile.sellingPrice}</b>
                                </span>
                                <span style={{ fontSize: 'calc(5px + 1.3vw)', textDecoration: 'overline' }}>
                                  <span style={Math.floor(tile.stock) ? null : styles.hide}>Stock: </span>
                                  <b>{Math.floor(tile.stock) || 'Out of Stock'}</b>
                                </span>
                              </div>
                            )
                            : null}
                        </div>
                        {/** <img
                          src={tile.image || tile.image === '' ? './static/placeholder.jpg' : './static/category.png'}
                          alt="placeholder"
                          style={styles.images}
                        /> **/}
                      </GridTile>
                    </Paper>
                  ))}
              </GridList>
            </div>
          </div>
        </div>
        <Paper className="col-md-3" style={styles.cartInterface}>
          <Subheader style={{ height: '7vh' }}>
            <b>Cart</b>
            <IconButton
              tooltip="Clear cart"
              tooltipPosition="bottom-left"
              onTouchTap={actions.clearCart}
              className="pull-right"
              touch
            >
              <RemoveCart />
            </IconButton>
          </Subheader>
          <List style={styles.cartList}>
            {cart.map((item) => {
              const subText = `₱${item.sellingPrice} x ${item.quantity} = ₱${item.sellingPrice * item.quantity}`;

              return (
                <ListItem
                  key={item.id}
                  primaryText={item.name}
                  secondaryText={subText}
                  onTouchTap={() => this.toggleQuantifying(item, true)}
                  leftAvatar={<Avatar src={item.image || './static/placeholder.jpg'} />}
                  rightIconButton={
                    <IconButton onTouchTap={() => actions.removeCartItem(item.id)} touch>
                      <Cancel />
                    </IconButton>
                  }
                />
              );
            })}
          </List>
          <Paper style={styles.total}>
            <Link to={params.timestamp ? '/Activities' : '/Cashier'}>
              <RaisedButton
                onTouchTap={() => {
                  if (cart.length) {
                    this.setState({ isSummaryOpen: true })
                  }
                }}
                style={{ width: '100%', height: '100%' }}
                primary
              >
                <div style={styles.purchaseButton}>
                  <span style={{ position: 'absolute', top: 0, left: 10, fontSize: 20 }}>
                  Total:
                  </span>
                  ₱{cartTotal.toLocaleString('en-US')}
                </div>
              </RaisedButton>
            </Link>
          </Paper>
        </Paper>
      </div>
    );
  }
}
