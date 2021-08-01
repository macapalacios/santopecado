const fs = require('fs');
const nspShrinkwrap  = require('nsp-audit-shrinkwrap');
const shrinkwrapPath = '/path/to/npm-shrinkwrap.json'

const shrinkwrapFile = fs.readFileSync(shrinkwrapPath);
 
 
nspShrinkwrap.audit(shrinkwrapFile, function (err, results){
    console.log(results);
});
 
nspShrinkwrap.auditByPath(shrinkwrapPath, function (err, results){
    console.log(results);
});