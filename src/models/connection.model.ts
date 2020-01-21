
import * as db from 'mysql2';

export class ConnectionPool {
    private dbconfig = {
        "connectionLimit": 10,
        "host": "localhost",
        "user": "admin",
        "password": "myAllah1",
        "database": "evacos"
    };
    // "host": "evac-prod-aws.cz6acz8q5poj.ap-southeast-2.rds.amazonaws.com"
    // "host": "common-evacconnect-dev.cz6acz8q5poj.ap-southeast-2.rds.amazonaws.com",
    private static _instance:ConnectionPool = new ConnectionPool();
    private pool;
    constructor() {
        if (ConnectionPool._instance) {
            throw new Error('Error: Instantiation failed: Use Connection.getInstance() instead of new');
        }
        // connection
        this.pool = db.createPool(this.dbconfig);
    }

    public static getInstance(): ConnectionPool {
        return ConnectionPool._instance;
    }

    public getConnectionPool() {
        return this.pool;
    }


}