import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Login from './../components/Login';
import * as loginActions from './../redux/modules/login';

function mapStateToProps(state) {
  return {
    loginErr: state.login.loginErr
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(loginActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
