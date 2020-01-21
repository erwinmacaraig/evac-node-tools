import Promise from 'promise';
import {ConnectionPool} from './connection.model';

export class ABSTool {
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

    public getUsersWithCompletedTrainingModules(): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT users.first_name, users.last_name, users.email, user_training_module_relation.* FROM user_training_module_relation
            INNER JOIN users
            ON users.user_id = user_training_module_relation.user_id
            WHERE users.account_id = 213
            AND user_training_module_relation.completed = 1
            group by users.user_id, user_training_module_relation.training_requirement_id;`;

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

    public getTrainings(user_id: number = 0, training_requirements = []): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
            const training_requirements_str = training_requirements.join(',');
            const sql = `SELECT
                            certifications.*,                   
                            training_requirement.training_requirement_name
                        FROM
                            certifications
                        INNER JOIN
                            training_requirement ON training_requirement.training_requirement_id = certifications.training_requirement_id
                        WHERE
                            certifications.user_id = ${user_id}
                        AND
                            DATE_ADD(certifications.certification_date, INTERVAL training_requirement.num_months_valid MONTH) > NOW()
                        AND
                            certifications.pass = 1
                        AND 
                            training_requirement.training_requirement_id IN (${training_requirements_str});`;
            
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
}