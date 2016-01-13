
1.0.0 / 2016-01-13
==================

  * uses varson and parsedir to handle parsing duties

0.8.0 / 2015-06-25
==================

  * be able to register a new helper with confi.registerHelper
  * random helper
  * jshint fixes


0.7.0 / 2015-05-13
==================

  * remove reset from tests
  * {{require file}} helper
  * added CWD as current working directory variable
  * Loops through the parsed output up to 10 times to make sure nested variables are processed.


0.6.0 / 2015-03-26
==================

  * Allows path to be an array of paths.

0.5.0 / 2015-03-18
==================

  * Merge pull request #9 from firstandthird/feature/default-helper
  * Switched to handlebars to support default value helper.


0.4.0 / 2015-03-18
==================

  * Exposes process.env
  * Allows variable variables :inception:
  * Allows multiple config files per environment.
  * Removes singleton.


0.3.1 / 2013-05-07
==================

  * fixed dep

0.3.0 / 2013-05-07
==================

  * added yaml support

0.2.1 / 2013-04-22
==================

  * updated path.existsSync to use fs for node 0.8
  * added npm test
  * specific versions for dep

0.2.0 / 2012-05-04
==================

  * user specific configs

0.1.0 / 2012-05-02
==================

  * added env to result

0.0.6 / 2012-04-17
==================

  * would help to make the change everywhere
  * changed configDirectory option to path

0.0.5 / 2012-04-17
==================

  * changed configDirectory option to path

0.0.4 / 2012-04-13
==================

  * aug deep for nested config settings
  * added cjson to allow comments in config files
  * only read config once and then cache
  * updated to use aug deep
  * changed to allow require('confi')() instead of load()

Older Releases
==============

  * fixed config directory setting from env var
  * set config path through env var
  * renamed to confi
  * initial commit
