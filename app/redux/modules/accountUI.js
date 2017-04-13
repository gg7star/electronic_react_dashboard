const FIELDS_INITIAL_VALUES = 'FIELDS_INITIAL_VALUES';
const EDIT_ACCOUNT_CARD = 'EDIT_ACCOUNT_CARD';

const init = {
  accountCardEdit: '',
};

export default function reducer(state = init, action) {
  switch (action.type) {
    case FIELDS_INITIAL_VALUES:
      return {
        ...state,
        initFields: action.initialValues,
      };
    case EDIT_ACCOUNT_CARD:
      return {
        ...state,
        accountCardEdit: action.email
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

export function editAccount(email) {
  return {
    type: EDIT_ACCOUNT_CARD,
    email
  };
}
