'use strict';
const t = require('tap');
const confi = require('../');
const path = require('path');

//t.runOnly = true;

t.test('envExists helper', async (assert) => {
  process.env.TEST_VARIABLE = 'a test variable';
  process.env.TEST_VARIABLE2 = 1;
  const config = await confi({
    config: {
      string: '{{envExists("TEST_VARIABLE")}}',
      num: '{{envExists("TEST_VARIABLE2")}}',
      no: '{{envExists("DOES_NOT_EXIST")}}',
    }
  });
  assert.match(config, {
    string: true,
    num: true,
    no: false,
  });
  assert.end();
});

t.test('ms helper', async (assert) => {
  const config = await confi({
    config: {
      oneDay: '{{ms("1d")}}'
    }
  });
  assert.deepEqual(config, {
    oneDay: 1000 * 60 * 60 * 24,
    env: 'dev'
  });
  assert.end();
});

t.test('getEnv helper', async (assert) => {
  process.env.CONFI_TEST = 'yep';
  const config = await confi({
    config: {
      test: '{{getEnv("CONFI_TEST")}}'
    }
  });
  assert.deepEqual(config, {
    test: 'yep',
    env: 'dev'
  });
  assert.end();
});

t.test('getEnv helper with default', async (assert) => {
  const config = await confi({
    config: {
      test: '{{getEnv("CONFI_TEST2", "nope")}}'
    }
  });
  assert.deepEqual(config, {
    test: 'nope',
    env: 'dev'
  });
  assert.end();
});

t.test('getEnv helper with an empty default', async (assert) => {
  const config = await confi({
    config: {
      test: '{{getEnv("CONFI_TEST2", "")}}'
    }
  });
  assert.deepEqual(config, {
    test: '',
    env: 'dev'
  });
  assert.end();
});

t.test('getEnv helper with default', async (assert) => {
  const config = await confi({
    config: {
      math: '{{add(4, 5)}}'
    },
    helpers: {
      add(a, b) {
        return a + b;
      }
    }
  });
  assert.deepEqual(config, {
    math: 9,
    env: 'dev'
  });
  assert.end();
});

t.test('getEnv helper throws error if not defined and no fallback provided', async (assert) => {
  try {
    await confi({
      config: {
        test: '{{getEnv("TheArctic")}}'
      }
    });
  } catch (e) {
    assert.equal(e.toString(), 'Error: Environment variable TheArctic was not found and no fallback was specified');
    assert.end();
  }
});

t.test('includes truthy helper', async (assert) => {
  process.env.TRUTHY_VAR = '1';
  const config = await confi({
    config: {
      anotherVar: 'true',
      envVar: '{{getEnv("TRUTHY_VAR")}}',
      varExists: '{{truthy(anotherVar)}}',
      envVarExists: '{{truthy(ENV.TRUTHY_VAR)}}',
      envVarExists2: '{{truthy(getEnv("TRUTHY_VAR"))}}',
      envVarExists3: '{{truthy(envVar)}}',
      envVarNoExists: '{{truthy(ENV.TRUTHY_VAR2)}}',
      defaultNullVal: '{{truthy(null, true)}}',
      defaultUndefinedVal: '{{truthy(undefined, true)}}',
      stringAmbiguous: '{{truthy("ambiguous")}}',
      stringTrue: '{{truthy("true")}}',
      booleanTrue: '{{truthy(true)}}',
      stringNumTrue: '{{truthy("1")}}',
      stringNum2True: '{{truthy("10")}}',
      numTrue: '{{truthy(1)}}',
      stringFalse: '{{truthy("false")}}',
      booleanFalse: '{{truthy(false)}}',
      stringNumFalse: '{{truthy("-1")}}',
      numFalse: '{{truthy(-1)}}',
      stringNum2False: '{{truthy("-10")}}',
      undef: '{{truthy(undefined)}}',
      blank: '{{truthy("")}}',
      zero: '{{truthy(0)}}',
      zeroString: '{{truthy("0")}}',
      one: '{{truthy(1)}}',
      oneString: '{{truthy("1")}}',
      nullVal: '{{truthy(null)}}',
    }
  });
  assert.equal(config.envVar, '1');
  assert.equal(config.varExists, true);
  assert.equal(config.envVarExists, true);
  assert.equal(config.envVarExists2, true);
  assert.equal(config.envVarExists3, true);
  assert.equal(config.envVarNoExists, false);
  assert.equal(config.stringTrue, true);
  assert.equal(config.booleanTrue, true);
  assert.equal(config.stringNumTrue, true);
  assert.equal(config.stringNum2True, true);
  assert.equal(config.numTrue, true);
  assert.equal(config.stringFalse, false);
  assert.equal(config.booleanFalse, false);
  assert.equal(config.stringNumFalse, false);
  assert.equal(config.stringNum2False, false);
  assert.equal(config.numFalse, false);
  assert.equal(config.stringAmbiguous, false);
  assert.equal(config.undef, false);
  assert.equal(config.blank, false);
  assert.equal(config.zero, false);
  assert.equal(config.zeroString, false);
  assert.equal(config.one, true);
  assert.equal(config.oneString, true);
  assert.equal(config.nullVal, false);
  assert.equal(config.defaultNullVal, true);
  assert.equal(config.defaultUndefinedVal, true);
  assert.end();
});

t.test('readFile helper', async (assert) => {
  const config = await confi({
    config: {
      file: `{{readFile("${path.join(__dirname, 'conf2', 'default.yaml')}")}}`
    }
  });
  assert.equal(config.file.startsWith('multiple: true'), true);
  assert.end();
});

t.test('readFileOrEnv helper', async (assert) => {
  process.env.HONGO_URL = 'hongodb://blah.db.com:1331';
  let config = await confi({
    config: {
      val1: '{{getEnvOrFile("HONGO_URL")}}',
    }
  });
  assert.equal(config.val1, process.env.HONGO_URL);
  process.env.HONGO_URL_FILE = `${path.join(__dirname, 'conf2', 'default.yaml')}`;
  config = await confi({
    config: {
      val1: '{{getEnvOrFile("HONGO_URL")}}',
    }
  });
  delete process.env.HONGO_URL_FILE;
  assert.equal(config.val1.startsWith('multiple: true'), true);
  try {
    await confi({
      config: {
        test: '{{getEnvOrFile("TheArctic")}}'
      }
    });
  } catch (e) {
    assert.equal(e.toString(), 'Error: Environment variable TheArctic was not found and no fallback was specified');
    return assert.end();
  }
  assert.fail();
});
