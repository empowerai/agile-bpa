# Criteria P - Install

#### _Provided sufficient documentation to install and run their prototype on another machine._

**Docker**

The application, including API and web UI, has been containerized and can be deployed through the Docker image available at [Docker Hub](https://registry.hub.docker.com/u/nciats/agile-bpa-master/).  The [Dockerfile](https://github.com/nci-ats/agile-bpa/blob/master/Dockerfile) used to build this image is available on GitHub.

To run the Docker image, you will need a Linux server or VM with Docker installed (such as Boot2Docker).  Then run: `docker run -p 80:8000 -t nciats/agile-bpa-master`

**Environment Variables**

For security reasons, sensitive information is stored as environment variables.  This also allows for simple configuration between environments (DEV, ST, AT, PROD).  The Node.js application utilizes the following environment variables: NODE_APP_PORT, NODE_FDA_URL, NODE_FDA_KEY, NODE_DB_URL

* Windows
  * `set NODE_APP_PORT=8000`
  * `set NODE_FDA_URL=https://api.fda.gov/food/enforcement.json`
  * `set NODE_FDA_KEY=FDAKEY`
  * `set NODE_DB_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE`

* Mac/Linux
  * `export NODE_APP_PORT=8000`
  * `export NODE_FDA_URL=https://api.fda.gov/food/enforcement.json`
  * `export NODE_FDA_KEY=FDAKEY`
  * `export NODE_DB_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE`

* Command Line
  * `NODE_APP_PORT=8000 NODE_FDA_URL=https://api.fda.gov/food/enforcement.json NODE_FDA_KEY=FDAKEY NODE_DB_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE node app.js`

**Elastic Beanstalk**

The Docker container can be easily deployed to AWS Elastic Beanstalk with the [Dockerrun.aws.json](https://github.com/nci-ats/agile-bpa/blob/master/Dockerrun.aws.json) file from the GitHub repo.  Environment variables will need to be manually configured through the web console or automatically created with a **.ebextensions** config file.

**GitHub**

All of the application code is in the [GitHub repository](https://github.com/nci-ats/agile-bpa).  This can be used to create a variety of builds and deployments with various CI tools. To run locally, simply download and extract the repo ZIP file.  You will need Node.js and NPM installed. Then set environment variables and run: `npm install` and `node app.js`

**Database**

The PostgreSQL database can be configured locally or on an external server.  The PROD application is using an AWS RDS managed database PaaS to demonstrate an external datasource.  The PostgreSQL USER, PASSWORD, HOST, PORT, and DATABASE need to be configured through the environment variables.

The PostgreSQL database consists of a single schema with a single table.  To set up the database, create a PostgreSQL database [version 9.1](http://www.postgresql.org/docs/9.1/static/index.html) or later and run the following queries:
* `CREATE SCHEMA IF NOT EXISTS fda_demo;`
* `CREATE TABLE IF NOT EXISTS fda_demo.affected_crowdsource_input     
(     
input_id integer NOT NULL DEFAULT nextval('affected_user_uniq_id_seq'::regclass),    
input_datetime timestamp without time zone,    
fda_recall_number character varying(100),    
input_status character(5) NOT NULL DEFAULT 'y'::bpchar,    
CONSTRAINT pk_affected_input_id PRIMARY KEY (input_id)    
);`

_Note:_ The prototype can run without the PostgreSQL database but the crowdsource counter feature will be disabled.

**References:**
* https://registry.hub.docker.com/u/nciats/agile-bpa-master/
* https://github.com/nci-ats/agile-bpa/blob/master/Dockerfile
* https://github.com/nci-ats/agile-bpa/blob/master/Dockerrun.aws.json
* https://github.com/nci-ats/agile-bpa
* http://www.postgresql.org/docs/9.1/static/index.html

### NCI - Food Recall Impact App (FRIA)
