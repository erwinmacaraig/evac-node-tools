import { ComplianceDocumentTool } from './models/compliance_doc.tool.model';
var async = require("async");

main();

async function main() {
    const tool = new ComplianceDocumentTool();
    let dirStrucObjArr;
    let downloadUrl = '';
    try {
        dirStrucObjArr = await tool.buildDirectoryStructure();
    } catch(e) {
        console.log(e, 'Terminating with error');
        process.exit(1);
    }

    for(let dirItem of dirStrucObjArr) {
        if (dirItem['uploaded_file'] != null && dirItem['compliance_kpis_id'] == 5) {
            downloadUrl = `EmergencyEvacuationDiagrams/${dirItem['uploaded_file']}`
        }else {
            downloadUrl = `${dirItem['account_directory_name']}/${dirItem['location_dir']}/${dirItem['compliance_dir']}/${dirItem['document_type']}/${dirItem['file_name']}`;
        }
        console.log(`Processing ${dirItem['compliance_documents_id']}`);
        try {
            tool.storeDirectoryStructure(dirItem['compliance_documents_id'] ,downloadUrl);
        }catch(e){
            console.log(e);
        }
        try {
            let signedUrl = await tool.isDownloadable(downloadUrl);
            tool.setDownloadable(dirItem['compliance_documents_id'], 1);
            tool.setSignedUrl(dirItem['compliance_documents_id'], signedUrl);
        } catch(e) {
            console.log(e);
            tool.setDownloadable(dirItem['compliance_documents_id'], 0);
        }

    } 

    console.log('Process complete. Terminating...');
    //process.exit(0);
    

    
    

    



    
    
}

