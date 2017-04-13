const SELECT_GROUP = 'SELECT_GROUP';
const SELECT_FILTER = 'SELECT_FILTER';
const SELECT_SORT = 'SELECT_SORT';
const TOGGLE_SNACKBAR = 'TOGGLE_SNACKBAR';

const NEW_ITEM_ADDED = 'NEW_ITEM_ADDED';
const ITEM_UPDATED = 'ITEM_UPDATED';
const ITEM_REMOVED = 'ITEM_REMOVED';

const init = {
  selectedGroup: '',
  selectedFilter: 'all',
  selectedSort: 'price_asc',
  snackMessage: '',
  searchText: ''
};

export default function reducer(state = init, action) {
  switch (action.type) {
    case SELECT_GROUP:
      return {
        ...state,
        selectedGroup: action.group,
      };
    case SELECT_FILTER:
      return {
        ...state,
        selectedFilter: action.filter,
      };
    case SELECT_SORT:
      return {
        ...state,
        selectedSort: action.sort,
      };
    case TOGGLE_SNACKBAR:
      return {
        ...state,
        snackMessage: action.snackMessage,
      };
    case NEW_ITEM_ADDED:
      return {
        ...state,
        items: [
          ...state.items,
          action.item
        ],
        snackMessage: `${action.item.name}(#${action.item.id}) was added.`,
      };
    case ITEM_UPDATED:
      return {
        ...state,
        items: state.items.map(item => (item.id === action.item.id ? action.item : item)),
        snackMessage: `${action.item.name}(#${action.item.id}) was updated.`,
      };
    case ITEM_REMOVED:
      return {
        ...state,
        items: state.items.filter(item => item.id === action.item.id),
        snackMessage: `${action.item.name}(#${action.item.id}) was removed.`
      };
    default:
      return state;
  }
}

// Actions
export function selectFilter(filter) {
  return {
    type: SELECT_FILTER,
    filter,
  };
}

export function selectSort(sort) {
  return {
    type: SELECT_SORT,
    sort,
  };
}

export function selectGroup(group) {
  return {
    type: SELECT_GROUP,
    group,
  };
}

export function toggleSnackbar(snackMessage) {
  return {
    type: TOGGLE_SNACKBAR,
    snackMessage,
  };
}

export function listenToFirebase() {
  return (dispatch, _, { ref }) => {
    ref.child('.info/serverTimeOffset').on('value', fbTime => {
      const now = Date.now() + fbTime.val();
      const child = ref.child('inventory');
      const query = child.orderByChild('timestamp').startAt(now);

      query.on('child_added', (snap) => {
        const item = snap.val();

        dispatch({ type: NEW_ITEM_ADDED, item });
      });

      child.on('child_changed', (snap) => {
        const item = snap.val();

        dispatch({ type: ITEM_UPDATED, item });
      });
      child.on('child_removed', (snap) => {
        const item = snap.val();

        dispatch({ type: ITEM_REMOVED, item });
      });
    });
  };
}
