'use strict';

require('dotenv').config({ path: './config/.env.admin' });

const mongoose = require('mongoose');

const safeameaConn = require('../connections/safeameaDb');
const { Club } = require('../models/club');
const { Amea } = require('../models/amea');
const { Loader } = require('../utils/loader');
const geo = require('../utils/geo');

const clubs = [
  {
    _id: new mongoose.Types.ObjectId(),
    loc: {
      coordinates: [ 
        21.7401209, 
        38.2478087
      ],
      type: "Point"
    },
    created: new Date(),
    updated: new Date(),
    name: "Σύλλογος Μαχητές",
    phoneNumber: "6974037899",
    region: {
      administrative: "ΔΥΤΙΚΗΣ ΕΛΛΑΔΑΣ",
      municipality: "ΠΑΤΡΕΩΝ"
    },
    address: "Ρηγα Φεραίου 44, ΤΚ 26226",
    status: "accepted",
    __v: 0
  },
  {
    _id: new mongoose.Types.ObjectId(),
    loc: {
      coordinates: [ 
        21.7403209, 
        38.2470087
      ],
      type: "Point"
    },
    created: new Date(),
    updated: new Date(),
    name: "Σύλλογος Δήμος Πατρέων",
    phoneNumber: "6974044499",
    region: {
      administrative: "ΔΥΤΙΚΗΣ ΕΛΛΑΔΑΣ",
      municipality: "ΠΑΤΡΕΩΝ"
    },
    address: "Ρηγα Φεραίου 123, ΤΚ 26226",
    status: "accepted",
    __v: 0
  }
];

const names = [
  "Giorgos",
  "Dimitris",
  "Konstantinos",
  "Giannis",
  "Nikos",
  "Christos",
  "Panagiotis",
  "Thanos",
  "Michalis",
  "Thodoris",
  "Anastasis",
  "Spyros",
  "Antonis",
  "Andreas",
  "Apostolis",
  "Stavros",
  "Petros",
  "Stelios",
  "Thomas",
  "Stefanos",
  "Fotis",
  "Pavlos",
  "Leonidas",
  "Marios",
  "Stamatis",
  "Maria",
  "Eleni",
  "Katerina",
  "Georgia",
  "Sofia",
  "Anastasia",
  "Ioanna",
  "Dimitra",
  "Eirini",
  "Panagiota",
  "Christina",
  "Konstantina",
  "Anna",
  "Paraskevi",
  "Fotini",
  "Theodora",
  "Athina",
  "Olga",
  "Marina",
  "Antonia",
  "Margarita",
  "Pinelopi",
  "Antogoni",
  "Areti",
  "Elpida"
];

const surnames = [
  "Christou",
  "Apostolou",
  "Georgiou",
  "Grigoriou",
  "Athanasiou",
  "Oikonomou",
  "Papandreou",
  "Papaspirou",
  "Alexandrou",
  "Anagnostou",
  "Vassiliou",
  "Dimitriou",
  "Eleftheriou",
  "Theodosiou",
  "Konstantinou"
];

const disabilities = {
  mobility: [
    {
      "name": "Mobility",
      "sub": {
        "name": "Partial",
        "value": 1
      }
    },
    {
      "name": "Mobility",
      "sub": {
        "name": "PartialSupport",
        "value": 2
      }
    },
    {
      "name": "Mobility",
      "sub": {
        "name": "Immobility",
        "value": 3
      }
    }
  ],
  hearing: [
    {
      "name": "Hearing",
      "sub": {
        "name": "HardHearing",
        "value": 2
      }
    },
    {
      "name": "Hearing",
      "sub": {
        "name": "Deaf",
        "value": 3
      }
    }
  ],
  vision: [
    {
      "name": "Vision",
      "sub": {
        "name": "LowSight",
        "value": 1
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
      "name": "Vision",
      "sub": {
        "name": "Blind",
        "value": 3
      }
    }
  ],
  mental: [
    {
      "name": "Mental",
      "sub": {
        "name": "LimitedSupport",
        "value": 1
      }
    },
    {
      "name": "Mental",
      "sub": {
        "name": "ExtendedSupport",
        "value": 2
      }
    },
    {
      "name": "Mental",
      "sub": {
        "name": "DiffusedSupport",
        "value": 3
      }
    }
  ]
};

const status = ["accepted", "pending", "rejected"];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // Inclusive
};

const subtractFromDate = (min, max) => {
  let date = new Date();
  date.setDate(date.getDate() - getRandomInt(min, max));

  return date;
};

const loader = new Loader();

(async () => {
  try {
    await safeameaConn;

    loader.start("---Populating safeamea database");

    let newClub;
    let savedClubs = [];

    for (const club of clubs) {
      newClub = new Club(club);
      savedClubs.push(await newClub.save());
    }
    // console.log(JSON.stringify(savedClubs, null, 2));

    let name, surname, carename, caresurname, coords;
    let newAmea;
    let savedAmea = [];
    const center = { lat: 38.234809, lng: 21.748981 };
    const radius = 2000; // meters

    for (let i = 0; i < 1000; i++) {
      name = names[getRandomInt(0, 49)];
      surname = surnames[getRandomInt(0, 14)];
      carename = names[getRandomInt(0, 49)];
      caresurname = surnames[getRandomInt(0, 14)];
      coords = geo.getCoordsWithinRadius(center, radius);

      newAmea = new Amea({
        name,
        surname,
        owner: [new mongoose.Types.ObjectId()],
        email: {
          value: name.toLowerCase() + '.' + surname.toLowerCase() + '@example.com',
          active: getRandomInt(0, 1)
        },
        phoneNumber: {
          value: '69' + getRandomInt(11111111, 99999999),
          active: getRandomInt(0, 1)
        },
        loc: {
          coordinates: [
            coords.lat,
            coords.lng
          ],
          type: "Point"
        },
        address: "Address",
        region: {
          administrative: "Western Greece",
          municipality: "Patras"
        },
        disabilities: [
          disabilities.mobility[getRandomInt(0, 2)],
          disabilities.hearing[getRandomInt(0, 1)],
          disabilities.vision[getRandomInt(0, 2)],
          disabilities.mental[getRandomInt(0, 2)]
        ],
        disabilitiesDesc: "Disabilities description text",
        floor: getRandomInt(0, 6),
        club: [savedClubs[getRandomInt(0, 1)]._id],
        birthday: subtractFromDate(18*365, 100*365),
        created: subtractFromDate(1, 365),
        updated: subtractFromDate(0, 0),
        caretaker: {
          carename,
          caresurname,
          careemail: carename.toLowerCase() + '.' + caresurname.toLowerCase() + '@example.com',
          carephone: '69' + getRandomInt(11111111, 99999999),
          caredescription: "Caretaker description"
        },
        status: status[getRandomInt(0, 2)],
        __enc_surname: false,
        __v: 0
      });
      savedAmea.push(await newAmea.save());
    }
    // console.log(JSON.stringify(savedAmea, null, 2));

    loader.stop();
    console.log('\n---Done');
    process.exit();
  } catch (err) {
    loader.stop();
    console.log(err);
    process.exit();
  }
})();
