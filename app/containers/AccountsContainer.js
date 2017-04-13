import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Account from './../components/Account';
import * as accountActions from './../redux/modules/accountUsers';
import * as accountUIActions from './../redux/modules/accountUI';

function mapStateToProps(state) {
  const { account: {
          ui: {
            accountCardEdit,
          },
          users,
        } } = state;

  return {
    users,
    accountCardEdit,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...accountActions,
      ...accountUIActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
