# SafeAmea-Masked-API

## Setup

- Make a parent directory for all of the repositories:
```
mkdir ~/Documents/SafeAmea
```

- Clone the SafeAmea API repository:
```
git clone git@github.com:kostistr/UoP-Thesis-Panagiotidis-API.git ~/Documents/SafeAmea/SafeAmea-API
```

- Clone the SafeAmea Webapp repository:
```
git clone git@github.com:kostistr/UoP-Thesis-Panagiotidis-Webapp.git ~/Documents/SafeAmea/SafeAmea-Webapp
```

- Clone the SafeAmea Masked API repository:
```
git clone git@github.com:thanospan/SafeAmea-Masked-API.git ~/Documents/SafeAmea/SafeAmea-Masked-API
```

- Build the SafeAmea API Docker image:
```
cd ~/Documents/SafeAmea/SafeAmea-API
git checkout dev-secure-mongo
docker build -t safeamea-api .
```

- Build the SafeAmea Webapp Docker image:
```
cd ~/Documents/SafeAmea/SafeAmea-Webapp
git checkout dev
docker build -t safeamea-webapp .
```

- Create a Docker network:
```
docker network create safeamea
```

- Run the MailHog Docker container:
```
docker run -d -p 1025:1025 -p 8025:8025 --name safeamea-mailhog --network safeamea mailhog/mailhog
```

- Run the MongoDB Docker container:
```
docker run -d -v ~/Documents/SafeAmea/SafeAmea-DB-Data:/data/db -p 27017:27017 --name safeamea-mongo --network safeamea -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=123456 mongo
```

- Run the SafeAmea API Docker container:
```
docker run -d -p 3006:3006 --name safeamea-api --network safeamea safeamea-api
```

- Run the SafeAmea Webapp Docker container:
```
docker run -d -p 4200:4200 --name safeamea-webapp --network safeamea safeamea-webapp
```

- Check if all containers are running:
```
docker ps
```

- Populate the safeamea MongoDB:

Make the following HTTP POST request:
```
curl -X POST 'http://localhost:3006/api/v1.0/users/initAcounts'
```

Check if the SafeAmea API Docker container is still running:
```
docker ps
```
If the container has stopped, start it again using:
```
docker start safeamea-api
```
Check if the database is populated correctly:

Using MongoDB Shell:
```
docker exec -it safeamea-mongo /bin/bash
mongo
use admin
db.auth("mongoadmin", passwordPrompt())
Enter password: 123456 (Set while running the MongoDB container)
show dbs
use safeamea
show collections
db.account.find().pretty()
db.amea.find().pretty()
db.cityAdmin.find().pretty()
db.clubs.find().pretty()
db.disabilities.find().pretty()
db.operators.find().pretty()
db.roles.find().pretty()
exit
exit
```

or

Using Robo3T:
```
Address: localhost
Port: 27017
Authentication database: admin
User Name: mongoadmin
Password: 123456
```

If the database is not populated correctly, make the HTTP POST request again.
```
curl -X POST 'http://localhost:3006/api/v1.0/users/initAcounts'
Server response: OK
```

- Verify that everything is set up properly:
```
MailHog: http://localhost:8025
SafeAmea Webapp: http://localhost:4200
```

Login using the accounts created above:
```
subscriber@subscriber.com
manager@manager.com
operator@operator.com
cityAdmin@cityAdmin.com

Password: 123456
```

Create a new account to test MailHog.
```
Email: testAccount@testAccount.com
Password: 123456
```

- Create the maskedApi MongoDB user to control access to the database (Role-Based Access Control - RBAC):
```
Username: maskedApi
Password: 123456
Authentication database: safeameaMasked
Roles: findAmea on the safeamea database and dbOwner on the safeameaMasked database
findAmea privileges: Find actions on the amea and clubs collections of the safeamea database
```

Connect to the MongoDB using MongoDB Shell:
```
docker exec -it safeamea-mongo /bin/bash
mongo
use admin
db.auth("mongoadmin", passwordPrompt())
Enter password: 123456 (Set while running the MongoDB container)
show dbs
```

Create the findAmea Role:
```
use safeamea

db.createRole(
  {
    role: "findAmea",
    privileges: [
      { resource: { db: "safeamea", collection: "amea" },
        actions: [ "find" ]
      },
      { resource: { db: "safeamea", collection: "clubs" },
        actions: [ "find" ]
      }
    ],
    roles: []
  }
)
```

Create the maskedApi User:
```
use safeameaMasked

db.createUser(
  {
    user: "maskedApi",
    pwd: "123456",
    roles: [
      { role: "findAmea", db: "safeamea" },
      { role: "dbOwner", db: "safeameaMasked" }
    ]
  }
)
```

Verify that the maskedApi user is created properly and exit:
```
use safeamea
db.getRole( "findAmea", { showPrivileges: true } )

use safeameaMasked
db.getUser("maskedApi")
exit
exit
```

- Run the SafeAmea Masked API:
```
cd ~/Documents/SafeAmea/SafeAmea-Masked-API
```
Copy .env.example to .env:
```
cp config/.env.example config/.env
```
Install dependencies:
```
npm install
```
Populate the safeameaMasked MongoDB:
```
node scripts/init.js
(Ctrl+C)
```
Run the SafeAmea Masked API:
```
node app.js
or
npm run dev
```
- Verify that the SafeAmea Masked API is running:
```
SafeAmea Masked API: http://localhost:3007/masked/
```

## SafeAmea Masked API Endpoints

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/b5480264e768a84c9976)

All URIs are relative to *http://localhost:3007/masked*
    
| HTTP Method | Endpoint | Parameters |
| ----------- | -------- | ---------- |
| GET | /users/ | headers: token |
| POST | /users/signup | body: email, password |
| POST | /users/email-verification | headers: emailToken<br> query: userId |
| POST | /users/login | body: email, password |
| POST | /users/logout | headers: token |
| POST | /users/:userId/roles | headers: token<br> params: userId<br> body: roles |
| DELETE | /users/:userId/ | headers: token<br> params: userId |
| GET | /roles/ | headers: token |
| POST | /roles/ | headers: token<br> body: name, permissions, policies, status |
| POST | /roles/:roleId/permissions | headers: token<br> params: roleId<br> body: permissions |
| POST | /roles/:roleId/policies | headers: token<br> params: roleId<br> body: policies |
| POST | /roles/:roleId/status | headers: token<br> params: roleId<br> body: status |
| DELETE | /roles/:roleId/ | headers: token<br> params: roleId |
| GET | /permissions/ | headers: token |
| POST | /permissions/ | headers: token<br> body: endpoint, methods, status |
| POST | /permissions/:permissionId/methods | headers: token<br> params: permissionId<br> body: methods |
| POST | /permissions/:permissionId/status | headers: token<br> params: permissionId<br> body: status |
| DELETE | /permissions/:permissionId/ | headers: token<br> params: permissionId |
| GET | /policies/ | headers: token |
| POST | /policies/ | headers: token<br> body: resource, excluded, masked, status |
| POST | /policies/:policyId/excluded | headers: token<br> params: policyId<br> body: excluded |
| POST | /policies/:policyId/masked | headers: token<br> params: policyId<br> body: masked |
| POST | /policies/:policyId/status | headers: token<br> params: policyId<br> body: status |
| DELETE | /policies/:policyId/ | headers: token<br> params: policyId |
| GET | /amea/ | headers: token |

## SafeAmea Masked API Output Example

<ins>Request</ins>\
Method: GET<br>
Endpoint: http://localhost:3007/masked/amea/<br>
Default Data Masking (User with no policies for the amea and clubs resources)

<table>
<tr>
  <th>Field</th>
  <th>amea MongoDB Collection</th>
  <th>Masked API Output</th>
</tr>

<tr>
  <td>_id</td>

  <td>

    "_id": ObjectId("606ec04bb61a55ca62ab87bd")

  </td>

  <td></td>
</tr>

<tr>
  <td>owner</td>

  <td>

    "owner": [
      ObjectId("606ec04bb61a5574b9ab87be")
    ]

  </td>

  <td></td>
</tr>

<tr>
  <td>name</td>

  <td>

    "name": "Δημήτρης"

  </td>

  <td>

    "name": "Δ"

  </td>
</tr>

<tr>
  <td>surname</td>

  <td>

    "surname": "4710474e81a1230e54269c77c4
      92eea6:e2c7c8153764488d11d0fe457dce7
      8b2c5a34f76b93f5bff085b4a0e8c537fef"

  </td>

  <td>

    "surname": "4"

  </td>
</tr>

<tr>
  <td>email</td>

  <td>
  
    "email": {
      "value": "subscriber@subscriber.com",
      "active": 1
    }
    
  </td>

  <td>
  
    "email": {
      "value": "xxxxx@xxxxx.xxx",
      "active": 1
    }
    
  </td>
</tr>

<tr>
  <td>phoneNumber</td>

  <td>

    "phoneNumber": {
      "value": "6974038999",
      "active": 1
    }

  </td>

  <td>

    "phoneNumber": {
      "value": "69xxxxxxxx99",
      "active": 1
    }

  </td>
</tr>

<tr>
  <td>disabilities</td>

  <td>

    "disabilities": [
      {
        "name": "Mobility",
        "sub": {
          "name": "Partial",
          "value": 1
        }
      },
      {
        "name": "Hearing",
        "sub": {
          "name": "HardHearing",
          "value": 2
        }
      }
    ]

  </td>

  <td>

    "disabilities": [
      {
        "name": "Mobility",
        "sub": {
          "name": "Partial",
          "value": 1
        }
      },
      {
        "name": "Hearing",
        "sub": {
          "name": "HardHearing",
          "value": 2
        }
      }
    ]

  </td>
</tr>

<tr>
  <td>disabilitiesDesc</td>

  <td>

    "disabilitiesDesc": "Description text"

  </td>

  <td></td>
</tr>

<tr>
  <td>loc</td>

  <td>

    "loc": {
      "coordinates": [
        21.7401209, 
        38.2478087
      ],
      "type": "Point"
    }

  </td>

  <td>

    "loc": {
      "coordinates": [
        21.7425005,
        38.2494451
      ],
      "type": "Point"
    }

  </td>
</tr>

<tr>
  <td>address</td>

  <td>

    "address": "Αρτης 44"

  </td>

  <td>

    "address": "xxxxxxxxxx"

  </td>
</tr>

<tr>
  <td>floor</td>

  <td>

    "floor": 4

  </td>

  <td>

    "floor": 4

  </td>
</tr>

<tr>
  <td>region</td>

  <td>

    "region": {
      "administrative": "ΔΥΤΙΚΗΣ ΕΛΛΑΔΑΣ",
      "municipality": "ΠΑΤΡΕΩΝ"
    }

  </td>

  <td>

    "region": {
      "administrative": "ΔΥΤΙΚΗΣ ΕΛΛΑΔΑΣ",
      "municipality": "ΠΑΤΡΕΩΝ"
    }

  </td>
</tr>

<tr>
  <td>club</td>

  <td>

    "club": [
      ObjectId("606ec04ab61a552b02ab87b5")
    ]

  </td>

  <td>

    "club": [
      {
        "loc": {
          "coordinates": [
            21.7401209,
            38.2478087
          ],
          "type": "Point"
        },
        "name": "Σύλλογος Μαχητές",
        "phoneNumber": "6974037899",
        "region": {
          "administrative": "ΔΥΤΙΚΗΣ ΕΛΛΑΔΑΣ",
          "municipality": "ΠΑΤΡΕΩΝ"
        },
        "address": "Ρηγα Φεραίου 44, ΤΚ 26226",
        "status": "accepted"
      }
    ]

  </td>
</tr>

<tr>
  <td>caretaker</td>

  <td>

    "caretaker": {
      "carename": "Βαγγελης",
      "caresurname": "Παπακης",
      "careemail": "vagpap@email.gr",
      "carephone": "6974558996",
      "caredescription": "some extra information"
    }

  </td>

  <td>

    "caretaker": {
      "carename": "Β",
      "caresurname": "Π",
      "careemail": "xxxxx@xxxxx.xxx",
      "carephone": "69xxxxxxxx96"
    }

  </td>
</tr>

<tr>
  <td>birthday</td>

  <td>

    "birthday": ISODate("1979-05-15T00:00:00.000Z")

  </td>

  <td>

    "birthday": "1977-06-09T04:49:12.977Z"

  </td>
</tr>

<tr>
  <td>created</td>

  <td>

    "created": ISODate("2021-04-08T08:35:12.988Z")

  </td>

  <td></td>
</tr>

<tr>
  <td>updated</td>

  <td>

    "updated": ISODate("2021-04-08T08:35:23.233Z")

  </td>

  <td></td>
</tr>

<tr>
  <td>status</td>

  <td>

    "status": "accepted"

  </td>

  <td>

    "status": "accepted"

  </td>
</tr>

<tr>
  <td>__enc_surname</td>

  <td>

    "__enc_surname": true

  </td>

  <td></td>
</tr>

<tr>
  <td>__v</td>

  <td>

    "__v": 0

  </td>

  <td></td>
</tr>

</table>