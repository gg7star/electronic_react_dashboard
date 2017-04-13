const FETCH_ALL_ACCOUNTS = 'FETCH_ALL_ACCOUNTS';
const ALL_ACCOUNTS_FETCHED = 'ALL_ACCOUNTS_FETCHED';
const NEW_ACCOUNT = 'NEW_ACCOUNT';
const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
const REMOVE_ACCOUNT = 'REMOVE_ACCOUNT';
const NEW_ACCOUNT_SUCCESS = 'NEW_ACCOUNT_SUCCESS';
const UPDATE_ACCOUNT_SUCCESS = 'UPDATE_ACCOUNT_SUCCESS';
const REMOVE_ACCOUNT_SUCCESS = 'REMOVE_ACCOUNT_SUCCESS';

export default function reducer(state = [], action) {
  switch (action.type) {
    case ALL_ACCOUNTS_FETCHED:
      return Object.keys(action.accounts).map(key => action.accounts[key]);
    case NEW_ACCOUNT:
      return [
        ...state,
        action.newAccount
      ];
    case UPDATE_ACCOUNT:
      return state.map(account => (account.email === action.email ?
        { ...account, ...action.accountProps } : account));
    case REMOVE_ACCOUNT:
      return state.filter(account => account.email !== action.email);
    default:
      return state;
  }
}

export function newAccount(account) {
  return (dispatch, _, { ref, auth, storage, timestamp }) => {
    const path = `userPhotos/${account.name.replace(/\s+/g, '')}.jpg`;
    const uploadTask = storage.child(path).put(account.photo[0]);
    const reader = new FileReader();

    if (account.photo[0]) {
      reader.onload = (e) => {
        const newAccount = {
          ...account,
          photo: e.target.result
        };

        dispatch({ type: NEW_ACCOUNT, newAccount });
      };
      reader.readAsDataURL(account.photo[0]);
    } else {
      dispatch({ type: NEW_ACCOUNT, account });
    }

    uploadTask.on('state_changed', (snap) => { // TODO: add progress indicator
      console.log(snap);
    }, (err) => {
      console.log(err);
    }, () => {
      const newAccount = {
        ...account,
        photo: uploadTask.snapshot.downloadURL
      };

      auth().createUserWithEmailAndPassword(account.email, account.password)
      .then((user) => {
        ref.child(`accounts/${user.uid}`)
        .set({ ...newAccount, timestamp })
        .then(() => dispatch({ type: NEW_ACCOUNT_SUCCESS }));
      });
    });
  };
}

export function updateAccount(email, accountProps) {
  return (dispatch, _, { ref }) => {
    if (accountProps.email) {
      const oldChild = ref.child(`accounts/${email}`);

      oldChild.once('value', (snap) => {
        const newChildVal = Object.assign(snap.val(), accountProps);

        ref.child(`accounts/${accountProps.email}`).set(newChildVal);
        oldChild.remove()
        .then(() => dispatch({ type: UPDATE_ACCOUNT, email, accountProps }));
      });
    } else {
      ref.child(`accounts/${email}`)
      .update(accountProps)
      .then(() => dispatch({ type: UPDATE_ACCOUNT, email, accountProps }));
    }
  };
}

export function removeAccount(account) {
  return (dispatch, _, { ref, auth }) => {
    auth().signInWithEmailAndPassword(account.email, account.password)
    .then((user) => {
      user.delete()
      .then(() => {
        dispatch(() => dispatch({ type: REMOVE_ACCOUNT, email: account.email }));

        ref.child(`accounts/${user.uid}`)
        .remove()
        .then(() => dispatch({ type: REMOVE_ACCOUNT_SUCCESS }));
      });
    });
  };
}

export function fetchAllAccounts() {
  return (dispatch, _, { ref }) => {
    dispatch({ type: FETCH_ALL_ACCOUNTS });

    ref.child('accounts')
    .once('value')
    .then(snap => dispatch({ type: ALL_ACCOUNTS_FETCHED, accounts: snap.val() || [] }));
  };
}
