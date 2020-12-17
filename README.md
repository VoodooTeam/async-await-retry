<div align="center">
<b>Async / Await exponential retry</b><br/>
<br/><br/>
</div>

[![GitHub release](https://badge.fury.io/js/async-await-retry.svg)](https://github.com/VoodooTeam/async-await-retry/releases/)
[![GitHub license](https://img.shields.io/github/license/VoodooTeam/async-await-retry)](https://github.com/VoodooTeam/async-await-retry/blob/master/LICENSE)
[![CI pipeline](https://github.com/VoodooTeam/async-await-retry/workflows/Node.js%20CI/badge.svg)](https://github.com/VoodooTeam/async-await-retry/actions?query=workflow%3A%22Node.js+CI%22)
[![Opened issues](https://img.shields.io/github/issues-raw/VoodooTeam/async-await-retry)](https://github.com/VoodooTeam/async-await-retry/issues)
[![Opened PR](https://img.shields.io/github/issues-pr-raw/VoodooTeam/async-await-retry)](https://github.com/VoodooTeam/async-await-retry/pulls)
[![DeepScan grade](https://deepscan.io/api/teams/12068/projects/15025/branches/292974/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=12068&pid=15025&bid=292974)
[![Code coverage](https://codecov.io/gh/VoodooTeam/async-await-retry/branch/master/graph/badge.svg)](https://codecov.io/gh/VoodooTeam/async-await-retry)
![Dependencies](https://img.shields.io/david/VoodooTeam/async-await-retry)


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

| Option          | description                                | Default value    |
| --------------- |:------------------------------------------:|:----------------:|
| `retriesMax`    | Maximum number of retries                  | 3                |
| `interval`      | Delay in ms between two tentatives         | 0                |
| `exponential`   | Will the interval increase exponentially ? | true             |
| `factor`        | The exponential factor to use              | 2                |
| `jitter`        | Random jitter in ms to add to the interval | 0                |
| `isCb`          | Old callback function style ?              | false            |
| `onAttemptFail` | User's callback to manage retry system     | default fallback |


An example of custom options :
```javascript
const retry = require('async-await-retry');

try {
    const res = await retry(async () => {
      return new Promise((resolve) => resolve('OK'))
    }, null, {retriesMax: 4, interval: 100, exponential: true, factor: 3, jitter: 100})
    
    console.log(res) // output : OK
} catch (err) {
    console.log('The function execution failed !')
}
```

## onAttemptFail
This method can be used to manage, by yourself, the retry system.
It's called when an error occurred and before to retry.
This method can have three behaviors:
- you can throw an error
- if it returns truthy value then normal retry system continues
- if it returns falsy value then the retry system stop

```javascript
const retry = require('async-await-retry');

try {
    const res = await retry(MyfuncToRetry, null, {
        onAttemptFail: (data) => {
            // do some stuff here, like logging errors
        }
    });
} catch (err) {
    console.log('The function execution failed !')
}
```

The data argument is an object that can be described like this:

| Property        | description                                |
| --------------- |:------------------------------------------:|
| `error`         | The current error object                   |
| `currentRetry`  | The current retry value                    |
| `retriesMax`    | Maximum number of retries                  |
| `interval`      | Delay in ms between two tentatives         |
| `exponential`   | Will the interval increase exponentially ? |
| `factor`        | The exponential factor to use              |
| `jitter`        | Random jitter in ms to add to the interval |

# Test

```console
$ npm test
```

Coverage report can be found in coverage/.
