import '@testing-library/jest-dom';

/*
Server Actionsの警告抑制
Next.jsのServer ActionsはテストでReactの標準form属性として扱われるため、
不要な警告を抑制
*/
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Invalid value for prop `action`')) {
      return;
    }
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});
