# Criteria N - Continuous Monitoring

#### _Set up or used continuous monitoring._

We performed continuous monitoring for both the platform and the Node.js server using two different services. 

For the platform and infrastructure, we used [AWS CloudWatch](http://aws.amazon.com/cloudwatch/). By creating the server using Elastic Beanstalk, continuous monitoring via CloudWatch was automatically configured. The CloudWatch console provides access to the average latency, sum requests, CPU utilization, network I/O, and other monitoring. 

![alt text](https://raw.githubusercontent.com/nci-ats/agile-bpa/docs/attachments/Continuous-Monitoring.png "Continous Monitoring")

In addition to displaying the data graphically, CloudWatch can automatically trigger email alerts if certain criteria are met. Additional alerts were created to provide notifications of major incidents.  For example, an alarm was triggered when CPU usage was over 90%, providing notification that Elastic Beanstalk was about to spawn a new EC2 instance.

For the Node.js server, [PM2](https://github.com/Unitech/pm2) was used to monitor the API in our development environment. PM2 allowed us to spawn our app in cluster mode (making use of multithreading) and allowed us to easily monitor performance. By using PM2 monitoring, real-time updates on the application and each of the individual threads were available during load testing.

**References:**
* http://aws.amazon.com/cloudwatch/
* https://github.com/Unitech/pm2

### NCI - Food Recall Impact App (FRIA)
