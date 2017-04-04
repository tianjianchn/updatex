Immutable and predictive to update json data
=================================

### Example
```js
import updatex from 'updatex';

const obj = { a: {b: {c: 1}};

const obj2 = updatex(obj, (newObj)=>{
  const b = newObj.select('a.b');
  b.c = 2;
})
```

### Why?
1. There are many `immutable` libraries like [immutable](https://www.npmjs.com/package/immutable), [seamless-immutable](https://www.npmjs.com/package/seamless-immutable). But they may either change your fundamental data structure, or need you use extraneous methods to mutate the data. For a simple usage, [spread syntax(...)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) is efficient, then you can use normal mutation ways like `obj.a = x` and `arr.push()`. 
2. But it's a big pain to write in a deep structure, and it provides a large surface area for bugs. So we need freeze the original value to prevent accidental changes on it, especially in development environment. 

These two reasons above bring `updatex`.

### Features
* Internally use spread syntax(`...`) to copy value, then you can directy mutate the value
* Auto freeze the original value in development environment, but off in production environment
* Ahead declare the path you will mutate on, to constrain the mutation scope
* Auto check over-selecting path on the end, and warn if occured
* No more repeated data clone, you are forced to do mutations in a batch mode
* No need to reassign the new value and return at last

### Installation
```js
yarn add updatex
```
or if your'd like to use npm:
```js
npm install updatex
```

### API

#### updatex(input: object|array, updater: (obj)=>void)
Do mutation on input data. Only works with plain object and array, others will return the input directly. All updates should be done in `updater` function.

#### select(path: string|array)
Declare the path you will mutate on, all nodes on the path will be cloned. Then you can use assignment syntax(`=`) and other mutation methods to manipulate the nodes.
```js
updatex(state, (newState)=>{
  const user = newState.select('users.0');
  user.name = 'Tian'

  newState.users.push({name: 'Jian'})
})
```

#### config(name, value)
Set the config. Currently only one config: `freeze`. 
* `freeze`: Whether using `Object.freeze` to make the input and output readonly. 
  * Default `true` in development environment, `false` in production enviroment(`process.env.NODE_ENV==='production'`)
```js
updatex.config('freeze', false);
```


### Contributing
Checkout the [CONTRIBUTING.md](/CONTRIBUTING.md) if you want to help

### License
Licensed under MIT

Copyright (c) 2017 [Tian Jian](https://github.com/tianjianchn)
