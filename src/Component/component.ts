import * as request from 'Request';

export class Component {
    constructor() {

    }

    run(mess: string) {
        setInterval(() => {
            console.log(mess);
            request.get('http://localhost:8080?'.concat(mess));
        }, 1000)
    }

}