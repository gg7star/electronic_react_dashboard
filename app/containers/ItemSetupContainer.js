import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import ItemSetup from './../components/Inventory/ItemSetup';
import { addNewItem } from './../redux/modules/inventoryItems';
import { getProp, getFieldsError } from './../selectors/inventorySelectors.js';

function mapStateToProps(state) {
  return {
    items: state.inventory.items,
    fieldError: getFieldsError(state),
    categories: getProp(state, 'category'),
    brands: getProp(state, 'brand'),
    suppliers: getProp(state, 'supplier'),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ addNewItem, reset }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemSetup);
