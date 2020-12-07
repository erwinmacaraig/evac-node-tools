import Promise from 'promise';
import {ConnectionPool} from './connection.model';

export class Tools {
    private pool:any = null;
    private connectionPool: ConnectionPool;
    constructor() {
        this.connectionPool = ConnectionPool.getInstance();
        this.pool = this.connectionPool.getConnectionPool();       
    }

    public toolTest() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE email LIKE '%emacaraig%';`;
            this.pool.getConnection((err, connection) => {
                if (err) {
                    throw new Error(err);
                }
                connection.query(sql, [], (error, results) => {
                    if (error) {
                        console.log(sql);
                        throw new Error(error);
                    }
                    resolve(results);
                    connection.release();
                });
            });
        });
    }

    public getAllWarden():Promise<Array<object>> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT
                            user_em_roles_relation.*
                        FROM
                            user_em_roles_relation
                        INNER JOIN
                            users
                        ON
                            users.user_id = user_em_roles_relation.user_id
                        WHERE
                            user_em_roles_relation.em_role_id IN (9,10,11,15,16,18)
                        AND
                            users.archived = 0
                        ORDER BY user_id`;
            this.pool.getConnection((err, connection) => {
                if (err) {
                    throw new Error(err);
                }
                connection.query(sql, [], (error, results) => {
                    if (error) {
                        console.log(error, sql);
                        throw new Error(error);
                    }
                    resolve(results);                    
                    connection.release();
                });
            });
        });
    }

    public getAssignedGOFR(user_id=0, location_id=0): Promise<Array<object>> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM user_em_roles_relation WHERE em_role_id = 8 AND location_id = ? AND user_id = ?`;
            const params = [location_id, user_id];
            this.pool.getConnection((err, connection) => {
                if (err) {
                    throw new Error(err);
                }
                connection.query(sql, params, (error, results) => {
                    if (error) {
                        console.log(error, sql, params);
                        throw new Error(error);
                    }
                    if (results.length == 0) {
                        reject('No GOFR Assigned for user: ' + user_id + ' in location ' + location_id);
                    } else {
                        resolve(results);
                    }                    
                    connection.release();
                });
            });
        });
    }

    public assignGOFR(user_id=0, location_id=0): Promise<any> {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO user_em_roles_relation (user_id, em_role_id, location_id) VALUES (?, ?, ?)`;
            const params = [user_id, 8, location_id];
            this.pool.getConnection((err, connection) => {
                if (err) {
                    throw new Error(err);
                }
                connection.query(sql, params, (error, results) => {
                    if (error) {
                        console.log(error, sql, params);
                        throw new Error(error);
                    }
                    console.log('affected rows ', results.affectedRows);
                    resolve(results.insertId);
                    connection.release();
                });
            });
        });
    }

    public insertCertificate(course_method='', desc='', userId=0, certDate = ''):Promise<any> {
        return new Promise((resolve, reject) => {
            const description = `Promoted from ${desc}`;
            const params = [course_method, description, userId, certDate];
            const sql = `INSERT INTO certifications VALUES (0, 16, ?, '', ?, ?, ?, 1, 1);`;
            this.pool.getConnection((err, connection) => {
                if (err) {
                    throw new Error(err);
                }
                connection.query(sql, params, (error, results) => {
                    if (error) {
                        console.log(error, sql, params);
                        throw new Error(error);
                    }
                    console.log('affected rows ', results.affectedRows);
                    resolve(results.insertId);
                    connection.release();
                });
            });
        });
    }

    public getSleepingTasks(): Promise<Array<number>> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id FROM information_schema.processlist WHERE user='admin' AND Command = 'Sleep' AND time > 600 ORDER BY time DESC`;
            this.pool.getConnection((err, connection) => {
                if (err) {
                    throw new Error(err);
                }
                connection.query(sql, [], (error, results) => {
                    connection.release();
                    if (error) {
                        console.log(error, sql);
                        throw new Error(error);
                    }                    
                    const ids = [];
                    if (results.length >= 10) {
                        for (let i = 0; i < 10; i++) {
                            ids.push(results[i]['id']);   
                        }
                    }
                    /* for (let r of results) {
                        ids.push(r['id']);
                    } */
                    resolve(ids);
                    
                });
            });
        });
    }

    public killMySQLProcess(id=0) {
        return new Promise((resolve, reject) => {
            const sql = `KILL ${id};`;
            this.pool.getConnection((err, connection) => {
                if (err) {
                    throw new Error(err);
                }
                connection.query(sql, [], (error, results) => {
                    if (error) {
                        console.log(error, sql);
                        reject(sql);
                    }
                   resolve(id);
                   connection.release();
                });
            });
        });

    }

    public getCertifiedEmergencyRole(userId=0, training=[17,23]): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
            let trainingStr = training.join(',');
            const sql = `
            SELECT
                certifications.*,
                DATE_FORMAT(certifications.certification_date, "%Y-%m-%d") AS certification_date_formatted,
                training_requirement.num_months_valid,
                DATE_ADD(certifications.certification_date, INTERVAL training_requirement.num_months_valid MONTH) AS valid_till
            FROM
                certifications
            INNER JOIN 
                training_requirement
            ON
                certifications.training_requirement_id = training_requirement.training_requirement_id
            WHERE
                certifications.training_requirement_id IN (${trainingStr})
            AND
                certifications.pass = 1
            AND
                certifications.user_id = ?
            AND
                DATE_ADD(certifications.certification_date, INTERVAL training_requirement.num_months_valid MONTH) > NOW()
            ORDER BY certifications.certification_date DESC; 
            `;

            this.pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error, sql, userId);
                    throw new Error(error);
                }
                connection.query(sql, [userId], (error, results) => {
                    if (error) {
                        console.log(error, sql, userId);
                        reject(sql);
                    }
                    if (results.length == 0) {
                        reject('No certificate for user: ' + userId);
                    } else {
                        resolve(results);
                    }                    
                    connection.release();
                });
            });
        });
    }

    public managerAccountsinLocation(): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
            let sql = `SELECT 
                    account_id,
                    locations.location_id,
                    IF(parent_id = -1, locations.location_id, parent_id) AS building_id,
                    CURDATE() AS subscription_start_date,
                    DATE_ADD(CURDATE(), INTERVAL 1 YEAR) AS valid_till
                FROM
                    location_account_relation
                INNER JOIN
                    locations
                ON location_account_relation.location_id = locations.location_id
                WHERE
                    account_id <> 16
                AND
                    responsibility = 'Manager' 
                GROUP BY account_id, locations.location_id;
            `;
            this.pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error, sql);
                    throw new Error(error);
                }
                connection.query(sql, [], (error, results) => {
                    if (error) {
                        console.log(error, sql);
                        reject(sql);
                    }
                    if (results.length == 0) {
                        reject('No results');
                    } else {
                        resolve(results);
                    }                    
                    connection.release();
                });
            });
        });
    }

    public getTenantAccountsinLocation(): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
            let sql = `SELECT 
                            account_id,
                            locations.location_id,
                            IF(parent_id = -1, locations.location_id, parent_id) AS building_id,
                            CURDATE() AS subscription_start_date,
                            DATE_ADD(CURDATE(), INTERVAL 1 YEAR) AS valid_till
                        FROM
                            location_account_relation
                        INNER JOIN
                            locations
                        ON location_account_relation.location_id = locations.location_id
                        WHERE
                            account_id <> 16
                        AND
                            responsibility = 'Tenant' 
                        GROUP BY account_id, locations.location_id;
            `;
            this.pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error, sql);
                    throw new Error(error);
                }
                connection.query(sql, [], (error, results) => {
                    if (error) {
                        console.log(error, sql);
                        reject(sql);
                    }
                    if (results.length == 0) {
                        reject('No results');
                    } else {
                        resolve(results);
                    }                    
                    connection.release();
                });
            });
        });
    }

    public managerAccountsinLocationForHearing(): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
                let sql = `SELECT 
                            account_id,
                            locations.location_id,
                            IF(parent_id = -1, locations.location_id, parent_id) AS building_id,
                            CURDATE() AS subscription_start_date,
                            DATE_ADD(CURDATE(), INTERVAL 1 YEAR) AS valid_till
                        FROM
                            location_account_relation
                        INNER JOIN
                            locations
                        ON location_account_relation.location_id = locations.location_id
                        WHERE
                            account_id = 16
                        AND
                            responsibility = 'Manager' 
                        GROUP BY account_id, locations.location_id;
            `;
            this.pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error, sql);
                    throw new Error(error);
                }
                connection.query(sql, [], (error, results) => {
                    if (error) {
                        console.log(error, sql);
                        reject(sql);
                    }
                    if (results.length == 0) {
                        reject('No results');
                    } else {
                        resolve(results);
                    }                    
                    connection.release();
                });
            });
        });
    }

    public getTenantAccountsinLocationForHearing(): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
            let sql = `SELECT 
                            account_id,
                            locations.location_id,
                            IF(parent_id = -1, locations.location_id, parent_id) AS building_id,
                            CURDATE() AS subscription_start_date,
                            DATE_ADD(CURDATE(), INTERVAL 1 YEAR) AS valid_till
                        FROM
                            location_account_relation
                        INNER JOIN
                            locations
                        ON location_account_relation.location_id = locations.location_id
                        WHERE
                            account_id = 16
                        AND
                            responsibility = 'Tenant' 
                        GROUP BY account_id, locations.location_id;
            `;
            this.pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error, sql);
                    throw new Error(error);
                }
                connection.query(sql, [], (error, results) => {
                    if (error) {
                        console.log(error, sql);
                        reject(sql);
                    }
                    if (results.length == 0) {
                        reject('No results');
                    } else {
                        resolve(results);
                    }                    
                    connection.release();
                });
            });
        });
    }

    public insertAccountLocationProductSub(products_id, account_id, location_id, building_id): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = [products_id, account_id, location_id, building_id];
            let sql = `INSERT INTO account_location_product_subscription (
                products_id,
                account_id,
                location_id,
                building_id,
                subscription_start_date,
                valid_till,
                total_license,
                remaining_license) VALUES (?, ?, ?, ?, NOW(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 0, 0)`;

            this.pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error);
                    throw new Error(error);
                }
                connection.query(sql, params, (error, results) => {
                    if (error) {
                        //console.log(error, sql);
                        reject(error);
                    }
                    resolve(results);                  
                    connection.release();
                });
            });
        });
        
    }

    public getAccountBuildingAssignment(): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
            let sql = `
                    SELECT
                        location_account_relation.account_id,
                        locations.parent_id
                    FROM
                        location_account_relation
                    INNER JOIN
                        locations
                    ON 
                        location_account_relation.location_id = locations.location_id
                    INNER JOIN
                        locations building
                    ON
                        building.location_id = locations.parent_id
                    WHERE                         
                        building.is_building = 1
                    GROUP BY location_account_relation.account_id, locations.parent_id;
            `;
            this.pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error);
                    throw new Error(error);
                }
                connection.query(sql, [], (e, results) => {
                    if (e) {
                        console.log(e);
                        throw new Error(sql);
                    }
                    if (results.length > 0) {
                        resolve(results);
                    } else {
                        reject('no records found');
                    }
                    connection.release();
                });
            });
        });
    }

    public getOtherBuildingAssignmentForHearing(): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
            let sql = `SELECT
                        locations.location_id
                    FROM
                        location_account_relation
                    INNER JOIN
                        locations
                    ON
                        locations.location_id = location_account_relation.location_id 
                    WHERE
                        locations.parent_id = -1
                    AND
                        locations.is_building = 1
                    AND
                        account_id = 16
                    AND
                        locations.location_id
                    NOT IN 
                    (
                        '1229','1838','7055','7057','7059','7061','7063','7065','7067',
                        '7069','7071','7073','7075','7077','7079','7081','7083','7085',
                        '7087','7089','7091','7093','7095','7185','7189','7631','8006',
                        '8008','8010','8012','8014','8016','8018','8020','8022','8024',
                        '8026','8028','8030','8032','8034','8036','8038','8040','8042',
                        '8044','8046','8048','8050','8052','8054','8056','8058'
                    ) GROUP BY locations.location_id;
            `;
            this.pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error);
                    throw new Error(error);
                }
                connection.query(sql, [], (e, results) => {
                    if (e) {
                        console.log(e);
                        throw new Error(sql);
                    }
                    if (results.length > 0) {
                        resolve(results);
                    } else {
                        reject('no records found');
                    }
                    connection.release();
                });
            });

        });
    }


    public getRetireAustraliaLocations(): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
            let sql_get = `SELECT location_account_relation.*, locations.location_id, locations.name, locations.is_building FROM location_account_relation
            INNER JOIN locations ON locations.location_id = location_account_relation.location_id
            WHERE account_id = 1818 and is_building = 1 and archived = 0;`;

            const params = [];
            this.pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error);
                    throw new Error(error);
                }
                connection.query(sql_get, params, (e, results) => {
                    if (e) {
                        console.log(e, params);
                        throw new Error(sql_get);
                    }
                    resolve(results);
                    connection.release();
                })
            });
        });
    }

    public insertTrainingModule(account=0, building=0, training=0, order=0, module_id=0, pre_req=-1, module_name='', logo='', module_launcher=''): Promise<any> {
        return new Promise((resolve, reject) => {
            let sql_insert = 'INSERT INTO training_module (account_id, building_id, training_requirement_id, `order`, module_id, pre_req, module_name, logo, module_launcher) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

            const params = [account, building, training, order, module_id, pre_req, module_name, logo, module_launcher];
            this.pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error);
                    throw new Error(error);
                }
                connection.query(sql_insert, params, (e, results) => {
                    if (e) {
                        console.log(e, params);
                        throw new Error(sql_insert);
                    }
                    resolve(results);
                    connection.release();
                })
            });
        });
    }

    

}
