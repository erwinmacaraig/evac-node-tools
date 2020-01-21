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
const compliance_doc_tool_model_1 = require("./models/compliance_doc.tool.model");
var async = require("async");
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const tool = new compliance_doc_tool_model_1.ComplianceDocumentTool();
        let dirStrucObjArr;
        let downloadUrl = '';
        try {
            dirStrucObjArr = yield tool.buildDirectoryStructure();
        }
        catch (e) {
            console.log(e, 'Terminating with error');
            process.exit(1);
        }
        for (let dirItem of dirStrucObjArr) {
            if (dirItem['uploaded_file'] != null && dirItem['compliance_kpis_id'] == 5) {
                downloadUrl = `EmergencyEvacuationDiagrams/${dirItem['uploaded_file']}`;
            }
            else {
                downloadUrl = `${dirItem['account_directory_name']}/${dirItem['location_dir']}/${dirItem['compliance_dir']}/${dirItem['document_type']}/${dirItem['file_name']}`;
            }
            console.log(`Processing ${dirItem['compliance_documents_id']}`);
            try {
                tool.storeDirectoryStructure(dirItem['compliance_documents_id'], downloadUrl);
            }
            catch (e) {
                console.log(e);
            }
            try {
                let signedUrl = yield tool.isDownloadable(downloadUrl);
                tool.setDownloadable(dirItem['compliance_documents_id'], 1);
                tool.setSignedUrl(dirItem['compliance_documents_id'], signedUrl);
            }
            catch (e) {
                console.log(e);
                tool.setDownloadable(dirItem['compliance_documents_id'], 0);
            }
        }
        console.log('Process complete. Terminating...');
        //process.exit(0);
    });
}
//# sourceMappingURL=my_signed_url.tool.js.map