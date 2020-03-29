import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import auth from './authenticate';
import * as actionTypes from '../actions/actionTypes';

configure({adapter: new Adapter()});

describe('Auth reducer', () => {
  it('Should return the initial state', () => {
    expect(auth(undefined, {})).toEqual({
      token: null,
        userId: null,
      error: null,
      loading: false,
      authRedirectPath: '/'
    })
  });

  it('Should store token after loggin', () => {
    expect(auth({
      token: null,
      userId: null,
      error: null,
      loading: false,
      authRedirectPath: '/'}, {
      type: actionTypes.AUTH_SUCCESS,
      idToken:'some-token',
      userId:'some-userId'
    })).toEqual({
      token: 'some-token',
      userId: 'some-userId',
      error: null,
      loading: false,
      authRedirectPath: '/'
    })
  });


});
