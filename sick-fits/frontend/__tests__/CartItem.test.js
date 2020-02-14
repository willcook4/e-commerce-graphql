import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import CartItem from '../components/CartItem'
import { fakeCartItem } from '../lib/testUtils'

describe('<CartItem />', () => {
  it('renders and matches the snapshot', async () => {
    const cartItem = fakeCartItem()
    const wrapper = mount(
      <MockedProvider>
        <CartItem cartItem={cartItem} />
      </MockedProvider>
    )
    
    const cartItemWrapper = wrapper.find('CartItem li') 
    expect(toJSON(cartItemWrapper)).toMatchSnapshot()
  })

it('handles an item that has been removed from the store (!cartItem.item)', () => {
    const cartItem = fakeCartItem({ item: null })
    const wrapper = mount(
      <MockedProvider>
        <CartItem cartItem={cartItem} />
      </MockedProvider>
    )

    const cartItemWrapper = wrapper.find('CartItem p')
    expect(cartItemWrapper.text()).toEqual('Sorry, this cart item has been removed')
  })
})