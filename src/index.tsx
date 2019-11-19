import * as React from 'react';

// The issue seems to require at least 2 SASS files. Adding more files does not seem to increase the likelihood of a SEGFAULT.
import './normalize.scss';

// Faulty file:
import './index.scss';

// Delete me
export const Thing = () => {
  return <div>the snozzberries taste like snozzberries</div>;
};
