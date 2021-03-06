// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('../common');
var assert = require('assert');
var net = require('net');

var gotError = false;

process.on('exit', function() {
  assert.equal(gotError, true);
});

// This tests a corner case to ensure file descriptor 0 is treated
// like any other file descriptor.
// This should fail with an async error, not throw an exception.
net.createServer(assert.fail).listen({fd:0}).on('error', function(e) {
  // On UNIX, the errno may be ENOTSOCK rather than EINVAL in the case 
  // where fd 0 is a named or unnamed pipe
  assert(e.code == 'EINVAL' || e.code == 'ENOTSOCK', 
         e.code + " in ['EINVAL', 'ENOTSOCK']");
  gotError = true;
});
