<h1 align="center">Confi</h1>

<p align="center">
  <a href="https://github.com/firstandthird/confi/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/confi/Test/main?label=Tests&style=for-the-badge" alt="Test Status"/>
  </a>
  <a href="https://github.com/firstandthird/confi/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/confi/Lint/main?label=Lint&style=for-the-badge" alt="Lint Status"/>
  </a>
</p>

Confi loads configuration data from yaml, json or from a `package.json` with support for `NODE_ENV` overrides.


## Installation

```sh
npm install confi
```

_or_

```sh
yarn add confi
```


## Usage

_Note: `confi()` is an async method._

_Note: Default configuration directory is `./conf/`_

Configuration files that start with `default` are loaded and merged together. This allows you to split up configuration logic into smaller files.

You can create a file that matches `NODE_ENV` which will apply it's values on top of anything set in default. This allows you to create configuration for production and development environments.

User specific configuration can be created as well by placing config files in a `users` directory inside of the config directory.

__`./conf/default.yaml`__
```yaml
title: 'Example Site'
site:
  name: '{{ title }} - DEV'
updateEvery: '{{ ms("1h") }}
appId: '{{ getEnv("APP_ID", '09830948029384') }}'
shot: false
```

__`./conf/users/han.json`__
```json
{
  "shot": true
}
```

__`./conf/production.yaml`__
```yaml
site:
  name: '{{ title }}'
updateEvery: '{{ getEnv("UPDATE_EVERY", ms("1h")) }}'
```

__Basic__
```javascript
const confi = require('confi');

async function startApp() {
  const config = await confi();

  console.log(config.site.name); // Example Site - DEV
  console.log(config.appId); // 09830948029384
  console.log(config.updateEvery); // 3600000
  console.log(config.shot); // false
}

startApp();
```

__User__
```javascript
const confi = require('confi');

async function startApp() {
  const config = await confi({
    user: 'han'
  });

  console.log(config.site.name); // Example Site - DEV
  console.log(config.appId); // 09830948029384
  console.log(config.updateEvery); // 3600000
  console.log(config.shot); // true
}

startApp();
```

__Environment__
```javascript
// imagine process.env.UPDATE_EVERY is 10000
const confi = require('confi');

async function startApp() {
  const config = await confi({
    env: 'production'
  });

  console.log(config.site.name); // Example Site
  console.log(config.appId); // 09830948029384
  console.log(config.updateEvery); // 10000
  console.log(config.shot); // true
}

startApp();
```

For more examples, see the test directory.


## Options

### `confi([options])`

  - `path` - Supply an alternate path to load config from. Default: `process.env.CONFI_PATH` or `./conf`
  - `env` - Manually set the envitonment. Default: `dev`
  - `userPath` - Path for user overrides. Default: `./conf/users`
  - `context` - Advanced option to pass additional information to `varson` for parsing configs.
  - `helpers` - Additional helper methods to expose.
  - `user` - Which user shall the user config be loaded for.


# Helpers

Confi comes with a set of helper methods. You can find [documentation for them here](https://github.com/firstandthird/confi-helpers).

---

<a href="https://firstandthird.com"><img src="https://firstandthird.com/_static/ui/images/safari-pinned-tab-62813db097.svg" height="32" width="32" align="right"></a>

_A [First + Third](https://firstandthird.com) Project_
