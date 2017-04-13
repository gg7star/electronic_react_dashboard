import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { reduxForm } from 'redux-form';

import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Dashboard from 'material-ui/svg-icons/action/dashboard';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(\'./static/bg.png\')',
    backgroundSize: 'cover'
  },
  content: {
    width: '500px',
  },
  form: {
    padding: '20px'
  },
  submit: {
    width: '100%'
  }
};

@Radium
@reduxForm({
  form: 'login',
  fields: [
    'email',
    'password',
  ]
})
export default class Login extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    loginErr: PropTypes.string,
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
  }

  constructor() {
    super();

    this.state = { focus: 'terminal' };
  }

  changeTabFocus = tab => {
    if (typeof tab !== 'string') return;

    this.setState({ focus: tab });
  }

  userAuth = (e) => {
    const { email, password } = this.props.values;

    e.preventDefault();
    this.props.actions.verifyCreds(email, password);
  }

  render() {
    const {
      loginErr,
      fields,
    } = this.props;

    return (
      <div className="container" style={styles.container}>
        <Paper zDepth={2}>
          <Tabs
            value={this.state.focus}
            onChange={this.changeTabFocus}
            style={styles.content}
          >
            <Tab
              label="Dashboard"
              value="dashboard"
              icon={<Dashboard />}
            >
              <form
                name="Admin Login"
                style={styles.form}
                onSubmit={this.userAuth}
              >
                <TextField
                  {...fields.email}
                  type="email"
                  floatingLabelText="Email"
                  fullWidth
                  autoFocus
                  required
                />
                <br />
                <TextField
                  {...fields.password}
                  type="password"
                  floatingLabelText="Password"
                  errorText={loginErr}
                  fullWidth
                  required
                />
                <br />
                <RaisedButton
                  type="submit"
                  label="Login"
                  style={styles.submit}
                  primary
                />
              </form>
            </Tab>
          </Tabs>
        </Paper>
      </div>
    );
  }
}
