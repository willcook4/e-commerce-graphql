import calcTotalPrice from '../lib/calcTotalPrice'
import { fakeCartItem, fakeItem } from '../lib/testUtils'

describe.only('calcTotalPrice Function', () => {
  it('handles an empty cart(0 cart items)', () => {
    expect(calcTotalPrice([])).toEqual(0)
  })

  it('handles items for free(0 price)', () => {
    const cart = [fakeCartItem({item: fakeItem({price: 0})})]
    expect(calcTotalPrice(cart)).toEqual(0)
  })

  it('returns the correct price for one item', () => {
    const quantity = 1
    const price = 11100
    const cart = [fakeCartItem({quantity, item: fakeItem({price})})]
    expect(calcTotalPrice(cart)).toEqual(price)
  })

  it('returns the correct price for multiple quantity of an item', () => {
    const cart = [fakeCartItem({quantity: 5, item: fakeItem({price: 123}) })]
    expect(calcTotalPrice(cart)).toEqual(615)
  })

  it('returns the correct price for multiple items of single quantity', () => {
    const cart = [
      fakeCartItem({quantity: 1, item: fakeItem({price: 321}) }),
      fakeCartItem({quantity: 1, item: fakeItem({price: 123}) })
    ]
    expect(calcTotalPrice(cart)).toEqual(444)
  })

  it('returns the correct price for multiple items of multiple quantities', () => {
    const cart = [
      fakeCartItem({quantity: 2, item: fakeItem({price: 321}) }), // 2*321 = 642
      fakeCartItem({quantity: 5, item: fakeItem({price: 123}) }), // 5*123 = 615
      fakeCartItem({quantity: 3, item: fakeItem({price: 231}) }), // 3*231 = 693
    ]                                                             //       = 1950
    expect(calcTotalPrice(cart)).toEqual(1950)
  })
})