
# Contributing

### Setup
```bash
git clone https://github.com/tianjianchn/updatex
cd updatex
npm install
```

### Develop
```bash
npm run build # Build once
npm run watch # Build then watch `src` files and build if changed
npm run test:only -s # No build task involved. Use -s to make npm hide its fail stack
npm test # Run lint, clean, build and test:only tasks
```
