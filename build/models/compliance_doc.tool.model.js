"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("promise"));
const connection_model_1 = require("./connection.model");
const AWS = __importStar(require("aws-sdk"));
const config = require('../config.json');
class ComplianceDocumentTool {
    constructor() {
        this.pool = null;
        this.dirStructureArray = [];
        this.connectionPool = connection_model_1.ConnectionPool.getInstance();
        this.pool = this.connectionPool.getConnectionPool();
        this.setAWS_S3();
    }
    setAWS_S3() {
        //AWS.config.setPromisesDependency();
        AWS.config.update({
            accessKeyId: config.AWSAccessKeyId,
            secretAccessKey: config.AWSSecretKey,
            region: config.AWS_REGION
        });
        // AWS.config.s3BucketEndpoint = 'https://s3-ap-southeast-2.amazonaws.com/';
        /* AWS.config.accessKeyId = 'AKIAJONQAMWMVUCDON7Q';
        AWS.config.secretAccessKey = '8tt9CYhm4cGrF7mgsC3ARR2e6+phfYPXFSl1iTW';
        AWS.config.region = 'us-east-1'; */
        this.aws_bucket_name = 'mycompliancegroup-prod';
        this.aws_s3 = new AWS.S3();
        /* this.aws_s3.listObjectsV2({
            Bucket: this.aws_bucket_name
        }); */
        /* this.aws_s3.listObjectsV2({
            Bucket: this.aws_bucket_name
        },(err, data)=>{
            console.log('***',err);
            console.log('===', data);
        }) */
    }
    buildDirectoryStructure() {
        return new promise_1.default((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    throw new Error(err);
                }
                let sql = `
                    SELECT
                        compliance_documents.compliance_documents_id,
                        compliance_documents.job_num,
                        compliance_documents.document_type,
                        compliance_documents.date_of_activity,
                        compliance_documents.timestamp,
                        compliance_documents.file_name,
                        compliance_documents.uploaded_file,
                        accounts.account_name,
                        accounts.account_directory_name,
                        locations.name AS building,
                        locations.location_directory_name AS location_dir,
                        compliance_kpis.compliance_kpis_id,
                        compliance_kpis.name AS compliance_item,
                        compliance_kpis.directory_name AS compliance_dir,
                        compliance_documents.file_name  
                    FROM
                        compliance_documents
                    INNER JOIN
                        accounts
                    ON
                        accounts.account_id = compliance_documents.account_id
                    INNER JOIN
                        locations
                    ON
                        locations.location_id = compliance_documents.building_id
                    INNER JOIN
                        compliance_kpis
                    ON
                        compliance_kpis.compliance_kpis_id = compliance_documents.compliance_kpis_id
                    WHERE
                        compliance_documents.downloadable IS NULL
                    ORDER BY
                        compliance_documents.timestamp DESC`;
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
    setSignedUrl(id = 0, url = '') {
        this.pool.getConnection((err, connection) => {
            if (err) {
                throw new Error(err);
            }
            let sql = `UPDATE compliance_documents SET signedUrl = ? WHERE compliance_documents_id = ?`;
            connection.query(sql, [url, id], (error, results) => {
                if (error) {
                    console.log(sql);
                    throw new Error(error);
                }
                connection.release();
                return (results);
            });
        });
    }
    storeDirectoryStructure(id = 0, dir = '') {
        /* return new Promise((resolve, reject) => {
            this.pool.getConnection((err ,connection) => {
                if (err) {
                    throw new Error(err);
                }
                let sql = `UPDATE compliance_documents SET dir = ? WHERE compliance_documents_id = ?`;
                connection.query(sql, [dir, id], (error, results) => {
                    if (error) {
                        console.log(sql);
                        throw new Error(error);
                    }
                    resolve(results);
                    connection.release();
                });

            });
        }); */
        this.pool.getConnection((err, connection) => {
            if (err) {
                throw new Error(err);
            }
            let sql = `UPDATE compliance_documents SET dir = ? WHERE compliance_documents_id = ?`;
            connection.query(sql, [dir, id], (error, results) => {
                if (error) {
                    console.log(sql);
                    throw new Error(error);
                }
                connection.release();
                return (results);
            });
        });
    }
    setDownloadable(id, downloadable) {
        /* return new Promise((resolve, reject) => {
            this.pool.getConnection((err ,connection) => {
                if (err) {
                    throw new Error(err);
                }
                let sql = `UPDATE compliance_documents SET downloadable = ? WHERE compliance_documents_id = ?`;
                connection.query(sql, [downloadable, id], (error, results) => {
                    if (error) {
                        console.log(sql);
                        throw new Error(error);
                    }
                    resolve(results);
                    connection.release();
                });
            });
        }); */
        this.pool.getConnection((err, connection) => {
            if (err) {
                throw new Error(err);
            }
            let sql = `UPDATE compliance_documents SET downloadable = ? WHERE compliance_documents_id = ?`;
            connection.query(sql, [downloadable, id], (error, results) => {
                if (error) {
                    console.log(sql);
                    throw new Error(error);
                }
                connection.release();
                return;
            });
        });
    }
    isDownloadable(keyfile = '') {
        return new promise_1.default((resolve, reject) => {
            const downloadPath = `${__dirname}/downloads`;
            /* this.aws_s3.getSignedUrl('getObject', {
                Bucket: this.aws_bucket_name,
                Key: `${keyfile}`
              }, (ers, url) => {
                if ( ers ) {
                  console.log('There was a problem getting the file from s3 ', ers);
                  reject(false);
                } else {
                    console.log(`File downloadable - ${url}`);
                    resolve(url);
                }
              }); */
            this.aws_s3.getObject({
                Bucket: this.aws_bucket_name,
                Key: `${keyfile}`
            }, (error, data) => {
                if (error) {
                    console.log('There was a problem getting the file from s3 ', error);
                    console.log(keyfile);
                    reject(false);
                }
                else {
                    const signedUrl = this.aws_s3.getSignedUrl('getObject', {
                        Bucket: this.aws_bucket_name,
                        Key: `${keyfile}`
                    });
                    console.log('SUCCESS GETTING SIGNED URL: ' + signedUrl);
                    resolve(signedUrl);
                }
            });
        });
    }
}
exports.ComplianceDocumentTool = ComplianceDocumentTool;
//# sourceMappingURL=compliance_doc.tool.model.js.map