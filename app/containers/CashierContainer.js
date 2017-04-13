import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getGridTiles, getItems } from './../selectors/cashierSelectors';
import Cashier from './../components/Cashier';
import * as cashierActions from './../redux/modules/cashier';
import * as cartActions from './../redux/modules/cart';
import { fetchListenToInventory, removeListenersToInventory } from './../redux/modules/inventoryItems';


function mapStateToProps(state) {
  const {
    cashier,
    cart,
    activities,
  } = state;

  return {
    tiles: getGridTiles(state),
    items: getItems(state),
    cart,
    cashier,
    activities,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...cashierActions,
      ...cartActions,
      fetchListenToInventory,
      removeListenersToInventory,
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cashier);
