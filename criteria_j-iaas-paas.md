# Criteria J - IaaS/PaaS

#### _Deployed the prototype on an Infrastructure as a Service (IaaS) or Platform as a Service (PaaS) provider, and indicated which provider they used._

The prototype is deployed on Amazon Web Services at: http://agile-bpa.elasticbeanstalk.com/

We used [AWS Elastic Beanstalk](http://aws.amazon.com/elasticbeanstalk/) PaaS, which deploys a Docker image to a EC2 Linux environment, with CloudWatch continuous monitoring, SNS notifications, auto scaling, as well as security groups.   Elastic Beanstalk integrated well with Bamboo in order to fit seamlessly into our Continuous Integration and Configuration Management processes via the AWS Command Line Interface.

The Elastic Beanstalk (PaaS) provided the ability to create applications preconfigured with tools such as Node.js and Docker.  At the same time, Elastic Beanstalk components, including the EC2 instances (IaaS), can be accessed directly to provide more operating system level control.

We also used [AWS Relational Database Service (RDS)](http://aws.amazon.com/rds/) with PostgreSQL as the PaaS database provider. RDS provides a open source, fully managed PostgreSQL database, including PostGIS extension, with built-in monitoring, backups, security, patches, and replication.

![alt text](https://raw.githubusercontent.com/nci-ats/agile-bpa/docs/attachments/PaaS.png "PaaS")

**References:**
* http://agile-bpa.elasticbeanstalk.com/
* http://aws.amazon.com/elasticbeanstalk/

### NCI - Food Recall Impact App (FRIA)
