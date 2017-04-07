import { ChildServer } from './child-server/child-server';


function main() {
    console.log(process.argv);
    let childPort = Number(process.argv[2]);
    let parentPort = Number(process.argv[3]);
    console.log('Initializing Child Server');
    let childServer = new ChildServer(childPort, parentPort);
}
main();