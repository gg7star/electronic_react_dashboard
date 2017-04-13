import React, { Component, PropTypes } from 'react';
import { reduxForm, reset, } from 'redux-form';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import styles from './styles';

@reduxForm({
  form: 'new_inventory_item',
  fields: [
    'id',
    'name',
    'category',
    'cost',
    'sellingPrice',
    'stock',
    'brand',
    'supplier',
    'description',
    'image',
    'feet'
  ]
}, () => ({
  initialValues: {
    id: 0,
    cost: 1,
    sellingPrice: 1,
    stock: 1,
    category: '',
    brand: '',
    supplier: '',
    feet: 0,
    image: '',
    description: '',
  }
}))
export default class ItemSetup extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    suppliers: PropTypes.array.isRequired,
    disabled: PropTypes.bool.isRequired,
    addNewItem: PropTypes.func,
  }

  constructor() {
    super();

    this.state = {
      openDialog: false,
      idError: '',
    };
  }

  validateId = () => {
    const { fields, items = [], } = this.props;
    const foundItem = items.find((item) => item.id === fields.id.value);

    this.setState({
      idError: foundItem ? `Item ID is already used by ${foundItem.name}` : ''
    });
  }

  _addNewItem = (e) => {
    e.preventDefault();
    const { values, actions, fields, items, } = this.props;

    if (!this.state.idError && fields.id.value && fields.name.value) {
      actions.addNewItem(values, () => {
        actions.reset('new_inventory_item');
        this.refs.productId.focus();
      });

      this.refs.categoryField.state.searchText = '';
      this.refs.brandField.state.searchText = '';
      this.refs.supplierField.state.searchText = '';
    }
  }

  _handleCategoriesDialog = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  _handleDialogState = (e) => {
    e.preventDefault();
    this.setState({ openDialog: !this.state.openDialog });
  }

  render() {
    const { fields, categories, brands, suppliers, disabled, actions, } = this.props;
    const actionButtons = [
      <FlatButton
        label="Cancel"
        onTouchTap={(e) => {
          this._handleDialogState(e);
          actions.reset('new_inventory_item');
        }}
        primary
      />,
      <FlatButton
        type="submit"
        label="Submit"
        onTouchTap={this._addNewItem}
        primary
      />
    ];

    return (
      <div>
        <FlatButton
          label="Add"
          onTouchTap={this._handleDialogState}
          disabled={disabled}
          primary
        />
        <Dialog
          title="Item Setup"
          actions={actionButtons}
          open={this.state.openDialog}
          contentStyle={styles.dialog}
          titleStyle={styles.title}
          autoScrollBodyContent
        >
          <form onSubmit={this._addNewItem}>
            <TextField
              {...fields.id}
              type="number"
              min={1}
              onKeyUp={this.validateId}
              errorText={this.state.idError}
              onFocus={(e) => e.target.select()}
              step="any"
              floatingLabelText="ID"
              ref="productId"
              fullWidth
              autoFocus
              required
            />
            <br />
            <TextField
              {...fields.name}
              ref="productName"
              floatingLabelText="Item Name"
              fullWidth
              required
            />
            <br />
            <AutoComplete
              {...fields.category}
              floatingLabelText="Category"
              ref="categoryField"
              filter={AutoComplete.fuzzyFilter}
              dataSource={categories}
              onUpdateInput={(val) => fields.category.onChange(val)}
              onNewRequest={(val) => {
                setTimeout(() => this.refs.brandField.focus(), 500);
                fields.category.onChange(val);
              }}
              onFocus={(e) => {
                e.target.select();
                fields.category.onFocus();
              }}
              fullWidth
              openOnFocus
              required
            />
            <br />
            <AutoComplete
              {...fields.brand}
              floatingLabelText="Brand"
              ref="brandField"
              filter={AutoComplete.fuzzyFilter}
              dataSource={brands}
              onUpdateInput={(val) => fields.brand.onChange(val)}
              onNewRequest={(val) => {
                setTimeout(() => this.refs.supplierField.focus(), 500);
                fields.brand.onChange(val);
              }}
              onFocus={(e) => {
                e.target.select();
                fields.brand.onFocus();
              }}
              fullWidth
              openOnFocus
            />
            <br />
            <AutoComplete
              {...fields.supplier}
              floatingLabelText="Supplier"
              ref="supplierField"
              filter={AutoComplete.fuzzyFilter}
              dataSource={suppliers}
              onUpdateInput={val => fields.supplier.onChange(val)}
              onNewRequest={val => {
                setTimeout(() => this.refs.costField.focus(), 500);
                fields.supplier.onChange(val);
              }}
              onFocus={(e) => {
                e.target.select();
                fields.supplier.onFocus();
              }}
              fullWidth
              openOnFocus
            />
            <br />
            <TextField
              {...fields.cost}
              type="number"
              min={1}
              step="any"
              ref="costField"
              floatingLabelText="Product Cost"
              fullWidth
              required
            />
            <br />
            <TextField
              {...fields.sellingPrice}
              type="number"
              min={1}
              step="any"
              floatingLabelText="Selling Price"
              fullWidth
              required
            />
            <br />
            <TextField
              {...fields.stock}
              type="number"
              min={1}
              step="any"
              floatingLabelText="Stock"
              fullWidth
              required
            />
            <br />
            <TextField
              {...fields.feet}
              type="number"
              floatingLabelText="Feet(for steels and alike)"
              fullWidth
            />
            <br />
            <TextField
              {...fields.description}
              type="textarea"
              floatingLabelText="Description(optional)"
              fullWidth
              multiLine
            />
            {/** <TextField
              {...fields.image}
              type="file"
              value={null}
              floatingLabelText="Image(optional)"
              fullWidth
            /> **/}
            <br />
            <input className="hidden" type="submit" />
          </form>
        </Dialog>
      </div>
    );
  }
}
