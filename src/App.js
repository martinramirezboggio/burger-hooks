import React, { Component } from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BugerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import { connect } from "react-redux";
import * as actions from './store/actions/index';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignOut();
  }

  render() {
    return (
      <div >
        <Layout>
          <Switch>
            <Route path="/checkout" component={Checkout}/>
            <Route path="/" exact component={BurgerBuilder}/>
            <Route path="/auth" component={Auth}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/orders" component={Orders}/>
          </Switch>
        </Layout>
      </div>
    );
  }
}

const mapDispatchProps = dispatch => {
  return{
    onTryAutoSignOut: () => dispatch(actions.authCheckstate())
  }
}

export default withRouter(connect(null, mapDispatchProps)(App));
