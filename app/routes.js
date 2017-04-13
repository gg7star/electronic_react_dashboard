import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import LoginContainer from './containers/LoginContainer';
import DashboardLayout from './components/DashboardLayout';
import Inventory from './containers/InventoryContainer';
import Accounts from './containers/AccountsContainer';
import Analytics from './containers/AnalyticsContainer';
import Activities from './containers/ActivitiesContainer';
import Cashier from './containers/CashierContainer';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LoginContainer} />
    <Route path="Dashboard" component={DashboardLayout}>
      <IndexRoute component={Inventory} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/activities" component={Activities} />
      <Route path="/accounts" component={Accounts} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/cashier(/:timestamp)" component={Cashier} />
    </Route>
  </Route>
);
