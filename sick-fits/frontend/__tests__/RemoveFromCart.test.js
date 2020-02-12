import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { ApolloConsumer } from 'react-apollo'
import { MockedProvider } from 'react-apollo/test-utils'
import RemoveFromCart, { REMOVE_FROM_CART_MUTATION } from '../components/RemoveFromCart'
import Cart, { LOCAL_STATE_QUERY } from '../components/Cart'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'

// replace global alet() with a console log
// 
global.alert = console.log

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem({id: '321cba'})]
        }
      }
    }
  }, {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: {
        id: '321cba'
      }
    },
    result: {
      data: {
        removeFromCart: {
          __typename: 'CartItem',
          id: '321cba'
        }
      }
    }
  }]

describe('<RemoveFromCart />', () => {
  it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCart id="321cba" />
      </MockedProvider>
    ) 

    await wait()
    wrapper.update()
    // console.log(wrapper.debug())
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
  })
  
  it('removes the item from the cart', async () => {
    let apolloClient
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client
            return (
              <RemoveFromCart id="321cba" />
            )
          }}
        </ApolloConsumer>
      </MockedProvider>
    ) 

    await wait()
    wrapper.update()

    const {data: { me }} = await apolloClient.query({ query: CURRENT_USER_QUERY })
    expect(me.cart).toHaveLength(1) // should start with one item in the cart
    expect(me.cart[0].item.price).toEqual(5000)

    wrapper.find('button').simulate('click')
    await wait()
    wrapper.update()

    // const {data: { me2: me }} = await apolloClient.query({ query: CURRENT_USER_QUERY })
    const res = await apolloClient.query({ query: CURRENT_USER_QUERY })
    // console.log('res: ', res)
    expect(res.data.me.cart).toHaveLength(0) // should be an empty cart
  })
})