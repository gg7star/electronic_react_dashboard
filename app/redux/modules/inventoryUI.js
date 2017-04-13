const FIELDS_INITIAL_VALUES = 'FIELDS_INITIAL_VALUES';
const CHANGE_FILTER = 'CHANGE_FILTER';
const TOGGLE_DELETION = 'TOGGLE_DELETION';
const EDIT_ROW_ITEM = 'EDIT_ROW_ITEM';
const SELECT_ITEMS = 'SELECT_ITEMS';
const SELECT_ALL_ITEMS = 'SELECT_ALL_ITEMS';
const UNSELECT_ALL_ITEMS = 'UNSELECT_ALL_ITEMS';
const SEARCH_ITEM = 'SEARCH_ITEM';
const VALIDATE_FIELD = 'VALIDATE_FIELD';

const init = {
  selectedIndexes: [],
  initFields: {},
  rowItemEdit: -1,
  isDeletionEnabled: false,
  search: '',
  filter: {},
  field: {},
  more: '',
};

export default function reducer(state = init, action) {
  switch (action.type) {
    case SELECT_ITEMS:
      return {
        ...state,
        selectedIndexes: action.rowIndexes,
      };
    case FIELDS_INITIAL_VALUES:
      return {
        ...state,
        initFields: action.initialValues,
      };
    case SELECT_ALL_ITEMS:
      return {
        ...state,
        selectedIndexes: state.items.map(item => item),
      };
    case UNSELECT_ALL_ITEMS:
      return {
        ...state,
        selectedIndexes: [],
      };
    case EDIT_ROW_ITEM:
      return {
        ...state,
        rowItemEdit: action.rowItem,
      };
    case TOGGLE_DELETION:
      return {
        ...state,
        isDeletionEnabled: !state.isDeletionEnabled,
      };
    case CHANGE_FILTER:
      return {
        ...state,
        filter: {
          by: action.filterBy,
          name: action.name,
        }
      };
    case SEARCH_ITEM:
      return {
        ...state,
        filter: {
          by: 'search',
          name: action.search,
        }
      };
    default:
      return state;
  }
}

export function loadInitialValues(initialValues) {
  return {
    type: FIELDS_INITIAL_VALUES,
    initialValues
  };
}

export function searchItem(search) {
  return {
    type: SEARCH_ITEM,
    search
  };
}

export function changeFilter(filterBy, name) {
  return {
    type: CHANGE_FILTER,
    filterBy,
    name
  };
}

export function toggleDeletion() {
  return {
    type: TOGGLE_DELETION
  };
}

export function editRowItem(rowItem) {
  return {
    type: EDIT_ROW_ITEM,
    rowItem
  };
}

export function selectItems(rowIndexes) {
  return {
    type: SELECT_ITEMS,
    rowIndexes
  };
}

export function selectAllItems() {
  return {
    type: SELECT_ALL_ITEMS
  };
}

export function unselectAllItems() {
  return {
    type: UNSELECT_ALL_ITEMS
  };
}
