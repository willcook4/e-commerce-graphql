import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { ApolloConsumer } from 'react-apollo'
import { MockedProvider } from 'react-apollo/test-utils'
import AddToCart, { ADD_TO_CART_MUTATION } from '../components/AddToCart'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'

const mocks = [{
  request: {
    query: CURRENT_USER_QUERY
  },
  result: {
    data: {
      me: {
        ...fakeUser(),
        cart: []
      }
    }
  }
}, {
  request: {
    query: ADD_TO_CART_MUTATION,
    variables: {
      id: 'abc123'
    }
  },
  result: {
    data: {
      addToCart: {
        ...fakeCartItem(),
        quantity: 1
      }
    }
  }
},
// second time current usery query is run
{
  request: {
    query: CURRENT_USER_QUERY
  },
  result: {
    data: {
      me: {
        ...fakeUser(),
        cart: [fakeCartItem()]
      }
    }
  }
}]

describe('<AddToCart />', () => {
it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123" />
      </MockedProvider>
    ) 

    await wait()
    wrapper.update()
    // console.log(wrapper.debug())
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
  })

  it('adds an item to the cart when clicked', async () => {
    let apolloClient
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client
            return (
              <AddToCart id="abc123" />
            )
          }}
        </ApolloConsumer>
      </MockedProvider>
    ) 

    await wait()
    wrapper.update()
    
    const {data: { me }} = await apolloClient.query({ query: CURRENT_USER_QUERY })
    expect(me.cart).toHaveLength(0) // starts with an empty cart
    // add an item
    wrapper.find('button').simulate('click')
    await wait()
    // Check the cart, destructuring me again as var me2
    const {data: { me: me2 }} = await apolloClient.query({ query: CURRENT_USER_QUERY })  
    expect(me2.cart[0].id).toBe('omg123') // no matter the quantity the count should be 0
    expect(me2.cart[0].quantity).toBe(3) // check the quantity
  })

  it('changes from add to adding when loading', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id='abc123' />
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    expect(wrapper.text()).toContain('Add to Cart ➕')

    wrapper.find('button').simulate('click')
    expect(wrapper.text()).toContain('Adding to Cart 🕓')
  })
})