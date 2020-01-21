"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const abs_tool_1 = require("./models/abs_tool");
const fs = require('fs');
var async = require("async");
runABSTool();
function runABSTool() {
    return __awaiter(this, void 0, void 0, function* () {
        const tool = new abs_tool_1.ABSTool();
        const test = yield tool.toolTest();
        let temp = yield tool.getUsersWithCompletedTrainingModules();
        const compliant = [];
        const nonCompliant = [];
        const trainingLookup = {
            '16': 'General Occupant and First Response',
            '17': 'Emergency Control Organisation'
        };
        for (let u of temp) {
            let data = yield tool.getTrainings(u['user_id'], [u['training_requirement_id']]);
            if (data.length > 0) {
                compliant.push(u);
                try {
                    yield fs.appendFileSync('./compliant.csv', `${u['user_id']},${u['first_name']},${u['last_name']},${u['email']},${trainingLookup[u['training_requirement_id']]}` + '\r\n');
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
                nonCompliant.push(u);
                try {
                    yield fs.appendFileSync('./result.csv', `${u['user_id']},${u['first_name']},${u['last_name']},${u['email']},${trainingLookup[u['training_requirement_id']]}` + '\r\n');
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        process.exit(0);
    });
}
//# sourceMappingURL=abs_compliance-check.js.map