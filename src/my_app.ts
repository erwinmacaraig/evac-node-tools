import { Tools } from './models/app.tools';
const fs = require('fs');
var async = require("async");

main();

async function main() {
    const tool = new Tools();

    // get tenant accounts 
    try {
        const non_hearing_accounts = await tool.managerAccountsinLocation();
        for (let dref of non_hearing_accounts) {
            try {
                await tool.insertAccountLocationProductSub(1, dref['account_id'], dref['location_id'], dref['building_id']);
            } catch(r) {
                console.log('Skipping', 1, dref['account_id'], dref['location_id']);                
            }            
        }
    } catch(e) {
        console.log(e);
    }

    try {
        const non_hearing_tenant_accounts = await tool.getTenantAccountsinLocation();
        for (let dref of non_hearing_tenant_accounts) {
            try {
                await tool.insertAccountLocationProductSub(2, dref['account_id'], dref['location_id'], dref['building_id']);
                console.log('Inserting ', 2, dref['account_id'], dref['location_id']);
            } catch(r) {
                console.log('Skipping', 2, dref['account_id'], dref['location_id']);
            }            
        }
    } catch(e) {
        console.log(e);
    }

    try {
        const hearing_manager_accounts = await tool.managerAccountsinLocationForHearing();
        for (let dref of hearing_manager_accounts) {
            try {
                await tool.insertAccountLocationProductSub(3, dref['account_id'], dref['location_id'], dref['building_id']);
                console.log('Inserting ',3, dref['account_id'], dref['location_id']);
            } catch(r) {
                console.log('Skipping', 3, dref['account_id'], dref['location_id']);
            }            
        }
    } catch(e) {
        console.log(e);
    }

    try {
        const hearing_tenant_accounts = await tool.getTenantAccountsinLocationForHearing();
        for (let dref of hearing_tenant_accounts) {
            try {
                await tool.insertAccountLocationProductSub(4, dref['account_id'], dref['location_id'], dref['building_id']);
                console.log('Inserting ',4, dref['account_id'], dref['location_id']);
            } catch(r) {
                console.log('Skipping', 4, dref['account_id'], dref['location_id']);
            }            
        }
    } catch(e) {
        console.log(e);
    }
} 


/*
run();

async function run() {
    const tool = new Tools();
    let wardens = [];
    const uniqWardens = [];
    try {
        wardens = await tool.getAllWarden();
    } catch(e) {       
        console.log('Error at getting all wardens', e);
        process.exit(1);
    }

    try {
        for (let warden of wardens) {
            let certificates = [];

            //Assign GOFR role
            try {
                // check first if there is already an existing gofr record
                await tool.getAssignedGOFR(warden['user_id'], warden['location_id']);
            } catch(e) {
                if (warden['location'] != null) {
                    try {
                        await tool.assignGOFR(warden['user_id'], warden['location_id']);
                    } catch(e) {
                        console.log('Error in assigning gofr', e);
                    }
                }
                
            }

            if (uniqWardens.indexOf(warden['user_id']) == -1) {
                try {
                    certificates = await tool.getCertifiedEmergencyRole(warden['user_id']);
                    try {
                        await tool.getCertifiedEmergencyRole(warden['user_id'], [16]);
                    } catch(e) {                        
                        uniqWardens.push(warden['user_id']);
                        try {
                            await fs.appendFileSync('./insert.txt', `INSERT INTO certifications VALUES (0, 16, '${certificates[0]['course_method']}', '', 'Promoted from ${certificates[0]['certifications_id']}', ${warden['user_id']}, '${certificates[0]['certification_date_formatted']}', 1, 1);` + '\r\n');
                            await tool.insertCertificate(certificates[0]['course_method'], certificates[0]['certifications_id'], warden['user_id'], certificates[0]['certification_date_formatted']);
                        } catch(e) {
                            console.log(e);
                        }
                        
                    }
                } catch(e) {
                    console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
                    console.log(e);
                }               
            }
        }
        // console.log(uniqWardens);
        process.exit(1);
    } catch(e) {
        console.log(e);
    }

    */
    
    /*
    function scratch() {
        tool.getAllWarden().then((wardens) => {
            const uniqWardens = [];
            for (let warden of wardens) {
                 
                tool.getAssignedGOFR(warden['user_id'], warden['location_id']).then((gofr) => {
                    console.log(gofr);
                    
                    fs.appendFile('./gofr.txt', JSON.stringify(warden) + '\r\n', (err, d) => {
                        if (err) {
                            console.log(err);
                        } 
                        console.log('Data written to gofr.txt');                
                    });
                    
                }).catch((e) => {
                    console.log(e);
                    
                    fs.appendFile('./sample.txt', JSON.stringify(warden) + '\r\n', (err, d) => {
                        if (err) {
                            console.log(err);
                        } 
                        console.log('Data written to sample.txt');                
                    });
                    
                   tool.assignGOFR(warden['user_id'], warden['location_id']).then((result) => {
                    fs.appendFile('./result.txt', `Assign gofr to ${warden['user_id']} in ${warden['location_id']}` + '\r\n', (err, d) => {
                        if (err) {
                            console.log(err);
                        } 
                        console.log('Data written to result.txt');                
                    });
                   }).catch((e) => {
                       console.log('Error assigning gofr role for ' + warden['user_id'] + ' in location ' + warden['location_id'], e);
                   });
                });
         
        
                if (uniqWardens.indexOf(warden['user_id']) == -1) {
                    tool.getCertifiedEmergencyRole(warden['user_id']).then((certificates) => {
                        // check here is the user has a valid gofr
                        tool.getCertifiedEmergencyRole(warden['user_id'], [16]).then((c) => {
                             console.log('===================================') ;
                            console.log(c);
                        }).catch((e) => {
                            console.log('********************** I am here******************');
                            console.log(e);
                             fs.appendFile('./insert.txt', `INSERT INTO certifications VALUES (0, 16, '${certificates[0]['course_method']}', '', 'Promoted from ${certificates[0]['certifications_id']}', ${warden['user_id']}, '${certificates[0]['certification_date_formatted']}', 1, 1);` + '\r\n', (err, d) => {
                                if (err) {
                                    console.log(err);
                                } 
                                console.log(`INSERT INTO certifications VALUES (0, 16, '${certificates[0]['course_method']}', '', 'Promoted from ${certificates[0]['certifications_id']}', ${certificates[0]['user_id']}, '${certificates[0]['certification_date_formatted']}', 1, 1)`);                
                            }); 
                            console.log('pushing ' + warden['user_id']);
                            uniqWardens.push(warden['user_id']);
                            
                        });
            
                        
                    }).catch((e) => {
                        console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
                        console.log(e);
                    });
                }
            }
            console.log('************************** ', uniqWardens, '**********************************');
        })
        .catch((e) => {
            console.log('Error at getting all wardens', e);
            process.exit(1);
        });
    }
    
}
*/
