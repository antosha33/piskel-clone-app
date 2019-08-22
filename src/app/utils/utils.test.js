import { hexToRgb, rgbToHex } from './utils';

describe('convert colors', () => {
  it('should get hex color and return it as rgb color', () => {
    let res = hexToRgb('#ffffff');
    expect(res.r).toBe(255);
    expect(res.g).toBe(255);
    expect(res.b).toBe(255);

    res = hexToRgb('#000000');
    expect(res.r).toBe(0);
    expect(res.g).toBe(0);
    expect(res.b).toBe(0);
  });
  it('should get rgb color and return it as hex color', () => {
    const res = rgbToHex(251, 0, 0);
    expect(res).toBe('fb0000');
  });
});
