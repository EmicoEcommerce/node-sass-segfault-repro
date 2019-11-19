# node-sass SEGFAULT reproduction

To reproduce run `npm run build` or `tsdx build` in the root. In this repository it doesn't happen 100% of the time so you may have to run it multiple times.

# Segmentation fault debugging

To get debug information about the SEGFAULT you can add this code snippet to the bottom of the `node_modules/tsdx/dist/index.js` file:

```js
// Register a segfault handler for more debug information
var SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler('crash.log');
```
