import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation, Query } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`

function totalItems (cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
}

class TakeMyMoney extends React.Component {
  onToken = async (resp, createOrder) => {
    console.log('res.id::: ', resp.id)
    // manually call the mutation
    const order = await createOrder({
      variables: {
        token: resp.id
      }
    }).catch(err => {
      alert(err.message)
      console.log(JSON.stringify(err))
    })

    console.log(order)
  }

  render () {
    return (
    <User>
      {({ data: { me }}) => {
        return (
          <Mutation 
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{query: CURRENT_USER_QUERY}]}
          >
            {(createOrder) => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name='Sick Fits'
                description={`Order of ${totalItems(me.cart)} items`}
                image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                stripeKey={`pk_test_sMoIgr1UQhjqe7Xfx7GFMhM000Oa1TV7IE`} // Pubic key
                currency="NZD"
                email={me.email}
                token={resp => this.onToken(resp, createOrder)}
              >
              {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        );
      }}
    </User>
    );
  }
}

export default TakeMyMoney;