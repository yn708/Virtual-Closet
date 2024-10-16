describe('Sample Test', () => {
  it('should add two numbers correctly', () => {
    const sum = (a: number, b: number): number => a + b;
    expect(sum(1, 2)).toBe(3);
  });
});
