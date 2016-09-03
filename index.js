var srv = require('http-server');
var bon = require('bonjour')();
var argv = require('minimist')(process.argv.slice(2));

var options = Object.assign(argv, {
  root: argv._[0],
  a: argv.a || '0.0.0.0',
  p: argv.p || 8080
});

var http = srv.createServer(options);

function cleanup() {
  bon.unpublishAll(function() {
    http.close();
    bon.destroy();
    console.info('disconnected');
    process.exit();
  });
}

http.listen(options.p, options.a, function() {

  process.on('SIGINT', function() {
    cleanup();
  });
  process.on('SIGTERM', function() {
    cleanup();
  });

  var svc = bon.publish({
    name: 'bawnjorno',
    type: 'http',
    port: options.p
  });

  svc.start();

  console.log('serving ' + options.a + ':' + svc.port + ' to ' + svc.host);
});