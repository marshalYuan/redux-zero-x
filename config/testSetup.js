const Enzyme = require("enzyme")
const Adapter = require("enzyme-adapter-react-16")
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
      .filter(prop => typeof target[prop] === 'undefined')
      .reduce((result, prop) => Object.assign({},
        result,
        {[prop]: Object.getOwnPropertyDescriptor(src, prop)}
      ), {});
    Object.defineProperties(target, props);
}
copyProps(window, global);

Enzyme.configure({ adapter: new Adapter() })


global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0)
}

console.error = message => {
  throw new Error(message)
}