import { createSelector } from 'reselect';

const pattern = (string) => new RegExp(`(${string})+`, 'gi');
const getSelectedIndexes = (state) => state.inventory.ui.selectedIndexes;
const getFilter = (state) => state.inventory.ui.filter;
const getItems = (state) => state.inventory.items;
const getField = (state) => state.inventory.ui.field;

export const getFieldsError = createSelector(
  [getField, getItems],
  (field, items) => {
    switch (field.name) {
      case 'id':
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === field.value) {
            return `The id#${field.value} already exists.`;
          }
        }
        return field.value <= 0 ? 'The lowest possible value is 1.' : '';
      case 'stock':
        return field.value <= 0 ? 'The lowest possible value is 1.' : '';
      case 'name':
        for (let i = 0; i < items.length; i++) {
          if (items[i].name === field.value) {
            return `Warning: The name ${field.value} already exists.`;
          }
        }
        return '';
      default:
        return '';
    }
  }
);

export const getSelectedItems = createSelector(
  [getSelectedIndexes, getItems],
  (selectedIndexes, items) => selectedIndexes.map(i => items[i])
);

export const getProp = createSelector(
  [getItems, (_, prop) => prop], (items, prop) =>
    items.reduce((prev, curr) => (prev.indexOf(curr[prop]) > -1 ?
    prev : [...prev, curr[prop]]), [])
);

export const getFilteredItems = createSelector(
  [getFilter, getItems],
  (filter, items) => {
    switch (filter.by) {
      case 'category':
        return items.filter((item) => item.category === filter.name);
      case 'brand':
        return items.filter((item) => item.brand === filter.name);
      case 'supplier':
        return items.filter((item) => item.supplier === filter.name);
      case 'search':
        return items.filter((item) => pattern(filter.name).test(item.name));
      default:
        return items;
    }
  }
);
