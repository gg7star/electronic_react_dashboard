import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Activities from './../components/Activities';
import * as activitiesActions from './../redux/modules/activities';

function mapStateToProps(state) {
  const {
    activities,
  } = state;

  return {
    activities,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(activitiesActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
