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
const app_tools_1 = require("./models/app.tools");
const fs = require('fs');
var async = require("async");
//main();
//misc();
retireAustralia();
function retireAustralia() {
    return __awaiter(this, void 0, void 0, function* () {
        const tool = new app_tools_1.Tools();
        const data = yield tool.getRetireAustraliaLocations();
        for (let d of data) {
            try {
                console.log('inserting account id : ', d['account_id']);
                yield tool.insertTrainingModule(d['account_id'], d['location_id'], 16, 1, 1, 0, 'Emergency Control Organisation (ECO)', 'badge-1', 'courses/eco/module1/index_lms.html');
                yield tool.insertTrainingModule(d['account_id'], d['location_id'], 16, 2, 2, 1, 'Building Emergency Procedure', 'badge-2', 'courses/eco/module2/index_lms.html');
                yield tool.insertTrainingModule(d['account_id'], d['location_id'], 16, 3, 5, 2, 'First Response Fire Fighting', 'badge-5', 'courses/eco/module5/index_lms.html');
                yield tool.insertTrainingModule(d['account_id'], d['location_id'], 17, 1, 1, 0, 'Emergency Control Organisation (ECO)', 'badge-1', 'courses/eco/module1/index_lms.html');
                yield tool.insertTrainingModule(d['account_id'], d['location_id'], 17, 2, 3, 1, 'Evacuation Procedures', 'badge-4', 'courses/eco/module3/index_lms.html');
                yield tool.insertTrainingModule(d['account_id'], d['location_id'], 17, 3, 4, 3, 'Building Fire Detection', 'badge-3', 'courses/eco/module4/index_lms.html');
                yield tool.insertTrainingModule(d['account_id'], d['location_id'], 17, 4, 5, 4, 'First Response Fire Fighting', 'badge-5', 'courses/eco/module5/index_lms.html');
            }
            catch (e) {
                console.log(e);
                console.log('error creating modules default training');
            }
        }
    });
}
function misc() {
    return __awaiter(this, void 0, void 0, function* () {
        const tool = new app_tools_1.Tools();
        const data = yield tool.getOtherBuildingAssignmentForHearing();
        for (let d of data) {
            try {
                console.log('inserting account id 16 and location id ' + d['location_id']);
                yield tool.insertTrainingModule(16, d['location_id'], 16, 1, 7, 0, 'Australian Hearing - General Evacuation and First Response', 'badge-4', 'courses/aus_hearing_general_occupant_first_response/index_lms.html');
                yield tool.insertTrainingModule(16, d['location_id'], 17, 1, 6, 0, 'Australian Hearing - Emergency Control Organisation (ECO)', 'badge-1', 'courses/aus_hearing_eco/index_lms.html');
            }
            catch (e) {
                console.log('error creating modules for account id = 16 and location id ' + d['location_id']);
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const tool = new app_tools_1.Tools();
        const data = yield tool.getAccountBuildingAssignment();
        for (let d of data) {
            if (d['account_id'] == 16) {
                try {
                    console.log('inserting account id ', d['account_id']);
                    yield tool.insertTrainingModule(d['account_id'], d['parent_id'], 16, 1, 7, 0, 'Australian Hearing - General Evacuation and First Response', 'badge-4', 'courses/aus_hearing_general_occupant_first_response/index_lms.html');
                    yield tool.insertTrainingModule(d['account_id'], d['parent_id'], 17, 1, 6, 0, 'Australian Hearing - Emergency Control Organisation (ECO)', 'badge-1', 'courses/aus_hearing_eco/index_lms.html');
                }
                catch (e) {
                    console.log('error creating modules for account id = 16');
                }
            }
            else if (d['account_id'] == 18 ||
                d['account_id'] == 23 ||
                d['account_id'] == 24 ||
                d['account_id'] == 25 ||
                d['account_id'] == 356 ||
                d['account_id'] == 1431 ||
                d['account_id'] == 1906 ||
                d['account_id'] == 1909 ||
                d['account_id'] == 1917 ||
                d['account_id'] == 2019 ||
                d['account_id'] == 2170) {
                try {
                    console.log('inserting account id:', d['account_id']);
                    yield tool.insertTrainingModule(d['account_id'], d['parent_id'], 17, 1, 8, 0, '567 Collins St, (ECO)', 'badge-1', 'courses/567_collins/index_lms.html');
                }
                catch (e) {
                    console.log('error creating modules for account id 18 etc');
                }
            }
            else {
                try {
                    console.log('inserting account id : ', d['account_id']);
                    yield tool.insertTrainingModule(d['account_id'], d['parent_id'], 16, 1, 1, 0, 'Emergency Control Organisation (ECO)', 'badge-1', 'courses/eco/module1/index_lms.html');
                    yield tool.insertTrainingModule(d['account_id'], d['parent_id'], 16, 2, 2, 1, 'Building Emergency Procedure', 'badge-2', 'courses/eco/module2/index_lms.html');
                    yield tool.insertTrainingModule(d['account_id'], d['parent_id'], 16, 3, 5, 2, 'First Response Fire Fighting', 'badge-5', 'courses/eco/module5/index_lms.html');
                    yield tool.insertTrainingModule(d['account_id'], d['parent_id'], 17, 1, 1, 0, 'Emergency Control Organisation (ECO)', 'badge-1', 'courses/eco/module1/index_lms.html');
                    yield tool.insertTrainingModule(d['account_id'], d['parent_id'], 17, 2, 3, 1, 'Evacuation Procedures', 'badge-4', 'courses/eco/module3/index_lms.html');
                    yield tool.insertTrainingModule(d['account_id'], d['parent_id'], 17, 3, 4, 3, 'Building Fire Detection', 'badge-3', 'courses/eco/module4/index_lms.html');
                    yield tool.insertTrainingModule(d['account_id'], d['parent_id'], 17, 4, 5, 4, 'First Response Fire Fighting', 'badge-5', 'courses/eco/module5/index_lms.html');
                }
                catch (e) {
                    console.log('error creating modules default training');
                }
            }
        }
    });
}
//# sourceMappingURL=my_app_assign_account_location_training.js.map