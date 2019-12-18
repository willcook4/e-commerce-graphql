import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION( $resetToken: String!, $password: String!, $confirmPassword: String! ) {
    resetPassword(
      resetToken: $resetToken,
      password: $password,
      confirmPassword: $confirmPassword,
    ) {
      id
      email
      name
    }
  }
`

class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  }

  state = {
    password: '',
    confirmPassword: ''
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          password: this.state.password,
          confirmPassword: this.state.confirmPassword, 
          resetToken: this.props.resetToken,
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { error, loading }) => {
          return (
            <Form
              method='POST'
              onSubmit={async (e) => {
                e.preventDefault();
                await reset();
                this.setState({
                  password: '',
                  confirmPassword: ''
                })  
              }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset Your Password</h2>
                <Error error={error} />

                <label htmlFor="password">
                  Password
                  <input 
                    type="password"
                    name="password"
                    placeholder="password"
                    value={this.state.password} 
                    onChange={this.saveToState} />
                </label>

                <label htmlFor="confirmPassword">
                  Confirm your password
                  <input 
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={this.state.confirmPassword} 
                    onChange={this.saveToState} />
                </label>

                <button type='submit'>Reset your password!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}

export default Reset;