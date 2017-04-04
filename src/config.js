
const config = {
  freeze: process.env.NODE_ENV !== 'production',
};
export default config;

export function set(key, value) {
  if (key === 'freeze') {
    config[key] = !!value;
  }
}
