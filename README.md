<div align="center">
<b>Async / Await exponential retry</b><br/>
<br/><br/>

<a href="https://badge.fury.io/js/async-await-retry">
   <img src="https://badge.fury.io/js/async-await-retry.svg" alt="npm version" height="18">
</a>
</div>


# Purpose

Minimalist, efficient and performance focused retry system.
Basically it helps developer to retry a function with a specific interval, exponential factor etc.

No dependency.

# Compatibility

**/!\ This module use async/await syntax, this is why you must have node 7.6+.**

Supported and tested : >= 7.6

| Version       | Supported     | Tested         |
| ------------- |:-------------:|:--------------:|
| 10.x          | yes           | yes            |
| 9.x           | yes           | yes            |
| 8.x           | yes           | yes            |
| >= 7.6        | yes           | yes            |

# Installation

```console
$ npm install async-await-retry --save
```

# Usage

## Basic usage
```javascript
const retry = require('async-await-retry');

const func = async () => {return new Promise((resolve) => resolve('OK'))};

try {
    const res = await retry(func)
} catch (err) {
    console.log('The function execution failed !')
}
```

## Sync function syntax
```javascript
const retry = require('async-await-retry');

const func = () => {...};

try {
    const res = await retry(func)
    console.log(res) // output : OK
} catch (err) {
    console.log('The function execution failed !')
}
```

## Anonymous function style
```javascript
const retry = require('async-await-retry');

try {
    const res = await retry(async () => {
      return new Promise((resolve) => resolve('OK'))
    })
    
    console.log(res) // output : OK
} catch (err) {
    console.log('The function execution failed !')
}
```

## Callback function style
```javascript
const retry = require('async-await-retry');

try {
    const res = await retry((arg1, cb) => {
        ....
        cb(err, data); // send err as first argument
    }, ["arg1"], {isCb: true});
} catch (err) {
    console.log('The function execution failed !')
}
```

# Options

## retry(function, [args], [config])

* `function` : function to retry in case of error
* `args` : your function's parameters in case you don't use callback style
* `config` : an object containing all retry process options

## options

| Option        | description                                | Default value  |
| ------------- |:------------------------------------------:|:--------------:|
| `retriesMax`  | Maximum number of retries                  | 3              |
| `interval`    | Delay in ms between two tentatives         | 0              |
| `exponential` | Will the interval increase exponentially ? | true           |
| `factor`      | The exponential factor to use              | 2              |
| `isCb`        | Old callback function style ?              | false          |


An example of custom options :
```javascript
const retry = require('async-await-retry');

try {
    const res = await retry(async () => {
      return new Promise((resolve) => resolve('OK'))
    }, null, {retriesMax: 4, interval: 100, exponential: true, factor: 3})
    
    console.log(res) // output : OK
} catch (err) {
    console.log('The function execution failed !')
}
```

# Test

```console
$ npm test
```

Coverage report can be found in coverage/.
