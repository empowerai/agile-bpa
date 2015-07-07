# Criteria M - Configuration Management

#### _Set up or used configuration management._

The team set up [Atlassian Bamboo](https://www.atlassian.com/software/bamboo) as the primary tool to ensure proper configuration management and version control for new code deployments. Bamboo pulls the latest code that is stored in GitHub, along with the image from Docker Hub, readies it, and deploys it to the Amazon Web Services (AWS) Elastic Beanstalk environment.

![alt text](https://raw.githubusercontent.com/nci-ats/agile-bpa/docs/attachments/Bamboo-Configuration.png "Bamboo Configuration") 
 
When new code is pushed to the repo and is ready to be deployed, the Bamboo build job runs through a set of scripts and tasks that supplies specific information about the DEV Elastic Beanstalk server.  This then extracts the version number for [tagging and versioning](https://computech.jira.com/builds/browse/BPA-APP/deployments) purposes and readies the build for deployment. It then passes the build to the deploy job, which deploys to our DEV server using our AWS credentials. 

Finally, when the code is ready for a PROD release, the code is modified to point to the PROD server, the build is deployed, and, upon a successful deployment, the code at that point in the GitHub repo is [tagged with the version number](https://github.com/nci-ats/agile-bpa/releases/tag/0.0.2-PROD-RC2) of the PROD release.
 
Bamboo has a list of past build and deployment jobs to ensure versioning and rollbacks. AWS keeps a record of which builds were deployed and when. GitHub has a record of when PROD releases were made.

**References:**
* https://www.atlassian.com/software/bamboo
* https://computech.jira.com/builds/browse/BPA-APP/deployments
* https://github.com/nci-ats/agile-bpa/releases/tag/0.0.2-PROD-RC2

### NCI - Food Recall Impact App (FRIA)
