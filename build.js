const rollup = require("rollup");
const postcss = require("rollup-plugin-postcss");
const resolve = require("rollup-plugin-node-resolve");

const config = {
  input: "src/index.js",
  output: {
    file: "bundle.js",
    format: "cjs"
  },
  plugins: [
    resolve({
      mainFields: ["module", "main", "browser"]
    }),
    postcss()
  ],
};

async function build() {
  try {
    console.log('Attempting to build. This will regularly trigger a SIGSEGV (segmentation fault) error. You may need to run this command multiple times to trigger it.');
    let bundle = await rollup.rollup(config);
    await bundle.write(config.output);
  } catch (error) {
    // This part is essential to the segmentation fault. Normally it would be an exit code of `1`, but I actually want
    // the build to pass if it fails without the signal SIGSEGV.
    process.exit(0);
  }
}

// Register a segfault handler for more debug information
var SegfaultHandler = require("segfault-handler");
SegfaultHandler.registerHandler("crash.log");

build();
