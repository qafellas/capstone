import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

let slackPayload = function () {
    let results
    try {
        results = JSON.parse(fs.readFileSync('./output/jsonReporter/test-results.json').toString());
    } catch (err) {
        throw new Error(err.message)

    }

    //console.log(results)
    let attachment = {}
    let endpoint = process.env.baseUrl;
    let githubProject = process.env.GITHUB_SERVER_URL + '/' + process.env.GITHUB_REPOSITORY
    let githubRunId = process.env.GITHUB_RUN_ID;
    let testRunHtml = process.env.TEST_RUN_HTML;
    let messageText = `*Title:* \`Capstone UI Tests\`\n\n*Env:* ${endpoint}\n\n*Driver:* ${results.capabilities[0].browserName} (${results.capabilities[0].browserVersion}) on ${results.capabilities[0].platformName}\n\n*Allure Report:* https://qafellas.github.io/capstone\n\n*Github Run:* ${githubProject}/actions/runs/${githubRunId}\n\n*Test Run HTML:* ${testRunHtml}\n\n*Total Test Cases:* ${results.state.passed+results.state.skipped+results.state.failed}\n\n:white_check_mark: *Passed: ${results.state.passed}* | :x: *Failed: ${results.state.failed}* | ⏩ *Skipped: ${results.state.skipped}*\n\n`

    if(results.state.failed>0){
        attachment = {
            color: '#dc3545',
            text: `${messageText}:red_circle: Test execution *FAILED*. Check the failures`,
            ts: Date.now().toString(),
        }
    }
    else if(results.state.failed == 0 && results.state.skipped == 0 && results.state.passed == 0){
        attachment = {
            color: '#808080',
            elements:[],
            text: `${messageText}:mag: Something went wrong with test execution!!!`,
            ts: Date.now().toString(),
        }
    }
    else if(results.state.failed == 0){
        attachment = {
            color: '#008000',
            elements:[],
            text: `${messageText}:large_green_circle: Test execution *SUCCEEDED*`,
            ts: Date.now().toString(),
          }
    }
    const body = {

        attachments: [
            attachment
          ],

    };
    return body;
};

const jsonString = JSON.stringify(slackPayload())
fs.writeFile('jsonReporter.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})