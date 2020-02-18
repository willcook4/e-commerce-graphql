import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`

class AddToCart extends Component {
  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={ADD_TO_CART_MUTATION}
        variables={{
          id
        }}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
      >
        {(addToCart, { loading }) => {
          return (<button
            disabled={loading}
            onClick={() => {
              addToCart()
                .catch(err => {
                   // typical error == 'You must be signed in to add an item to your cart'
                  alert(err.message.replace('GraphQL error: ', ''))
                })
            }}>Add{loading && 'ing'} to Cart {loading ? `🕓`: `➕`}</button>
          )
        }}
      </Mutation>
    );
  }
}

export default AddToCart;
export { ADD_TO_CART_MUTATION }