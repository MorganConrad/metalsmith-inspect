var test = require('tape');
var inspect = require('../inspect.js');

// setup - need to recreate these each time
function createFiles() {
   return {
      "file1.md" : {
         title: "title of file1.md",
         contents: new Buffer('Contents for file1.md   Lorem ipsum dolor')
      },
      "file2.html" : {
         title: "title of file2.html",
         contents: new Buffer('Contents for file2.html Lorem ipsum dolor')
      }
   }
};

// need this
function done(err) { if (err) throw err; }

var result;

function myPrintFn(bigJSObject) {
   result = bigJSObject;
}

var mockMetalsmith = {
   metadata: function() { return 'this is mock Metadata'; }
}

test('include and exclude', function(t) {
   var files = createFiles();
   inspect( { printfn: myPrintFn }) (files, null, done);
   t.equals(result['file1.md'].title, 'title of file1.md');
   t.equals(result['file2.html'].contents, 'Contents for file2.html Lorem ipsum dolor');

   inspect( { printfn: myPrintFn, include: ['title'] })(files, null, done);
   t.true(result['file1.md'].title);
   t.false(result['file2.html'].contents);

   inspect( { printfn: myPrintFn, exclude: ['title'] })(files, null, done);
   t.false(result['file1.md'].title);
   t.true(result['file2.html'].contents);

    t.end();
});


test('filefilter', function(t) {
   var files = createFiles();

   // test Regex and string
   inspect( { printfn: myPrintFn, filter : /md$/})(files, null, done);
   var results = Object.keys(result);
   t.equals(results.length, 1);
   t.equals(results[0], 'file1.md');

   inspect({ printfn: myPrintFn, filter: 'html$'})(files, null, done);
   var results = Object.keys(result);
   t.equals(results.length, 1);
   t.equals(results[0], 'file2.html');

   // test user provided function
   inspect({ printfn: myPrintFn,
             filter: function(filePath){ return 'file1.md' === filePath} }
             )(files, null, done);

    var results = Object.keys(result);
    t.equals(results.length, 1);
    t.equals(results[0], 'file1.md');

   t.end();
});

test('includeMetalsmith', function(t) {
   var files = createFiles();
   inspect( { printfn: myPrintFn, includeMetalsmith : 'mshere'})(files, mockMetalsmith, done);
   t.equals(result.mshere, 'this is mock Metadata');
   t.end();
 });


test('contentsAsBuffer', function(t) {
   var files = createFiles();
   inspect( { printfn: myPrintFn, contentsAsBuffer : true})(files, null, done);
   t.true(result['file1.md'].contents instanceof Buffer);

   t.end();
});

// test('examples similar to README', function(t) {
//    var files = createFiles();
//    keymaster(function(data) {
//                 return data.contents.toString().substring(24, 35);  // slight change from readme
//              },
//              'excerpt')(files, null, done);
//    keymaster(function(data, filePath) {
//                return filePath;
//             },
//             'yourKeyHere')(files, null, done);
//
//    t.equal(files['file1.md'].excerpt, 'Lorem ipsum');
//    t.equal(files['file2.html'].yourKeyHere, 'file2.html');
//
//    t.end();
// });
