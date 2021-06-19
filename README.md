# NEURONE Analytical Dashboard

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

Created by Fernando Villarreal Céspedes

## Description

NEURONE-AD (Analytical Dashboard) is a software module developed in the context of the NEURONE ecosystem (https://github.com/NEURONE-IL) as a complement for NEURONE-AM (Active Monitoring) module, providing a group of visual representations for the information provided by the REST API services of this.
NEURONE-AD is made up of two parts or layers. Each is briefly described below:

* Backend: This layer corresponds to the logical and data modeling layer. It provides a REST API for user authentication and registration services, as well as services for storing quick session settings and classroom renderings.
* Frontend: This second layer corresponds to the presentation layer of the module and is where the graphics are displayed. This client consumes all the services exposed by the APIs of the NEURONE-AD and NEURONE-AM modules.

## Use of REST API services and interaction with other modules of the NEURONE ecosystem

In its most basic conception, the configuration and subsequent display of the graphics in NEURONE-AD completely depends on the information provided by NEURONE-AM, so the correct installation of this module is key.
Although NEURONE-AD has its own registration and authentication services, these can be transferred to NEURONE-Auth, another new module designed for the creation and management of user accounts in the different modules of the NEURONE ecosystem.
Although it is not a requirement for the correct functioning of NEURONE-AD, the NEURONE-AM-Simulator application it is important and very useful for development and testing pourposes. As its name indicates, this software is a data simulator for the NEURONE search engine originally developed to provide test data for the NEURONE-AM module.

## Installation instructions

### Development

#### NEURONE-AM
1. It is suggested to read the installation instructions from the repository https://github.com/NEURONE-IL/neurone-am-deployment.

#### NEURONE-AD
1. Install Node.js. v12.18.2+ is recommended.
2. Install npm. v6.0.0+ is recommended.
3. Install Vue CLI. 4.5.3+ is recommended.
4. Clone or download this repository. 
5. Configure the Backend and Frontend environment variables (see Configuration section below).
6. In 'Backend' folder run the ```npm run dev``` command.
7. When changes are made to the code, the program recompiles automatically.
8. In 'Frontend' folder run the ```npm run serve -- --port 4004``` (suggested port).
9. As in Backend case, when changes are made to the Frontend code, the program recompiles automatically.

#### Database
A docker-compose.yml file is included in 'MongoDB Docker' folder to setup a MongoDB database server with three databases:
- test: Used by the NEURONE Seach Engine, NEURONE-AM and NEURONE-AM-Simulator. Stores users data and all its interactions in NEURONE, NEURONE-AM-Simulator stores the simulated data here. 
- neurone-ad: Used by NEURONE-AD. Stores the module users data, quick session settings and classroom renderings.
- neurone-auth: Used by NEURONE-AUth. Stores the module users data and credentials for others NEURONE modules.

1. Run the ```docker-compose up -d``` command in the repository folder.

### Production

#### NEURONE-AM
1. It is suggested to read the installation instructions from the repository https://github.com/NEURONE-IL/neurone-am-deployment.

#### NEURONE-AD
1. In 'Backend' folder run the ```docker build . -t neurone-ad-backend``` command.
2. Then, run the ```docker run -d -p 4003:8080 neurone-ad-backend``` command (4003 is the suggested port).
3. In 'Frontend' folder run the ```docker build . -t neurone-ad-frontend``` command.
4. Then, run the ```docker run -d -p 4004:80 neurone-ad-frontend``` command (4004 is the suggested port).

#### Database
A docker-compose.yml file is included to setup a MongoDB database server with three databases:
- test: Used by the NEURONE Seach Engine, NEURONE-AM and NEURONE-AM-Simulator. Stores users data and all its interactions in NEURONE, NEURONE-AM-Simulator stores the simulated data here. 
- neurone-ad: Used by NEURONE-AD. Stores the module users data, quick session settings and classroom renderings.
- neurone-auth: Used by NEURONE-AUth. Stores the module users data and credentials for others NEURONE modules.

1. Run the ```docker-compose up -d``` command in the repository folder.

### Optional

#### NEURONE-AM-Simulator
1. Clone or download the source code from https://github.com/javier322/neurone-am-simulator and follow its installations instructions.

#### NEURONE-Auth
1. Clone or download the source code from https://github.com/fvillarrealcespedes/NEURONEAuth.
2. In 'Backend' folder run the ```npm run dev``` command.
3. When changes are made to the code, the program recompiles automatically.
4. In 'Frontend' folder run the ```npm run serve -- --port 9001``` (9001 is the suggested port).
5. As in Backend case, when changes are made to the Frontend code, the program recompiles automatically.

### Configuration
Both for Frontend and Backend of NEURONE-AD there are environment variables, which must be in a .env file in their respective folder. An .env.example file with suggested names and ports is provided for each layer of the module.

#### Frontend
```
VUE_APP_NEURONE_AD_BACKEND_API_URL=http://localhost:4003
VUE_APP_NEURONE_AM_CONNECTOR_API_URL=http://localhost:8081
VUE_APP_NEURONE_AM_COORDINATOR_API_URL=http://localhost:7999
VUE_APP_NEURONE_AUTH_BACK_API_URL=http://localhost:9000
VUE_APP_NEURONE_AUTH_FRONT_URL=http://localhost:9001
VUE_APP_SERVICE_NAME=NEURONE-AD
VUE_APP_I18N_LOCALE=en
VUE_APP_I18N_FALLBACK_LOCALE=en
```

#### Backend
```
HOST=localhost
NEURONE_AD_BACK_PORT=4003
NEURONE_AD_FRONT_PORT=4004
NEURONE_AUTH_BACK_PORT=9000
DB_USER=admin
DB_PASSWORD=admin
DB_PORT=27017
DB_NAME=neurone-ad
DB_TEST_NAME=neurone-ad-test
SECRET_KEY=NeuRoNe-aDJWTKeY
```

#### NEURONE-Auth
It is important to know that if want to use the NEURONE-Auth module for user registration and authentication, its environment variables unlike NEURONE-AD are in JavaScript files, which are located in the 'Backend/config' subfolder.
For the authentication credentials to work correctly and for NEURONE-AD to be able to use the NEURONE-Auth credentials and its own, the variables in the 'auth.config.js' file must be exactly the same as the 'SECRET_KEY' variable from the previous section. In the same way, if you want to use the same database for both modules, the variables 'USER', 'PASSWORD', 'HOST', 'PORT' and 'DB' of the file 'db.config.js' must be exactly equal to the variables 'DB_USER', 'DB_PASSWORD', 'HOST', 'DB_PORT' and 'DB_NAME' from the previous section, respectively.
Finally, it is of equal importance that when adding the NEURONE-AD service to NEURONE-Auth, the name given is equal to the variable 'VUE_APP_SERVICE_NAME' of the NEURONE-AD Frontend .env file and that the Frontend and Backend URLs are the ones that are actually being used, and must be of the style 'http://HOST:PORT' and 'http://HOST:PORT'.


## License
NEURONE-AD's source code is released under the GNU Affero General Public License (Version 3), meaning that:

- NEURONE-AD is free to use, analyze, distribute and modify by anyone.
- In case of using a modified version of NEURONE-AD, all changes must be released under the same license and must be clearly stated.
- The NEURONE Development Team is not responsible for any problems or damages generated by the use of this software (or its derivated forms).