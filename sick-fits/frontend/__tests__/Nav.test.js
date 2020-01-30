import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeUser, fakeCartItem } from '../lib/testUtils'
import { CURRENT_USER_QUERY } from '../components/User'
import Nav from '../components/Nav'

const notSignedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: null
      }
    }
  }
]

const signedInMock = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: fakeUser()
      }
    }
  }
]

const signedInWithCartItemsMock = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [
            fakeCartItem(),
            fakeCartItem(),
            fakeCartItem(),
          ]
        }
      }
    }
  }
]

describe('<Nav />', () => {
  it('renders a minimal nav when signed out', async () => {
      const wrapper = mount(
        <MockedProvider mocks={notSignedInMocks}>
          <Nav />
        </MockedProvider>
      )
      await wait(0)
      wrapper.update()
      const nav = wrapper.find('ul[data-test="nav"]')
      expect(toJSON(nav)).toMatchSnapshot()
  })

  it('renders a full nav when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMock}>
        <Nav />
      </MockedProvider>
    )
    await wait(0)
    wrapper.update()
    const nav = wrapper.find('ul[data-test="nav"]')
    expect(nav.children().length).toBe(6)
    expect(nav.text()).toContain('Sign Out')

    expect(nav.text()).toContain('Shop')
    expect(nav.find('a[href="/items"]').exists())

    expect(nav.text()).toContain('Sell')
    expect(nav.find('a[href="/sell"]').exists())

    expect(nav.text()).toContain('Orders')
    expect(nav.find('a[href="/orders"]').exists())

    expect(nav.text()).toContain('Account')
    expect(nav.find('a[href="/me"]').exists())
    
    // NOTE, snapshots were massive so swapped with targeted tests ^^^
    // expect(toJSON(nav)).toMatchSnapshot()
  })

  it('renders the amount of items in the cart', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInWithCartItemsMock}>
        <Nav />
      </MockedProvider>
    )
    await wait(0)
    wrapper.update()
    // console.log(wrapper.debug())
    const nav = wrapper.find('ul[data-test="nav"]')
    const count = nav.find('div.count')
    // expect(count.text()).toEqual('9')
    expect(toJSON(count)).toMatchSnapshot()
  })
})