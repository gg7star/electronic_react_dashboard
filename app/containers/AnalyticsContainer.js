import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Analytics from './../components/Analytics';

function mapStateToProps(state) {
  const { activities } = state;

  return {
    activities,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Analytics);
