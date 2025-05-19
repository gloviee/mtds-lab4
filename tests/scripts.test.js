const { getRandomItem, items } = require('../public/script');

describe('getRandomItem', () => {
  test('returns an item from items array', () => {
    const item = getRandomItem();
    expect(items).toContain(item);
  });
});
