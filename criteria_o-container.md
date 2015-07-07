# Criteria O - Container

#### _Deploy their software in a container (i.e., utilized operating-system-level virtualization)._

The prototype application was containerized using [Docker](https://registry.hub.docker.com/repos/nciats/).  Automated builds were setup in [Docker Hub](https://registry.hub.docker.com/u/nciats/agile-bpa-master/) to automatically create new Docker images from a [Dockerfile](https://github.com/nci-ats/agile-bpa/blob/master/Dockerfile) in GitHub.  

This is used for both **DEV** and **PROD** using the **api-ui** and **master** branches from the GitHub repo.  The Docker Hub repos are automatically updated after a GitHub commit.

![alt text](https://raw.githubusercontent.com/nci-ats/agile-bpa/docs/attachments/Docker-Home.png "Docker Home")

**References:**
* https://registry.hub.docker.com/repos/nciats/
* https://registry.hub.docker.com/u/nciats/agile-bpa-master/
* https://github.com/nci-ats/agile-bpa/blob/master/Dockerfile

### NCI - Food Recall Impact App (FRIA)
