import values from 'object.values';

const FETCH_ALL_ITEMS = 'FETCH_ALL_ITEMS';
const FETCH_ITEM_HISTORY = 'FETCH_ITEM_HISTORY';

const ITEM_HISTORY_FETCHED = 'ITEM_HISTORY_FETCHED';

const ALL_ITEMS_FETCHED = 'ALL_ITEMS_FETCHED';
const NEW_ITEM = 'NEW_ITEM';
const UPDATE_ITEM = 'UPDATE_ITEM';
const REMOVE_ITEMS = 'REMOVE_ITEMS';
const ITEM_STOCK_UPDATED = 'ITEM_STOCK_UPDATED';

const NEW_ITEM_SYNCED = 'NEW_ITEM_SYNCED';
const UPDATE_ITEM_SYNCED = 'UPDATE_ITEM_SYNCED';
const REMOVE_ITEMS_SYNCED = 'REMOVE_ITEMS_SYNCED';

export default function reducer(state = [], action) {
  switch (action.type) {
    case ALL_ITEMS_FETCHED:
      return action.items;
    case NEW_ITEM:
      if (state[0] === 'None') {
        return [
          action.newItem,
        ];
      }

      return [
        action.newItem,
        ...state,
      ];
    case UPDATE_ITEM:
      return values({
        ...state,
        [action.itemIndex]: {
          ...state[action.itemIndex],
          ...action.itemProps,
          initialStock: action.itemProps.stock || state[action.itemIndex].stock,
        }
      });
    case REMOVE_ITEMS:
      // return values({
      //   ...state,
      //   ...action.itemsToRemove,
      // });
      return state.filter((item) => !action.itemsToRemove.includes(item));
    case ITEM_STOCK_UPDATED:
      return values({
        ...state,
        [action.itemIndex]: action.updatedItem,
      });
    case ITEM_HISTORY_FETCHED:
      return values({
        ...state,
        [action.itemIndex]: {
          ...state[action.itemIndex],
          history: action.itemHistory,
        }
      });
    default:
      return state;
  }
}

export function addNewItem(item, callback) {
  return (dispatch, getState, { ref, storage }) => {
    const newItem = {
      ...item,
      category: item.category || 'Others',
      supplier: item.supplier || 'Others',
      brand: item.brand || 'Others',
      initialStock: item.stock,
    };

    function addInvItem(props) {
      ref.child('.info/serverTimeOffset').on('value', (fbTime) => {
        const time = new Date((Date.now() + fbTime.val()));

        ref.child(`inventory/${props.id}`)
          .set({ ...props, time: -time, })
          .then(() => {
            dispatch({ type: NEW_ITEM_SYNCED });
            callback();
          });
      });
    }

    if (item.image && item.image[0]) {
      const path = `itemImages/${item.id}.jpg`;
      const uploadTask = storage.child(path).put(item.image[0]);
      const reader = new FileReader();

      reader.onload = (e) => {
        const newItem = {
          ...item,
          initialStock: item.stock,
          image: e.target.result
        };

        dispatch({ type: NEW_ITEM, newItem });
      };
      reader.readAsDataURL(item.image[0]);

      uploadTask.on('state_changed', (snap) => { // TODO: add progress indicator
        console.log(snap);
      }, (err) => {
        console.log(err);
      }, () => {
        const newItemWithImage = {
          ...newItem,
          image: uploadTask.snapshot.downloadURL
        };

        addInvItem(newItemWithImage);
      });
    } else {
      dispatch({ type: NEW_ITEM, newItem });
      addInvItem(newItem);
    }
  };
}

export function updateItem(itemIndex, itemId, itemProps, prevItemProps) {
  return (dispatch, getState, { ref, auth, storage }) => {
    function updateInvItem(props) {
      if (props.stock) {
        ref.child(`inventory/${itemId}`)
          .update({ ...props, initialStock: props.stock })
          .then(() => dispatch({ type: UPDATE_ITEM_SYNCED, itemId, itemProps: props }));
      } else {
        ref.child(`inventory/${itemId}`)
          .update(props)
          .then(() => dispatch({ type: UPDATE_ITEM_SYNCED, itemId, itemProps: props }));
      }
    }

    function readFile() {
      const reader = new FileReader();

      reader.onload = (e) => {
        const newItemProps = {
          ...itemProps,
          image: e.target.result
        };

        dispatch({ type: UPDATE_ITEM, itemIndex, itemProps: newItemProps });
      };
      reader.readAsDataURL(itemProps.image[0]);
    }

    function syncImage() {
      const path = `itemImages/${itemId}.jpg`;
      const uploadTask = storage.child(path).put(itemProps.image[0]);

      uploadTask.on('state_changed', (snap) => { // TODO: add progress indicator
        console.log(snap);
      }, (err) => {
        console.log(err);
      }, () => {
        const newItemProps = {
          ...itemProps,
          image: uploadTask.snapshot.downloadURL
        };

        updateInvItem(newItemProps);
      });
    }

    function updateInvItemId() {
      const oldChild = ref.child(`inventory/${itemId}`);

      oldChild.once('value', () => {
        const newChildVal = {
          ...prevItemProps,
          ...itemProps,
          history: null,
          initialStock: itemProps.stock || prevItemProps.initialStock,
        };

        ref.child(`inventory/${itemProps.id}`).set(newChildVal);
        oldChild.remove().then(() => dispatch({ type: UPDATE_ITEM_SYNCED }));
      });
    }

    ref.child('.info/serverTimeOffset').on('value', (fbTime) => {
      const time = new Date((Date.now() + fbTime.val())).toLocaleString();

      Object.keys(itemProps).forEach((propName) => {
        ref.child(`itemHistory/${itemId}/`)
          .push({
            actor: auth.currentUser.displayName,
            newVal: itemProps[propName],
            oldVal: prevItemProps[propName],
            category: propName,
            time,
          });
      });
    });

    if (itemProps.id) {
      if (itemProps.image && itemProps.image[0]) {
        readFile();
        syncImage();
        updateInvItemId();
      } else {
        dispatch({ type: UPDATE_ITEM, itemIndex, itemProps });
        updateInvItemId();
      }
    } else {
      if (itemProps.image && itemProps.image[0]) {
        readFile();
        syncImage();
      } else {
        dispatch({ type: UPDATE_ITEM, itemIndex, itemProps });
        updateInvItem(itemProps);
      }
    }
  };
}

export function removeItems(itemsToRemove) {
  return (dispatch, getState, { ref, storage }) => {
    if (!itemsToRemove.length) return;

    const itemsToRemoveObj = {};

    dispatch({ type: REMOVE_ITEMS, itemsToRemove });

    itemsToRemove.forEach((item) => {
      storage.child(`itemImages/${item.id}.jpg`).delete()
        .then(() => console.log(`${item} image deleted`));

      itemsToRemoveObj[item.id] = null;
    });

    ref.child('inventory')
      .update(itemsToRemoveObj)
      .then(() => dispatch({ type: REMOVE_ITEMS_SYNCED }));
  };
}

export function fetchListenToInventory() {
  return (dispatch, getState, { ref }) => {
    dispatch({ type: FETCH_ALL_ITEMS });

    ref.child('inventory')
      .orderByChild('time')
      .once('value')
      .then((snap) => {
        // const rawItems = snap.val();
        // const items = Object.keys(rawItems).map((key) => rawItems[key]);
        const items = [];

        if (snap.val()) {
          snap.forEach((data) => {
            items.push(data.val());
          });
        } else {
          items.push('None');
        }

        dispatch({ type: ALL_ITEMS_FETCHED, items });
        // localStorage.setObj('inventoryItems', items);
      });

    ref.child('inventory').on('child_changed', (snap) => {
      const { inventory: { items, } } = getState();
      const updatedItem = snap.val();
      const itemIndex = items.findIndex(( item) => item.id === updatedItem.id);
      const origItem = items.reduce((prev, curr) => (prev.id === updatedItem.id ? prev : curr));

      if (origItem.stock !== updatedItem.stock) {
        dispatch({ type: ITEM_STOCK_UPDATED, itemIndex, updatedItem });
      }
    });
  };
}

export function removeListenersToInventory() {
  return (dispatch, getState, { ref }) => {
    ref.child('inventory').off();
  };
}

export function fetchItemHistory(itemIndex, itemId) {
  return (dispatch, getState, { ref }) => {
    dispatch({ type: FETCH_ITEM_HISTORY });

    ref.child(`itemHistory/${itemId}`).once('value')
      .then((snap) => {
        const itemHistory = snap.val() ? values(snap.val()) : ['None'];
        dispatch({ type: ITEM_HISTORY_FETCHED, itemIndex, itemHistory });
      });
  };
}
