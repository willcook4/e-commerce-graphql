import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled('button')`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCart extends Component {
  // this update function gets called as soon as we get
  // a respone back from the server after the mutation has been performed
  update = (cache, payload) => { // cache is the apollo cache, payload is the resposne from the mutation
    // first read the response
    const data = cache.readQuery({ query: CURRENT_USER_QUERY}) 
    // remove that item from the cart
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)
    // update the cache with the update
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  }
  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{id: this.props.id}}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: this.props.id,
          }
        }}
      >
      {(removeFromCart, { loading, error}) => (
        <BigButton
          disabled={loading}
          title="Delete Item"
          onClick={() => {
            removeFromCart().catch(err => alert(err.message));
          }}
        > 
          &times;
        </BigButton>
      )}   
      </Mutation>
    );
  }
}

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired
};

export default RemoveFromCart;
export { REMOVE_FROM_CART_MUTATION }
