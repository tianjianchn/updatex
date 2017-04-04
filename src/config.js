

const config = {
  freeze: process.env.NODE_ENV !== 'production',
  set,
};
export default config;

function set(key, value) {
  if (key === 'freeze') {
    config[key] = !!value;
  }
}
