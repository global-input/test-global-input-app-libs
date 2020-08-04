// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// const mockConsoleMethod = (realConsoleMethod:any) => {
//     const ignoredMessages = [
//       "test was not wrapped in act(...)"
//     ];
  
//     return (message:any, ...args:any) => {
//       const containsIgnoredMessage = ignoredMessages.some((ignoredMessage) => message.includes(ignoredMessage));
  
//       if (!containsIgnoredMessage) {
//         realConsoleMethod(message, ...args);
//       }
//     };
//   };
  
//   // Suppress console errors and warnings to avoid polluting output in tests.
//   console.warn = jest.fn(mockConsoleMethod(console.warn));
//   console.error = jest.fn(mockConsoleMethod(console.error));