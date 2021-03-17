# Version 1.2.0 released on 2020-12-17

**Jitter**

Most exponential backoff algorithms use jitter (randomized delay) to prevent successive collisions.

[Release](https://github.com/VoodooTeam/async-await-retry/releases/tag/1.2.0) - Version 1.2.0

# Version 1.0.0 released on 2019-01-11

## Features

**Retry a function**

This main feature is to retry a function until it succeeds.   
A configuration object can help to adapt to each use case.

[Release](https://github.com/VoodooTeam/async-await-retry/releases/tag/1.0.0) - Version 1.0.0

**Exponential retry**

Exponential retry allow a function to increase the waiting time between reties after each retry failure.  
It can be very useful in case of network errors or third party failure to let the time to those external components to retrieve a stable state.

