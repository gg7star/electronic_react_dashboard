const FETCH_ACTIVITIES = 'FETCH_ACTIVITIES';

const ACTIVITIES_RETRIEVED = 'ACTIVITIES_RETRIEVED';
const NEW_ACTIVITY = 'NEW_ACTIVITY';
const UPDATE_ACTIVITIES = 'UPDATE_ACTIVITIES';
// const REMOVE_ACTIVITY = 'REMOVE_ACTIVITY';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case ACTIVITIES_RETRIEVED:
      return {
        ...action.activities
      };
    case NEW_ACTIVITY:
      return {
        ...state,
        [action.dayMonth]: {
          ...state[action.dayMonth],
          [action.timestamp]: action.newActivity
        }
      };
    case UPDATE_ACTIVITIES:
      return {
        ...state,
        [action.dayMonth]: {
          ...action.activities
        }
      };
    // case REMOVE_ACTIVITY:
    //   return {
    //     ...state,

    //   };
    default:
      return state;
  }
}

export function toggleActivity(activityTimestamp, refund) {
  return (dispatch, _, { ref, timestamp }) => {
    const tsDate = new Date(activityTimestamp.slice(0, -3) * 1000)
      .toLocaleDateString()
      .replace(/\//g, '-');

    if (refund) {
      ref.child(`activities/${tsDate}/${activityTimestamp}/refundedCartTime`)
        .transaction((current) => (current ? 0 : timestamp));
    } else {
      ref.child(`activities/${tsDate}/${activityTimestamp}/changedCartTime`)
        .transaction((current) => (current ? 0 : timestamp));
    }
  };
}

export function fetchAllActivities() {
  return (dispatch, getState, { ref }) => {
    dispatch({ type: FETCH_ACTIVITIES });
    ref.child('activities').once('value')
      .then(snap => dispatch({ type: ACTIVITIES_RETRIEVED, activities: snap.val() }))
      .then(() => {
        ref.child('.info/serverTimeOffset').on('value', (fbTime) => {
          const date = new Date();
          const dayMonth = date.toLocaleDateString().replace(/\//g, '-');
          const now = Date.now() + fbTime.val();
          const query = ref.child(`activities/${dayMonth}`).orderByKey().startAt(now.toString());

          query.on('child_added', (snap) => {
            const newActivity = snap.val();
            const timestamp = snap.key;

            dispatch({ type: NEW_ACTIVITY, newActivity, dayMonth, timestamp });
          });

          ref.child('activities').on('child_changed', (snap) => {
            const activities = snap.val();
            const dayMonth = snap.key;

            dispatch({ type: UPDATE_ACTIVITIES, activities, dayMonth });
          });
        });
      });
  };
}
