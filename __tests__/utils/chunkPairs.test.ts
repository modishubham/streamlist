import {chunkPairs} from '../../src/utils/chunkPairs';

describe('chunkPairs', () => {
  it('groups items into rows of two', () => {
    expect(chunkPairs([1, 2, 3, 4])).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('leaves a single item in the last row when count is odd', () => {
    expect(chunkPairs(['a', 'b', 'c'])).toEqual([['a', 'b'], ['c']]);
  });

  it('returns an empty array for an empty input', () => {
    expect(chunkPairs<number>([])).toEqual([]);
  });
});
