# Criteria K - Unit Tests

#### _Wrote unit tests for their code._

[Unit tests](https://github.com/nci-ats/agile-bpa/blob/master/test/test.js) were implemented for the Node.js API using [Mocha](http://mochajs.org/) (asyncronous testing framework), [Chai](http://chaijs.com/) (assertion library), and [SuperTest](https://github.com/visionmedia/supertest) (HTTP endpoints).  This testing stack allows the HTTP endpoints of each API to be automatically tested on a separate port connecting to the same data sources.  The tests are integrated into [package.json](https://github.com/nci-ats/agile-bpa/blob/master/package.json) through the test script **"mocha test"**.
![alt text](https://raw.githubusercontent.com/nci-ats/agile-bpa/docs/attachments/Unit-Test.png "Unit Test")

Additionally, [Code Climate](https://codeclimate.com/github/nci-ats/agile-bpa/code) was set up to automatically analyze JavaScript and CSS for code quality issues. [![Code Climate](https://codeclimate.com/github/nci-ats/agile-bpa/badges/gpa.svg)](https://codeclimate.com/github/nci-ats/agile-bpa)

**References:**
* https://github.com/nci-ats/agile-bpa/blob/master/test/test.js
* https://github.com/nci-ats/agile-bpa/blob/master/package.json
* http://mochajs.org/
* http://chaijs.com/
* https://github.com/visionmedia/supertest
* https://codeclimate.com/github/nci-ats/agile-bpa/code

### NCI - Food Recall Impact App (FRIA)
