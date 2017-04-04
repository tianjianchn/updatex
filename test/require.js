
/* eslint import/no-extraneous-dependencies:off */

require('regenerator-runtime/runtime');
require('babel-register');

process.on('unhandledRejection', (err, p) => {
  console.error('Unhandled Rejection at: ', p);
  if (typeof err === 'string') console.error(err);
  else console.error(err.stack);
  process.exit(1);
});

