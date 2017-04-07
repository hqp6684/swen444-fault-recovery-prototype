import { MainServer } from './main-server/main-server';
// import { server } from './express-server';
// const spawn = require('child_process').spawn;

// function testChild(mess: string) {
//     let c1 = spawn('node', ['./dist/child.bundle.js', mess]);
//     c1.stdout.on('data', (data: any) => {
//         console.log(`stdout: ${data}`);
//     });
//     c1.stderr.on('data', (data: any) => {
//         console.log(`stderr: ${data}`);
//     });
// }
// testChild('p1');
// testChild('p2');
// server.listen(8080);

///////

function main() {
    let mainServer: MainServer = new MainServer(8080);
}


main();