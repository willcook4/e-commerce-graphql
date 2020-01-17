import formatMoney from '../lib/formatMoney'

describe('formatMoney Function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(9)).toEqual('$0.09');
    expect(formatMoney(40)).toEqual('$0.40');
  })
  it('leaves cents off for whole dollars', () => {
    expect(formatMoney(5000)).toEqual('$50');
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(50000000)).toEqual('$500,000');
  })
  it('works with whole and fractional dollars', () => {
    expect(formatMoney(5012)).toEqual('$50.12');
    expect(formatMoney(101)).toEqual('$1.01');
    expect(formatMoney(1012)).toEqual('$10.12');
    expect(formatMoney(114)).toEqual('$1.14');
    expect(formatMoney(34598798476945879)).toEqual('$345,987,984,769,458.80')
  })
})