import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Inventory from './../components/Inventory';
import { getFilteredItems, getSelectedItems, getProp, } from './../selectors/inventorySelectors';
import * as inventoryActions from './../redux/modules/inventoryItems';
import * as inventoryUIActions from './../redux/modules/inventoryUI';

function mapStateToProps(state) {
  const { inventory: {
          ui: {
            rowItemEdit,
            isDeletionEnabled,
            initFields,
            selectedIndexes,
          }
        } } = state;

  return {
    rowItemEdit,
    isDeletionEnabled,
    initialValues: initFields,
    selectedIndex: selectedIndexes[0],
    selectedItems: getSelectedItems(state),
    items: getFilteredItems(state),
    categories: getProp(state, 'category'),
    brands: getProp(state, 'brand'),
    suppliers: getProp(state, 'supplier'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...inventoryActions,
      ...inventoryUIActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
