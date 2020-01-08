import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';
import { ca } from 'date-fns/locale';
import { QueryManager } from 'apollo-client/core/QueryManager';

function totalItems (cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
}

class TakeMyMoney extends React.Component {
  onToken = (resp) => {
    console.log('res.id::: ', resp.id)
  }

  render () {
    return (
    <User>
      {({ data: { me }}) => (
      <StripeCheckout
        amount={calcTotalPrice(me.cart)}
        name='Sick Fits'
        description={`Order of ${totalItems(me.cart)} items`}
        image={me.cart[0].item && me.cart[0].item.image}
        stripeKey={`pk_test_sMoIgr1UQhjqe7Xfx7GFMhM000Oa1TV7IE`} // Pubic key
        currency="NZD"
        email="hello@doubleucook.com"
        token={resp => this.onToken(resp)}
      >
        {this.props.children}
      </StripeCheckout>)}
    </User>)
  }
}

export default TakeMyMoney;