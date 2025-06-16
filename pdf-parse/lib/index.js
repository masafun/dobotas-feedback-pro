const fs = require('fs');

module.exports = function (buffer) {
  return Promise.resolve({
    text: buffer.toString()
  });
};
