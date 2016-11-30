[![Build Status](https://secure.travis-ci.org/MorganConrad/metalsmith-inspect.png)](http://travis-ci.org/MorganConrad/metalsmith-inspect)
[![License](http://img.shields.io/badge/license-MIT-A31F34.svg)](https://github.com/MorganConrad/metalsmith-inspect)
[![NPM Downloads](http://img.shields.io/npm/dm/metalsmith-inspect.svg)](https://www.npmjs.org/package/metalsmith-inspect)


# metalsmith-inspect
A [Metalsmith](http://www.metalsmith.io/) plugin to inspect your file objects.
Similar to [metalsmith-debug](https://www.npmjs.com/package/metalsmith-debug), but offers some other options (and missing some too!).  **Inspect's** usage is more explicit, with no need to set a DEBUG environment variable.  No spooky action at a distance.  YMMV.

Also, this converts the value of `contents` to a String, far more human-readable than an array of ASCII codes.

By default, **inspect** collects all the file objects into a bigJSObject, then calls `console.dir(bigJSObject)` (_i.e._ `util.inspect()`).

### Usage

Install as usual,  `npm install metalsmith-inspect`.

Javascript:  `use(inspect(options))`

CLI: Haven't tested it yet.  You'd lose a few options since it can't support functions.

#### General options

**options.fileFilter** determines which files will be included
 - if missing, include all files.
 - if a string or Regex, only include matching filePaths.
 - if a user-provided-function, include the file when `filter(filePath, data, metalsmith)` returns true.  
 _e.g._ If you want to use [multimatch](https://www.npmjs.com/package/multimatch), pass something like `function(filePath) { return multimatch([filePath], ["blogs/**", ...])[0] };`

**options.includeMetalsmith**   if present, include metalsmith metadata under the "file" of that name.
 _e.g._ if options.includeMetalsmith = "__msmetadata__" it will appear in the bigJSObject under the "__msmetadata__" key.

**options.printfn** determines what will be done with bigJSObject.  Default is `console.dir(bigJSObject, {colors: true});`
 But, if you want to save it to a database or email it to your Russian hacker friends, you can change that here.

**options.disable** a quick way to turn inspect off (like unsetting the DEBUG environment variable)

**options.contentsAsBuffer** if true, keep `.contents` as a Buffer, for those who like to read ASCII codes.

#### Options controlling which fields are included
Normally, all fields are included.  There are several _mutually exclusive_ ways to limit which fields will be included:

**options.include: [key1, key2, ...]**  only include fields in the array.

**options.exclude: [key1, key2, ...]**  include all fields _except_ those in the array.  (I like to exclude "stats", and sometimes "next" and "prev" if using collections.)

**options.accept: function(keyname, filedata)**  include field if the user-provided function returns truthy.

### Notes, Todos, and Caveats

I wrote this because I was having trouble getting metalsmith-debug to work, and because I saw some possible improvements.  Hoping this is useful to the metalsmith community.
