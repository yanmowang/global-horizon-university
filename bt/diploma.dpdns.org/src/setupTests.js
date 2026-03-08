import '@testing-library/jest-dom';

// 添加TextEncoder和TextDecoder polyfills
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
  global.TextDecoder = require('util').TextDecoder;
}

// 添加全局fetch polyfill
global.fetch = require('jest-fetch-mock');
require('jest-fetch-mock').enableMocks();
