import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import Router from 'next/router'
import Pagination, { PAGIANTION_QUERY } from '../components/Pagination'

Router.router = {
  push() {},
  prefetch() {},
}

function makesMocksFor(length) {
  return [
    {
      request: {
        query: PAGIANTION_QUERY,
        // vvv These are already defaulted they aren't needed in the request
        // variables: { 
        //   skip: 0,
        //   first: 4
        // }
      },
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              __typename: 'count',
              count: length
            }
          }
        }
      }
    }
  ] 
}

describe('<Pagination />', () => {
it('displays a loading message', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makesMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    ) 
    
    const pagination = wrapper.find('[data-test="pagination"]')

    expect(wrapper.text()).toContain( '...Loading' )
  })

it('renders pagination for 18 items', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makesMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    ) 
    
    expect(wrapper.text()).toContain( '...Loading' )
    await wait(0)
    wrapper.update()
    expect(wrapper.find('.total-pages').text()).toEqual('5')

    const pagination = wrapper.find('div[data-test="pagination"]')
    expect(toJSON(pagination)).toMatchSnapshot()
  })

it('disables prev button on the first page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makesMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    ) 
    
      expect(wrapper.text()).toContain( '...Loading' )
      await wait(0)
      wrapper.update()
      expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true)
      expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false)
  })

it('disables next button on the last page', async () => {
      const wrapper = mount(
        <MockedProvider mocks={makesMocksFor(18)}>
          <Pagination page={5} />
        </MockedProvider>
      ) 
      
      expect(wrapper.text()).toContain( '...Loading' )
      await wait(0)
      wrapper.update()
      expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false)
      expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true)
  })

it('enables all buttons on a middle page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makesMocksFor(18)}>
        <Pagination page={3} />
      </MockedProvider>
    ) 
    
    expect(wrapper.text()).toContain( '...Loading' )
    await wait(0)
    wrapper.update()
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false)
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false)    
  })
}) 
