import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import NProgress from 'nprogress'
import Router from 'next/router'
import { MockedProvider } from 'react-apollo/test-utils'
import TakeMyMoney, { CREATE_ORDER_MUTATION } from '../components/TakeMyMoney'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'

Router.router = { push() {} }

const mocks = [
{
  request: {
    query: CURRENT_USER_QUERY
  },
  result: {
    data: {
      me: {
        ...fakeUser(),
        cart: [
          fakeCartItem()
        ]
      }
    }
  }
}
]

describe('<TakeMyMoney />', () => {
it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    // console.log('FFF: ', wrapper.debug())
    const checkoutButton = wrapper.find('ReactStripeCheckout')
    expect(toJSON(checkoutButton)).toMatchSnapshot()
  })

  it('create and order on token', async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: {
        createOrder: {
          id: 'xyz789'
        }
      }
    })

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )
    
    await wait()
    wrapper.update()
    const component = wrapper.find('TakeMyMoney').instance()
    // console.log(component)
    // manually call the onToken method of TakeMyMoney
    component.onToken({ id: 'abcd123'}, createOrderMock)
    expect(createOrderMock).toHaveBeenCalled()
    expect(createOrderMock).toHaveBeenCalledWith( { variables: { token: "abcd123" } } )
  })

  it('starts the progress bar', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    
    NProgress.start = jest.fn()

    const createOrderMock = jest.fn().mockResolvedValue({
      data: {
        createOrder: {
          id: 'xyz789'
        }
      }
    })

    const component = wrapper.find('TakeMyMoney').instance()
    component.onToken({ id: 'abcd123'}, createOrderMock)

    expect(NProgress.start).toHaveBeenCalled()
  })

  it('Routes to the order page when completed', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    
    Router.router.push = jest.fn()

    const createOrderMock = jest.fn().mockResolvedValue({
      data: {
        createOrder: {
          id: 'xyz789'
        }
      }
    })

    const component = wrapper.find('TakeMyMoney').instance()
    component.onToken({ id: 'abcd123'}, createOrderMock)
    await wait()
    // expect(Router.router.push).toHaveBeenCalled()
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: '/order',
        query: {
          id: "xyz789",
        }
    })
  })
})