import { LimitStrPipe } from './limit-str.pipe';

describe('LimitStrPipe', () => {
  it('create an instance', () => {
    const pipe = new LimitStrPipe();
    expect(pipe).toBeTruthy();
  });
});
