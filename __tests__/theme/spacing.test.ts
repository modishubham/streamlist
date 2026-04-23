import {homeRowCardDimensions, stitchLayout} from '../../src/theme/spacing';

describe('homeRowCardDimensions', () => {
  it('fits two cards and one gap between screen gutters', () => {
    const w = 390;
    const {width, height} = homeRowCardDimensions(w);
    const row =
      stitchLayout.screenGutter +
      width +
      stitchLayout.posterRowGap +
      width +
      stitchLayout.screenGutter;
    expect(row).toBe(w);
    expect(height).toBe(
      Math.round(
        (width * stitchLayout.posterHeight) / stitchLayout.posterWidth,
      ),
    );
  });
});
