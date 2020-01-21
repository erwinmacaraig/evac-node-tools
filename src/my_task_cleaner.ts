import { Tools } from './models/app.tools';

const fs = require('fs');
const moment = require('moment');


const tool = new Tools();
console.log('Getting tasks now.....');
tool.getSleepingTasks().then((ids) => {
    console.log(ids);
    const stamp = moment().format('YYYY-MM-DD HH:mm:ss');
    fs.writeFile('/home/ubuntu/logs/clean.log', `Run at ${stamp}` + '\r\n', (err, d) => {
        if (err) {
            console.log(err);
        } 
        console.log('Data written to disk');                
    });
    for(let id of ids) {
        tool.killMySQLProcess(id).then((data) => {
            console.log(`Success terminating id ${id}`);
        }).catch((err) => {
            console.log('Error killing process id ' + id);
        });
    }
    setTimeout(() => {
        process.exit(0);
    }, 900);
}).catch((e) => {
    console.log(e);
    process.exit(1);
});
