// node
import * as process from 'process';
// npm
import * as yargs from 'yargs';
// internal
import * as Fight from '../Fight';
import * as ClassPicker from '../ClassPicker'


console.log(process.argv);

let class1 = yargs.argv.cc;
let class2 = yargs.argv.oc;

let bits2 = yargs.argv.cb;
let bits1 = yargs.argv.ob;

let fights = yargs.argv.fights;

console.log(yargs.argv);

