# NCI - Food Recall Impact App (FRIA)


Production Application Website:  http://agile-bpa.elasticbeanstalk.com/

Pool Three Full Stack References:  https://github.com/nci-ats/agile-bpa/blob/docs/attachment_e.md

---

#### _About Making Our App ..._

The FDA Food Recall Impact App (FRIA) was built using tools and methods our teams leverage everyday for all our federal civil customers, and have since 2010. Our agile, open-source approach led to our award-winning 2012 National Broadband Map for the FCC, a precursor of agile methods, tech stack and open API implementation that, in part, inspired CIO Van Roekel’s Federal Digital Strategy. Of course the Digital Playbook embodies many of the agile practices our teams live and breathe every day at the FCC, IRS, and other clients.

Bootstrapping FRIA was straightforward - as typical client development activity, we often spin up multidisciplinary teams, environments in AWS, and supporting SaaS tools. Below we share our agile ecosystem and technologies which let us to iteratively realize and deploy FRIA capability rapidly for the product owner and users.

![alt text](https://github.com/brianfunk/test-md/blob/master/attachments/Food-Recall-Impact-Map-Header.png "Food Recall Impact Map Header")

####Getting to Minimal Viable Product and Beyond

We scoped a data driven food recall application, with an objective to achieve Minimal Viable Product (MVP) within 3 sprints. While our tech team started with a product owner and a few customers to shape MVP, our goal was to deploy as soon as possible, so we could begin getting feedback from a broader user base (for FRIA, our company was our broader user base). To achieve rapid marketplace interaction, we chose to take on certain hardening and operational improvements within our operations and maintenance (O&M) activities, post-MVP, since they were not necessary to initially engage the public.

To provide food recall information to the public, the FRIA leverages interactive maps with data mashups from several federal agencies, facilitating interactive queries, open data through JSON APIs, and focuses on high usability driven through a FRIA-specific style guide.

![alt text](https://github.com/brianfunk/test-md/blob/master/attachments/Food-Recall-Impact-Map.png "Food Recall Impact Map")

####Agile Ecosystem - Process & Methods

**Iteration 0** had the following objectives: identify MVP users, product owner, team members, establish application objectives, curate data,  provision infrastructure, select open source technology and tooling. At initial kickoff meeting established the team and team lead, core agile approach (Scrum), physical workspace, established a timeline, budget, and initial project plan.

We researched the FDA recall domain, and performed some early data and technical analysis in concert with first product owner and user dialogs. A pretotype was established as a basis for discussion with the product owner and users - two pretotype demos were used to ideate and create a product backlog which was prioritized by the product owner.

Meanwhile our DevOps team member established an AWS instance (configuring Elastic Beanstalk, Bamboo, and other tools), set up a project in our enterprise JIRA account managing backlog, issues and activities, and configured the environments for configuration management, automated builds, test, and deploy. The team selected Dockerfile and DockerHub as its container-based virtualization platform.

![alt text](https://raw.githubusercontent.com/nci-ats/agile-bpa/docs/attachments/Food-Recall-Impact-Map-Details.png "Food Recall Impact Map Details")

**Iterations 1, 2, 3** were used to iteratively build FRIA, interact with the product owner and users, and arrive to a deployable MVP. The team executed an Agile Scrum framework with burn-down charts, agile boards and a backlog to track the work and any issues as they arose.

Through our human-centered design process, the product owner and users chose to create a map-based interactive application, visualizing data and allowing drill-down capability. Google questionnaires captured feedback and expectations. Furthermore early style guide development established framed our UX approach, stating our Design Principles, Color, Typography, Icons, and Maps. Working from these guidelines greatly facilitated a cohesive user experience.

Each sprint was a 2-day time box. The team held their first kickoff and sprint planning session meeting on Day 1 of each sprint. Given the short time frame, we chose to perform retrospectives during daily sprint reviews to sort out what to keep and what to improve. Team members and the product owner participated in morning daily stand ups, working together in a common space, collaborating in-person and over Google Talk. All work products and features were captured as product backlog items in JIRA. Frequent demos with the users and product owner provided feedback which fed the product backlog.

The team self-organized and self-governed making local decisions while still focusing on whole-team responsibility to deliver a high quality, on-point application. The team saw an example of this when the Content Strategist and Business Analyst offered to provide support to the Configuration Manager to complete key artifacts. Through pair programming team members reviewed code and provided continual feedback. Code reviews were performed through pair programming. Test automation and unit tests were set up.

At the end of Iteration 2 FRIA was feature complete. Users were impressed with the application’s ease-of-use and quick access to meaningful data. Iteration 3 pulled backlog stories for 508 compliance and a few usability items which came from Iteration 2 feedback. The product owner approved deployment at Iteration 3, stating FRIA achieved MVP and was ready for broader public feedback.

![alt text](https://raw.githubusercontent.com/nci-ats/agile-bpa/docs/attachments/Food-Recall-Impact-Stats.png "Food Recall Impact Map Stats")

**O&M Releases** were performed over several days, once the MVP was deployed. Early feedback from our broader corporate user base surfaced several bugs in the UX. We captured this information in JIRA, pulling fix requests and performing maintenance. Operational capabilities were also added and incrementally released. 

Team members pulled work from the backlog, including final documentation and updates which harmonized documents with the tech stack. We added Node.js unit tests  with Mocha.  GIS capabilities were migrated to OpenStreetMap basemaps and Nominatim geocoding. FRIA’s Docker container was finished and deployed, Code Climate was added (along with improvements based on Code Climate which were performed over the remaining O&M releases).

####Technology

The team is well-versed in a broad, modern web stack, yet we also used this opportunity to explore a few new packages.

| Category | Technology Stack |
| --- | --- |
| Backend | Node.js, Express, Mocha, Chai, SuperTest, Morgan, Moment (complete list in package.json) |
| Frontend | jQuery, jCarousel, Bootstrap, Swagger, Google Fonts, Font Awesome, HighCharts |
| Data | openFDA API, Census Bureau 2014 Population, PostgreSQL, File Formats: JSON, XML, CSV |
| GIS | PostGIS, QGIS, Leaflet.js, Mapbox.js, Nominatim, OpenStreetMap, CartoDB Tiles, MapQuest Tiles, Stamen Tiles, NASA/JPL Imagery, USDA/FSA Imagery, USGS BGN GNIS |
| DevOps | Elastic Beanstalk, GitHub, Bamboo, CloudWatch, Docker, PM2, CodeClimate, SourceTree, TortoiseGit | 
| Tools | JIRA, Brackets, Sublime, Dreamweaver, Google Hangouts, Google Docs, Photoshop, Illustrator |

![alt text](https://raw.githubusercontent.com/nci-ats/agile-bpa/docs/attachments/Architecture-Diagram.png "Architecture Diagram")
