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
  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{id: this.props.id}}
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
