import fs from 'fs'

/**
 * Merge json reporters
 * @param {*} target 
 * @returns 
 */
function mergeJson(target) {
    for (var argi = 1; argi < arguments.length; argi++) {
        var source = arguments[argi];
        for (var key in source) {
            if (!(key in target)) {
                target[key] = [];
            }
            for (var i = 0; i < source[key].length; i++) {
                target[key].push(source[key][i]);
            }
        }
    }
    return target;
}

/**
* Access each json file with specific name pattern under output
* @param {*} dir 
* @param {*} name 
* @returns 
*/
function getFiles(dir, name) {
    const matchedFiles = [];
  
    const files = fs.readdirSync(dir)
  
    for (const file of files) {
        // Method 2:
        if (file.startsWith(name)) {
            matchedFiles.push(file);
        }
    }
    return matchedFiles
  }

let arr = []
let j
for (const file of getFiles('./mochaOutput', 'results-')) {
    j = JSON.parse(fs.readFileSync(`./mochaOutput/${file}`).toString())
    //console.log(j)
    arr.push(j)

}
let combinedJson =  mergeJson(arr[0],arr[1], arr[2], arr[3], arr[4], arr[5], arr[6],arr[7],arr[8],arr[9],arr[10])

for (const pass of combinedJson.passes) {
    pass.file = pass.file.split('/javascript-ui-framework/javascript-ui-framework/')[1]
}

for (const fail of combinedJson.failures) {
    fail.file = fail.file.split('/javascript-ui-framework/javascript-ui-framework/')[1]
}

for (const p of combinedJson.pending) {
    p.file = p.file.split('/javascript-ui-framework/javascript-ui-framework/')[1]
}

let webdriverIOJson
try {
  webdriverIOJson = JSON.parse(fs.readFileSync('./output/jsonReporter/test-results.json').toString());
} catch (err) {
    throw new Error(err.message)

}
let duration = 0
for (let suite of webdriverIOJson.suites) {
    duration+=suite.duration
}
let template = {
    "stats": {
      "suites": webdriverIOJson.suites.length,
      "tests": webdriverIOJson.state.failed + webdriverIOJson.state.passed + webdriverIOJson.state.skipped,
      "passes": webdriverIOJson.state.passed,
      "pending": webdriverIOJson.state.skipped,
      "failures": webdriverIOJson.state.failed,
      "start": webdriverIOJson.start,
      "end": webdriverIOJson.end,
      "duration": duration
    },
    "tests": combinedJson.tests,
    "pending": combinedJson.pending,
    "failures": combinedJson.failures,
    "passes": combinedJson.passes
  }

  const jsonString = JSON.stringify(template)
fs.writeFile('testResults.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})