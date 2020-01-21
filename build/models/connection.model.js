"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = __importStar(require("mysql2"));
class ConnectionPool {
    constructor() {
        this.dbconfig = {
            "connectionLimit": 10,
            "host": "localhost",
            "user": "admin",
            "password": "myAllah1",
            "database": "evacos"
        };
        if (ConnectionPool._instance) {
            throw new Error('Error: Instantiation failed: Use Connection.getInstance() instead of new');
        }
        // connection
        this.pool = db.createPool(this.dbconfig);
    }
    static getInstance() {
        return ConnectionPool._instance;
    }
    getConnectionPool() {
        return this.pool;
    }
}
// "host": "evac-prod-aws.cz6acz8q5poj.ap-southeast-2.rds.amazonaws.com"
// "host": "common-evacconnect-dev.cz6acz8q5poj.ap-southeast-2.rds.amazonaws.com",
ConnectionPool._instance = new ConnectionPool();
exports.ConnectionPool = ConnectionPool;
//# sourceMappingURL=connection.model.js.map