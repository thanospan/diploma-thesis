# SafeAmea-Masked-API

## Requirements
- [Ubuntu 20.04.3 LTS](https://ubuntu.com/)
- [Docker 20.10.12, build e91ed57](https://www.docker.com/)
- [Docker Compose 2.2.3](https://docs.docker.com/compose/cli-command/)
- [Node.js 16.14.0 LTS](https://nodejs.org/)
- [npm 8.4.1](https://www.npmjs.com/)
- [Postman 9.13.1](https://www.postman.com/)
- [Robo 3T 1.4.4](https://robomongo.org/)

## Setup

- Make a parent directory for the project:
```
mkdir ~/Documents/SafeAmea
```

- Clone the SafeAmea Masked API repository:
```
git clone git@github.com:thanospan/SafeAmea-Masked-API.git ~/Documents/SafeAmea/SafeAmea-Masked-API
```

- Create a Docker network:
```
docker network create safeamea
```

- Run the MailHog Docker container:
```
docker run -d -p 1025:1025 -p 8025:8025 --name safeamea-mailhog --network safeamea mailhog/mailhog:v1.0.1
```

- Run the MongoDB Docker container:
```
docker run -d -v ~/Documents/SafeAmea/SafeAmea-DB-Data:/data/db -p 27017:27017 --name safeamea-mongo --network safeamea -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=01234 mongo:4.4.12
```

- Check if all containers are running:
```
docker ps
```

- Create the maskedApi MongoDB user to control access to the database (Role-Based Access Control - RBAC):
```
Username: maskedApi
Password: 56789
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
Enter password: 01234
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
    pwd: "56789",
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
Populate the safeamea MongoDB:
```
node scripts/populateSafeameaDb.js
```
Populate the safeameaMasked MongoDB:
```
node scripts/populateSafeameaMaskedDb.js
```

Check if the database is populated correctly:

Using MongoDB Shell:
```
docker exec -it safeamea-mongo /bin/bash
mongo
use admin
db.auth("mongoadmin", passwordPrompt())
Enter password: 01234
show dbs
use safeamea
show collections
db.amea.find().pretty()
db.clubs.find().pretty()
use safeameaMasked
show collections
db.emailTokens.find().pretty()
db.users.find().pretty()
db.roles.find().pretty()
db.permissions.find().pretty()
db.policies.find().pretty()
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
Password: 01234
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

All URIs are relative to *http://localhost:3007/masked*
    
| HTTP Method | Endpoint | Parameters |
| ----------- | -------- | ---------- |
| GET | / | |
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

## SafeAmea Masked API Response Example

Method: GET<br>
Endpoint: http://localhost:3007/masked/amea/<br>
Masking policies:

- Resource: Club\
Excluded: [_id, __v, updated, created]\
Masked: []

- Resource: Amea\
Excluded: [owner, __enc_surname, updated, created, disabilitiesDesc, caretaker.caredescription, __v,  _id]\
Masked: [name, surname, caretaker.carename, caretaker.caresurname, email.value, caretaker.careemail, phoneNumber.value, caretaker.carephone, address, loc.coordinates, birthday]

<table>
<tr>
  <th>Field</th>
  <th>amea MongoDB Collection</th>
  <th>Masked API Response</th>
</tr>

<tr>
  <td>_id</td>

  <td>

    "_id": ObjectId("610ffd1dc81eab4df7ea66c3")

  </td>

  <td></td>
</tr>

<tr>
  <td>owner</td>

  <td>

    "owner": [ 
      ObjectId("610ffd1dc81eab4df7ea66c2")
    ]

  </td>

  <td></td>
</tr>

<tr>
  <td>name</td>

  <td>

    "name": "Nikos"

  </td>

  <td>

    "name": "N"

  </td>
</tr>

<tr>
  <td>surname</td>

  <td>

    "surname": "Alexandrou"

  </td>

  <td>

    "surname": "A"

  </td>
</tr>

<tr>
  <td>email</td>

  <td>
  
    "email": {
      "value": "nikos.alexandrou@example.com",
      "active": 1
    }
    
  </td>

  <td>
  
    "email": {
      "value": "xxxxxx@example.com",
      "active": 1
    }
    
  </td>
</tr>

<tr>
  <td>phoneNumber</td>

  <td>

    "phoneNumber": {
      "value": "6918154734",
      "active": 1
    }

  </td>

  <td>

    "phoneNumber": {
      "value": "69xxxxxxxx34",
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
          "name": "PartialSupport",
          "value": 2
        }
      }, 
      {
        "name": "Hearing",
        "sub": {
          "name": "Deaf",
          "value": 3
        }
      }, 
      {
        "name": "Vision",
        "sub": {
          "name": "Amblyopia",
          "value": 2
        }
      }, 
      {
        "name": "Mental",
        "sub": {
          "name": "ExtendedSupport",
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
          "name": "PartialSupport",
          "value": 2
        }
      },
      {
        "name": "Hearing",
        "sub": {
          "name": "Deaf",
          "value": 3
        }
      },
      {
        "name": "Vision",
        "sub": {
          "name": "Amblyopia",
          "value": 2
        }
      },
      {
        "name": "Mental",
        "sub": {
          "name": "ExtendedSupport",
          "value": 2
        }
      }
    ]

  </td>
</tr>

<tr>
  <td>disabilitiesDesc</td>

  <td>

    "disabilitiesDesc": "Disabilities description text"

  </td>

  <td></td>
</tr>

<tr>
  <td>loc</td>

  <td>

    "loc": {
      "coordinates": [ 
        38.246022, 
        21.739842
      ],
      "type": "Point"
    }

  </td>

  <td>

    "loc": {
      "coordinates": [
        38.2483324,
        21.7413914
      ],
      "type": "Point"
    }

  </td>
</tr>

<tr>
  <td>address</td>

  <td>

    "address": "Address"

  </td>

  <td>

    "address": "xxxxxx"

  </td>
</tr>

<tr>
  <td>floor</td>

  <td>

    "floor": 5

  </td>

  <td>

    "floor": 5

  </td>
</tr>

<tr>
  <td>region</td>

  <td>

    "region": {
      "administrative": "Western Greece",
      "municipality": "Patras"
    }

  </td>

  <td>

    "region": {
      "administrative": "Western Greece",
      "municipality": "Patras"
    }

  </td>
</tr>

<tr>
  <td>club</td>

  <td>

    "club": [ 
      ObjectId("610ffd1dc81eab4df7ea66a4")
    ]

  </td>

  <td>

    "club": [
      {
        "loc": {
          "coordinates": [
            38.22398,
            21.757794
          ],
          "type": "Point"
        },
        "name": "Club 6",
        "phoneNumber": "6974305162",
        "region": {
          "administrative": "Western Greece",
          "municipality": "Patras"
        },
        "address": "Address",
        "status": "rejected"
      }
    ]

  </td>
</tr>

<tr>
  <td>caretaker</td>

  <td>

    "caretaker": {
      "carename": "Antonis",
      "caresurname": "Eleftheriou",
      "careemail": "antonis.eleftheriou@example.com",
      "carephone": "6958632653",
      "caredescription": "Caretaker description"
    }

  </td>

  <td>

    "caretaker": {
      "carename": "A",
      "caresurname": "E",
      "careemail": "xxxxxx@example.com",
      "carephone": "69xxxxxxxx53"
    }

  </td>
</tr>

<tr>
  <td>birthday</td>

  <td>

    "birthday": ISODate("1981-02-10T16:49:49.101Z")

  </td>

  <td>

    "birthday": "1979-06-02T03:55:35.466Z"

  </td>
</tr>

<tr>
  <td>created</td>

  <td>

    "created": ISODate("2021-06-17T15:49:49.101Z")

  </td>

  <td></td>
</tr>

<tr>
  <td>updated</td>

  <td>

    "updated": ISODate("2021-08-08T15:49:49.101Z")

  </td>

  <td></td>
</tr>

<tr>
  <td>status</td>

  <td>

    "status": "pending"

  </td>

  <td>

    "status": "pending"

  </td>
</tr>

<tr>
  <td>__v</td>

  <td>

    "__v": 0

  </td>

  <td></td>
</tr>

</table>
