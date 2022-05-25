const core = require("@actions/core");
const axios = require('axios');

let serviceNowUsername;
let serviceNowPassword;
let serviceNowEndpoint;
let snowTableName;
let serviceNowHeaders;

async function main() {
    try {
        serviceNowUsername = core.getInput("servicenow-username");
        serviceNowPassword = core.getInput("servicenow-password");
        serviceNowEndpoint = core.getInput("servicenow-endpoint");
        snowTableName = core.getInput("servicenow-table-name");
        serviceNowHeaders = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic " + Buffer.from(serviceNowUsername + ":" + serviceNowPassword).toString("base64")
        };
        const allRecords = await getAllRecords();
        console.log("all records: ", allRecords);

        const createdRecord = await createRecord();
        console.log("created record: ", createdRecord);

        const updatedRecord = await updateRecord(createdRecord.sys_id);
        console.log("updated record: ", updatedRecord);
    } catch (error) {
        console.log(error);
    }
}

async function getAllRecords() {
    try {
        const response = await axios.get(serviceNowEndpoint + "/api/now/table/" + snowTableName, { headers: serviceNowHeaders });
        return response.data.result;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function createRecord() {
    try {
        const requestData = {
            comments: "This is a test comment",
            start_date: "2020-01-01",
            end_date: "2020-01-02"
        };

        const response = await axios.post(serviceNowEndpoint + "/api/now/table/" + snowTableName, requestData, { headers: serviceNowHeaders });
        return response.data.result;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function updateRecord(sys_id) {
    try {
        const requestData = {
            end_date: "2020-01-03"
        };

        const response = await axios.put(serviceNowEndpoint + "/api/now/table/" + snowTableName + "/" + sys_id, requestData, { headers: serviceNowHeaders });
        return response.data.result;
    } catch (error) {
        throw new Error(error.message);
    }
}

main();