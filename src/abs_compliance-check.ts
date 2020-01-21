import { ABSTool } from './models/abs_tool';
const fs = require('fs');
var async = require("async");

runABSTool();


async function runABSTool() {
    const tool = new ABSTool();
    const test = await tool.toolTest();    
    let temp = await tool.getUsersWithCompletedTrainingModules();
    const compliant = [];
    const nonCompliant = [];  

    const trainingLookup = {
        '16': 'General Occupant and First Response',
        '17': 'Emergency Control Organisation'
    }
    for (let u of temp) {
        let data = await tool.getTrainings(u['user_id'], [u['training_requirement_id']]);
        if (data.length > 0) {
            compliant.push(u);
            try {                
                await fs.appendFileSync('./compliant.csv', `${u['user_id']},${u['first_name']},${u['last_name']},${u['email']},${trainingLookup[u['training_requirement_id']]}` + '\r\n');                
            } catch(e) {
                console.log(e);
            }

        } else {
            nonCompliant.push(u);
            try {
                await fs.appendFileSync('./result.csv', `${u['user_id']},${u['first_name']},${u['last_name']},${u['email']},${trainingLookup[u['training_requirement_id']]}` + '\r\n');                
            } catch(e) {
                console.log(e);
            }
        }
    }

    

    process.exit(0);
    

}