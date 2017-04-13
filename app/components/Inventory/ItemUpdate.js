import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import styles from './styles';

@reduxForm({
  form: 'update_inventory_item',
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
    'image'
  ]
})
class ItemUpdate extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    updateItem: PropTypes.func.isRequired,
  }

  constructor() {
    super();

    this.state = {
      idError: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { item, actions } = this.props;

    if (item.id !== nextProps.item.id) {
      actions.loadInitialValues(nextProps.item);
    }
  }

  loadInitialValues = () => {
    const { item, actions, } = this.props;

    actions.loadInitialValues(item);
  }

  updateItem = () => {
    const { item, values, fields, actions, selectedIndex, cancelEditing, } = this.props;
    const changedFields = {};

    if (!this.state.idError && fields.id.value && fields.name.value) {
      Object.keys(item).forEach((key) => {
        if (values.hasOwnProperty(key) && values[key] !== item[key]) {
          changedFields[key] = values[key];
        }
      });

      if (Object.keys(changedFields).length) {
        actions.updateItem(selectedIndex, item.id, changedFields, item);
      }

      actions.editRowItem(-1);
      if (cancelEditing) cancelEditing();
    }
  }

  validateId = () => {
    const { items, item, fields, } = this.props;
    const foundItem = items.find((item) => item.id === fields.id.value);

    this.setState({
      idError: foundItem && foundItem.id !== item.id ? `Item ID is already used by ${foundItem.name}` : ''
    });
  }

  render() {
    const { fields, item, selected, actions, itemsName, isItemDrawerEdit, cancelEditing } = this.props;

    if (isItemDrawerEdit) {
      return (
        <div style={styles.itemUpdateContainer}>
          <h3
            style={{
              position: 'absolute',
              top: '-1vh',
              right: '17px',
              color: '#9e9e9e'
            }}
          >
            {`Editing ${item.name}(ID#${item.id})`}
          </h3>
          <div
            style={{
              position: 'relative',
              padding: '15px 15px 0 16px',
            }}
          >
            <TextField // FIXME: number fields accepts 0 value
              {...fields.id}
              floatingLabelText="ID"
              type="number"
              min={1}
              step={1}
              onFocus={() => actions.loadInitialValues(item)}
              onKeyUp={this.validateId}
              errorText={this.state.idError}
              autoFocus
              fullWidth
            />
            <AutoComplete
              {...fields.name}
              floatingLabelText="Item Name"
              searchText={fields.name.value}
              dataSource={itemsName}
              filter={AutoComplete.fuzzyFilter}
              openOnFocus
              fullWidth
            />
            <TextField
              {...fields.cost}
              type="number"
              floatingLabelText="Product Cost"
              min={1}
              step="any"
              fullWidth
            />
            <TextField
              {...fields.sellingPrice}
              floatingLabelText="Selling Price"
              type="number"
              min={1}
              step="any"
              fullWidth
            />
            <TextField
              {...fields.stock}
              type="number"
              step="any"
              floatingLabelText="Stock"
              fullWidth
            />
            <TextField
              {...fields.category}
              floatingLabelText="Category"
              fullWidth
            />
            <TextField
              {...fields.brand}
              floatingLabelText="Brand"
              fullWidth
            />
            <TextField
              {...fields.supplier}
              floatingLabelText="Supplier"
              fullWidth
            />
            <TextField
              {...fields.description}
              floatingLabelText="Description"
              fullWidth
            />
            {/** <TextField
              {...fields.image}
              type="file"
              floatingLabelText="image"
              floatingLabelText="Image"
              value={null}
              fullWidth
            />
            <img src={item && item.image || './static/placeholder.jpg'} alt={item && item.name} width="250" height="200" /> **/ }
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <FlatButton
              onTouchTap={cancelEditing}
              secondary
              label="Cancel"
            />
            <RaisedButton
              onTouchTap={this.updateItem}
              label="Update"
              primary
            />
          </div>
        </div>
      );
    }

    return (
      <TableRow
        key={item.id}
        selected={selected}
        style={{
          width: '100%',
          height: '100%',
          overflowX: 'scroll'
        }}
      >
        <TableRowColumn>
          <TextField // FIXME: number fields accepts 0 value
            {...fields.id}
            floatingLabelText="ID"
            type="number"
            onKeyUp={this.validateId}
            errorText={this.state.idError}
            errorStyle={{ whiteSpace: 'pre-line', wordBreak: 'break-word', height: '100%', width: '33%' }}
            min={1}
            step={1}
          />
        </TableRowColumn>
        <TableRowColumn>
          <AutoComplete
            {...fields.name}
            floatingLabelText="Item Name"
            searchText={fields.name.value}
            dataSource={itemsName}
            filter={AutoComplete.fuzzyFilter}
            openOnFocus
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            {...fields.cost}
            floatingLabelText="Product Cost"
            type="number"
            min={1}
            step="any"
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            {...fields.sellingPrice}
            floatingLabelText="Selling Price"
            type="number"
            min={1}
            step="any"
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            type="number"
            step="any"
            floatingLabelText="Stock"
            {...fields.stock}
            onFocus={() => actions.loadInitialValues(item)}
            autoFocus
          />
        </TableRowColumn>
        <TableRowColumn style={{ padding: 0, textAlign: 'center' }}>
          <FlatButton
            label="Cancel"
            onTouchTap={() => actions.editRowItem(-1)}
            secondary
          />
        </TableRowColumn>
        <TableRowColumn style={{ padding: 0, textAlign: 'center' }}>
          <RaisedButton
            label="Update"
            onTouchTap={this.updateItem}
            primary
          />
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default ItemUpdate;
