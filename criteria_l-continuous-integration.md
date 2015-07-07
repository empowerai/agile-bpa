# Criteria L - Continuous Integration

#### _Set up or used a continuous integration system to automate the running of tests and continuously deployed their code to their IaaS or PaaS provider._

Bamboo, GitHub, Docker, Mocha, and AWS were set up to provide a complete system of contininous integration.

Code was committed to the same development branch in GitHub ([api-ui](https://github.com/nci-ats/agile-bpa/tree/api-ui)) multiple times per day. Developers worked on code, then merged, and committed once enough progress had been made to warrant a push. When new code was committed to the development branch, a corresponding [Bamboo](https://computech.jira.com/builds/browse/BPA-CI) build was started including pulling code from [GitHub](https://github.com/nci-ats/agile-bpa), pulling images from [Docker](https://registry.hub.docker.com/repos/nciats/), running [Mocha](http://mochajs.org/) tests, and deploying to the [AWS Elastic Beanstalk PaaS](http://aws.amazon.com/elasticbeanstalk/). 

![alt text](https://raw.githubusercontent.com/nci-ats/agile-bpa/docs/attachments/Continuous-Integration.png "Continuous Integration")

Bamboo had a separate test build job that ran every 15 minutes. The test job ran through the same steps that the build and deploy jobs did, without actually deploying the code. The purpose of this task was to ensure that when an actual deployment was ready, the scripts and tasks would run without any errors. Should the Bamboo task run into any errors, it would notify the DevOps Engineer about the error so that it could be fixed.

Additionally, there were multiple pull requests into the master branch during development for major releases to production. A similar process was setup using Bamboo for continuous integration for PROD.

**References:**
* https://computech.jira.com/builds/browse/BPA-CI
* https://github.com/nci-ats/agile-bpa/tree/api-ui
* https://registry.hub.docker.com/repos/nciats/
* http://mochajs.org/
* http://aws.amazon.com/elasticbeanstalk/


### NCI - Food Recall Impact App (FRIA)
