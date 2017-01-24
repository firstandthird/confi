
4.1.1 / 2017-01-24
==================

  * updated aug and eslint config

4.1.0 / 2017-01-11
==================

  * supports 'key' and 'path' for package (#31)
  * chore(package): update dependencies (#30)

4.0.1 / 2016-12-10
==================

  * updated aug to 1.0.1

4.0.0 / 2016-12-10
==================

  * updated aug to 1.0.0

3.2.1 / 2016-12-09
==================

  * update varson dep. set other deps to fixed version

3.2.0 / 2016-11-06
==================

  * options.package can also be a path to a package.json (#29)

3.1.1 / 2016-10-21
==================

  * updated varson

3.1.0 / 2016-10-21
==================

  * updated varson

3.0.0 / 2016-10-04
==================

  * updated varson to 0.4.0
  * reads from CWD/package.json (#28)
  * Confi support for file prefix (#27)

2.3.0 / 2016-07-02
==================

  * updated varson to 0.3.0

2.2.0 / 2016-06-28
==================

  * updated varson to 0.2.0 to support objects

2.1.1 / 2016-06-24
==================

  * updated varson to 0.1.3
  * travisci badge added to readme, covers node 4,5,6
  * added some more node versions to travis
  * travis!
  * added a test for an unsupported, future feature

2.1.0 / 2016-05-30
==================

  * added helpers that are functions that can be called, but don't get added to config object

2.0.2 / 2016-05-22
==================

  * updated varsion to 0.1.2

2.0.1 / 2016-05-22
==================

  * updated varson

2.0.0 / 2016-05-20
==================

  * updated varson to 0.1.0
  * es6 and linted
  * will throw an error if it can't parse any file

1.2.0 / 2016-02-16
==================

  * pass in username instead of reading from env var
  * be able to pass in context to set functions, other data before running

1.1.0 / 2016-02-15
==================

  * updated dependencies
  * fixed linting errors
  * added linting

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
