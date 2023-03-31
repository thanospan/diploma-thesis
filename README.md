# Diploma thesis
This repository contains the source code for my [diploma thesis](https://nemertes.library.upatras.gr/items/46e8452c-5d81-4b1c-940c-2346e1a48eba) titled "Design and development of a dynamic role management API for data protection in smart city applications", which was submitted to the [Department of Electrical and Computer Engineering](https://www.ece.upatras.gr/index.php/en/) at the [University of Patras](https://www.upatras.gr/en/).


## Requirements
- [Ubuntu 20.04.3 LTS](https://ubuntu.com/)
- [Docker 20.10.12, build e91ed57](https://www.docker.com/)
- [Postman 9.13.1](https://www.postman.com/)
- [Robo 3T 1.4.4](https://robomongo.org/)

## Setup

- Make a parent directory for the project:
```
mkdir ./SafeAmea
```

- Clone this repository:
```
git clone https://github.com/thanospan/diploma-thesis.git ./SafeAmea/SafeAmea-Masked-API
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
docker run -d -v $(pwd)/SafeAmea/SafeAmea-DB-Data:/data/db -p 27017:27017 --name safeamea-mongo --network safeamea -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=01234 mongo:4.4.12
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
```
```
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
```
```
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
cd ./SafeAmea/SafeAmea-Masked-API
```
Copy .env.example to .env:
```
cp config/.env.example config/.env
```
Build the safeamea-masked-api Docker image:
```
docker build -t safeamea-masked-api .
```
Run the SafeAmea Masked API Docker container:
```
docker run -d -p 3007:3007 --name safeamea-masked-api --network safeamea safeamea-masked-api
```
Execute an interactive bash shell on the container:
```
docker exec -it safeamea-masked-api /bin/bash
```
Populate the safeamea MongoDB:
```
node scripts/populateSafeameaDb.js
```
Populate the safeameaMasked MongoDB:
```
node scripts/populateSafeameaMaskedDb.js
```
Exit the interactive bash shell:
```
exit
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

- Verify that the SafeAmea Masked API is running:
```
curl -w '\n' http://localhost:3007/masked
```

- Import the provided [Postman collection](https://github.com/thanospan/diploma-thesis/tree/main/assets/postman).

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

## Use case

- User:
  - email: user@example.com
  - password: aA1!a

- Role:
  - name: cityPlanner

- Permission:
  - Method: GET<br>
  - Endpoint: /masked/amea/

- Masking policies:

- Resource: Club<br>
Excluded: [_id, __v, updated, created]<br>
Masked: []

- Resource: Amea<br>
Excluded: [owner, __enc_surname, updated, created, disabilitiesDesc, caretaker.caredescription, __v,  _id]<br>
Masked: [name, surname, caretaker.carename, caretaker.caresurname, email.value, caretaker.careemail, phoneNumber.value, caretaker.carephone, address, loc.coordinates, birthday]

- Update the adminToken Postman collection variable.
- Sign up by sending a POST request to the /users/signup endpoint.
- Visit MailHog (http://localhost:8025/), open the verification email and copy the userId, emailToken values.
- Update the userId Postman collection variable.
- Verify the email address by sending a POST request to the /users/email-verification endpoint, providing the emailToken as a header and the userId as a query parameter.
- Log in by sending a POST request to the /users/login endpoint. Copy the token header of the response and update the userToken Postman collection variable.
- Create the cityPlanner role by sending a POST request to the /roles endpoint. Resend the request and copy the roleId. (TODO: Return the roleId as a header after role creation)
- Create the permission by sending a POST request to the /permissions endpoint. Copy the permissionId. (TODO: Return the permissionId as a header after permission creation)
- Create the policies by sending POST requests to the /policies endpoint. Copy the policyId. (TODO: Return the policyId as a header after policy creation)
- Update the cityPlanner role's permissions by sending a POST request to the /roles/{roleId}/permissions endpoint.
- Update the cityPlanner role's policies by sending a POST request to the /roles/{roleId}/policies endpoint.
- Assign the cityPlanner role to the user by sending a POST request to the /users/{userId}/roles endpoint.
- Send a GET request to the /amea endpoint, providing the userToken as a header.

## SafeAmea Masked API Response Example

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
      "value": "1918154734",
      "active": 1
    }

  </td>

  <td>

    "phoneNumber": {
      "value": "19xxxxxxxx34",
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
        "phoneNumber": "1974305162",
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
      "carephone": "1958632653",
      "caredescription": "Caretaker description"
    }

  </td>

  <td>

    "caretaker": {
      "carename": "A",
      "caresurname": "E",
      "careemail": "xxxxxx@example.com",
      "carephone": "19xxxxxxxx53"
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
