
import ItemComponent from '../components/Item';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
  id: 'ABCD123',
  title: 'A cool item',
  price: 4000,
  description: 'This is a really cool item',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg'
}

describe('<Item/>', () => {
  it('renders and matches the snapshot', () => {
      const wrapper = shallow(<ItemComponent item={fakeItem} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
})

/** 
 *  SHALLOW TESTING
 * 
 * 
describe('<Item/>', () => {
  it('renders the image properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)
    // console.log(wrapper.debug()) 
    const img = wrapper.find('img')
    // console.log(img.props())
    expect(img.props().src).toBe(fakeItem.image)
    expect(img.props().alt).toBe(fakeItem.title)
  })
  
  it('renders the price tag and title properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)
    // console.log(wrapper.debug())    
    const priceTag = wrapper.find('PriceTag')
    // console.log(PriceTag.debug())
    expect(priceTag.children().text()).toBe('$50')

    const title = wrapper.find('Title a')
    // console.log(Title.debug())
    expect(title.text()).toBe(fakeItem.title)
  })

  it('renders out the buttons properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)
    // console.log(wrapper.debug())
    const buttonList = wrapper.find('.buttonList')
    console.log(buttonList.debug())
    expect(buttonList.children()).toHaveLength(3)
    // console.log(buttonList.debug())
    expect(buttonList.find('Link')).toHaveLength(1)
    expect(buttonList.find('Link').exists()).toBe(true)

    expect(buttonList.find('AddToCart').exists()).toBe(true)
    expect(buttonList.find('DeleteItem').exists()).toBe(true)
  })
})

*/