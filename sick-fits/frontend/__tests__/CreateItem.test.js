import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import Router from 'next/router'
import { MockedProvider } from 'react-apollo/test-utils'
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem'
import { fakeItem } from '../lib/testUtils'

const dogImage = 'https://dog.com/dog.jpg'

// mock the global fetch API
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [{
      secure_url: dogImage
    }]
  })
})

describe('<CreateItem />', () => {
it('renders and matches the snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )

    const form = wrapper.find('form[data-test="form"]')
    // console.log(form.debug())
    expect(toJSON(form)).toMatchSnapshot()
  })

it('uploads a file when changed', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )

    const input = wrapper.find('input[type="file"]')
    input.simulate('change', { target: { files: ['fakedog.jpg'] }})
    await wait()
    wrapper.update()
  
    // check the state of CreateItem
    const component = wrapper.find('CreateItem').instance()

    expect(component.state.image).toEqual(dogImage)
    expect(component.state.largeImage).toEqual(dogImage)
    expect(global.fetch).toHaveBeenCalled()
    global.fetch.mockReset()
  })

it('handles state updating', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )

    const testTitle = 'Testing'
    const testPrice = 50000
    const testDescription = 'This is a nice item'

    wrapper.find('#title').simulate('change', { target: { value: testTitle, name: 'title' }})
    wrapper.find('#price').simulate('change', { target: { value: testPrice, name: 'price', type: 'number' }})
    wrapper.find('#description').simulate('change', { target: { value: testDescription, name: 'description' }})

    expect(wrapper.find('CreateItem').instance().state).toMatchObject({
      title: testTitle,
      price: testPrice,
      description: testDescription
    })
  })

  it('creates and item when the form is submitted', async () => {
    const item = fakeItem()
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            description: item.description,
            image: '', // not testing as this is already done in the 'uploads a file when changed' test
            largeImage: '', // not testing as this is already done in the 'uploads a file when changed' test
            price: item.price
          }
        },
        result: {
          data: {
            createItem: {
              ...item,
              typename: 'Item'
            }
          }
        }
      }
    ]

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    )

    // simulate someone filling out the form

    const testTitle = item.title
    const testPrice = item.price
    const testDescription = item.description

    wrapper.find('#title').simulate('change', { target: { value: testTitle, name: 'title' }})
    wrapper.find('#price').simulate('change', { target: { value: testPrice, name: 'price', type: 'number' }})
    wrapper.find('#description').simulate('change', { target: { value: testDescription, name: 'description' }})

    // mock the router
    Router.router = { push: jest.fn() }

    wrapper.find('form').simulate('submit')

    await wait(50)
    expect(Router.router.push).toHaveBeenCalled() // does the redirect?
    expect(Router.router.push).toHaveBeenCalledWith({ pathname: "/item", query: { id: "abc123" }}) // with the correct path
  })
})