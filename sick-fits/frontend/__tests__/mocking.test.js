function Person(name, foods) {
  this.name = name;
  this.foods = foods
}

// simulating an api call with setTimeout
Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(this.foods), 2000);
  });
}

describe('mocking learning', () => {
  it('mocks a reg function', () => {
    // fake an api endpoint
    const fetchDogs = jest.fn()
    fetchDogs('snickers')
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith('snickers')
    fetchDogs('hugo')
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });

  it('can create a person', () => {
    const me = new Person('Will', ['Pizza', 'Burgers'])
    expect(me.name).toBe('Will')
  })

  it('can fetch foods', async () => {
    const me = new Person('Will', ['Pizza', 'Burgers'])
    // mock the fetchFavFoods function
    me.fetchFavFoods = jest.fn().mockResolvedValue(['Sushi', 'Ramen'])
    const favFoods = await me.fetchFavFoods()
    console.log(favFoods)
    expect(favFoods).toContain('Sushi')
  })
});