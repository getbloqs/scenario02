var fs = require('fs');



fs.readFile(__dirname + '/./../../build/contracts/SubdomainRedirect.json', 'utf8', function (err,data) {
  if (err) { return console.log(err); }
  
  var contents = "window.contract = " + data + ";";
  fs.writeFile(__dirname + '/./../.tmp/contract.js', contents, 'utf8', function (err) {
     if (err) { return console.log(err); }    
  });
});