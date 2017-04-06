import * as request from 'Request';
import { Component } from './Component/component';

function a() {

    let c = new Component();
    console.log(process.argv[2]);
    c.run(process.argv[2])
}
a(

);