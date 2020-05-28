import React, { useEffect, Suspense } from 'react';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import { connect } from "react-redux";
import * as actions from './store/actions/index';


const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

const app = props => {
  const { onTryAutoSignOut } = props;
  useEffect(() => {
    onTryAutoSignOut();
  }, [onTryAutoSignOut])

    let routes = (
      <Switch>
        <Route path="/" exact component={BurgerBuilder}/>
        <Route path="/auth" render={(props) => ( <Auth {...props}/> )}/>
        <Redirect to='/' />
      </Switch>
    );

    if(props.isAuthenticated){
      routes = (
        <Switch>
          <Route path="/" exact component={BurgerBuilder}/>
          <Route path="/checkout" render={ (props) => ( <Checkout {...props} />)}/>
          <Route path="/logout" component={Logout}/>
          <Route path="/orders" render={(props) => ( <Orders {...props} /> )}/>
          <Route path="/auth" render={(props) => ( <Auth {...props} /> )}/>
          <Redirect to='/' />
        </Switch>
      );
    }
    return (
      <div >
        <Layout>
          <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
        </Layout>
      </div>
    );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return{
    onTryAutoSignOut: () => dispatch(actions.authCheckstate())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
