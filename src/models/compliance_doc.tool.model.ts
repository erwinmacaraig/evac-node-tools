import Promise from 'promise';
import {ConnectionPool} from './connection.model';
import * as AWS from 'aws-sdk';

const config = require('../config.json');

/* var awsConfig = require('aws-config'); */
import * as fs from 'fs';

export class ComplianceDocumentTool {
    private pool:any = null;
    private connectionPool: ConnectionPool;
    private aws_bucket_name;
    private aws_s3;
    private dirStructureArray = [];
    constructor() {
        this.connectionPool = ConnectionPool.getInstance();
        this.pool = this.connectionPool.getConnectionPool();   
        this.setAWS_S3();    
    }

    private setAWS_S3() {

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

    public buildDirectoryStructure() {
        return new Promise((resolve, reject) => {
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

    public setSignedUrl(id=0, url=''){
        this.pool.getConnection((err ,connection) => {
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
                return(results);
                
            });

        });
    }

    public storeDirectoryStructure(id=0, dir='') {
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
                connection.release();
                return(results);
                
            });

        });
    }

    public setDownloadable(id, downloadable) {
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
                connection.release();
                return;
            });
        });
    }

    public isDownloadable(keyfile=''): Promise<string>{
        return new Promise((resolve, reject) => {

            const downloadPath = `${__dirname}/downloads`
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
              },(error, data) => {
                if (error) {
                    console.log('There was a problem getting the file from s3 ', error);
                    console.log(keyfile);
                    reject(false); 
                } else { 
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