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
    const isExpectedError = error.message === 'File to import not found or unreadable: ./breakpoints.scss.';
    if (isExpectedError) {
      console.log('The expected error occurred. Exiting now which may trigger the segmentation fault error in the still running process(es).');
    } else {
      console.error('An unexpected error occurred:', error);
    }
    // This part is essential to the segmentation fault. Normally it would be an exit code of `1`, but I actually want
    // the build to pass if it fails without the signal SIGSEGV.
    process.exit(isExpectedError ? 0 : 1);
  }
}

// Register a segfault handler for more debug information
var SegfaultHandler = require("segfault-handler");
SegfaultHandler.registerHandler("crash.log");

const simultaneousBuilds = process.env.MAX_SIMULTANEOUS_BUILDS || 2;
console.log(`Starting ${simultaneousBuilds} build(s)`);
// Run multiple builds simultaneously to increase the likelihood of a segmentation fault
for (let i = 0; i < simultaneousBuilds; i++) {
  build();
}
