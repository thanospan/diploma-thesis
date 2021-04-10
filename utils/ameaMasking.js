'use strict';

const idMask = {
  "_id": "xxxxxx"
};

const nameMask = {
  "name": {
    $substrCP: [ "$name", 0, 1 ]
  }
};

const surnameMask = {
  "surname": {
    $substrCP: [ "$surname", 0, 1 ]
  }
};

const ownerMask = {
  "owner": {
    $map: {
      input: "$owner",
      as: "owner",
      in: {
        $concat: [ "xxxxxx" ]
      }
    }
  }
};

const emailValueMask = {
  "email.value": {
    $concat: [
      "xxxxxx@",
      { $arrayElemAt: [
        { $split: [ "$email.value", "@" ] },
        1
      ]}
    ]
  }
};

const emailActiveMask = {
  "email.active": "xxxxxx"
};

const emailMask = {
  "email.value": emailValueMask["email.value"],
  "email.active": emailActiveMask["email.active"]
};

const phoneNumberValueMask = {
  "phoneNumber.value": {
    $concat: [
      { $substrCP: [ "$phoneNumber.value", 0, 2 ] },
      "xxxxxxxx",
      { $substrCP: [
        "$phoneNumber.value",
        { $subtract: [{ $strLenCP: "$phoneNumber.value" }, 2] },
        { $strLenCP: "$phoneNumber.value" }
      ]}
    ]
  }
};

const phoneNumberActiveMask = {
  "phoneNumber.active": "xxxxxx"
};

const phoneNumberMask = {
  "phoneNumber.value": phoneNumberValueMask["phoneNumber.value"],
  "phoneNumber.active": phoneNumberActiveMask["phoneNumber.active"],
};

const locTypeMask = {
  "loc.type": "xxxxxx"
};

/*
Loc Coordinates Mask
Add a random number within a specific range to each coordinate
rand * (max - min) + min
min: 0.0015
max: 0.0025
rand: random float between 0 and 1
Round to 7 decimal places
*/
const locCoordinatesMask = {
  "loc.coordinates": {
    $map: {
      input: "$loc.coordinates",
      as: "coord",
      in: {
        $round: [
          { $add: [
            "$$coord",
            { $add: [
              { $multiply: [
                { $rand: {} },
                ( 0.0025 - 0.0015 )
              ]},
              0.0015
            ]}
          ]},
          7
        ]
      }
    }
  }
};

const locMask = {
  "loc.type": locTypeMask["loc.type"],
  "loc.coordinates": locCoordinatesMask["loc.coordinates"]
};

const regionAdministrativeMask = {
  "region.administrative": "xxxxxx"
};

const regionMunicipalityMask = {
  "region.municipality": "xxxxxx"
};

const regionMask = {
  "region.administrative": regionAdministrativeMask["region.administrative"],
  "region.municipality": regionMunicipalityMask["region.municipality"]
};

const disabilitiesMask = {
  "disabilities.name": "xxxxxx",
  "disabilities.sub.name": "xxxxxx",
  "disabilities.sub.value": "xxxxxx"
};

const disabilitiesDescMask = {
  "disabilitiesDesc": "xxxxxx"
};

/*
Floor Mask
Random integer within a specific range
floor(rand * (max - min + 1) + min)
min: 0
max: 8
rand: random float between 0 and 1
*/
const floorMask = {
  "floor": {
    $floor: {
      $add: [
        { $multiply: [
          { $rand: {} },
          8 - 0 + 1
        ]},
        0
      ]
    }
  }
};

/*
Birthday Mask
Subtract a random integer (milliseconds) within a specific range
floor(rand * (max - min) + min)
min: 1*365*24*60*60*1000 (1 year)
max: 3*365*24*60*60*1000 (3 years)
rand: random float between 0 and 1
*/
const birthdayMask = {
  "birthday": {
    $subtract: [
      "$birthday",
      { $floor:
        { $add: [
          { $multiply: [
            { $rand: {} },
            ( 3*365*24*60*60*1000 - 1*365*24*60*60*1000 )
          ]},
          1*365*24*60*60*1000
        ]}
      }
    ]
  }
};

/*
Created Mask
Subtract a random integer (milliseconds) within a specific range
floor(rand * (max - min) + min)
min: 0.5*365*24*60*60*1000 (0.5 year)
max: 1*365*24*60*60*1000 (1 years)
rand: random float between 0 and 1
*/
const createdMask = {
  "created": {
    $subtract: [
      "$created",
      { $floor:
        { $add: [
          { $multiply: [
            { $rand: {} },
            ( 1*365*24*60*60*1000 - 0.5*365*24*60*60*1000 )
          ]},
          0.5*365*24*60*60*1000
        ]}
      }
    ]
  }
};

/*
Updated Mask
Subtract a random integer (milliseconds) within a specific range
floor(rand * (max - min) + min)
min: 0.5*365*24*60*60*1000 (0.5 year)
max: 1*365*24*60*60*1000 (1 years)
rand: random float between 0 and 1
*/
const updatedMask = {
  "updated": {
    $subtract: [
      "$updated",
      { $floor:
        { $add: [
          { $multiply: [
            { $rand: {} },
            ( 1*365*24*60*60*1000 - 0.5*365*24*60*60*1000 )
          ]},
          0.5*365*24*60*60*1000
        ]}
      }
    ]
  }
};

const addressMask = {
  "address": "xxxxxx"
};

const careNameMask = {
  "caretaker.carename": { $substrCP: [ "$caretaker.carename", 0, 1 ] }
};

const careSurnameMask = {
  "caretaker.caresurname": { $substrCP: [ "$caretaker.caresurname", 0, 1 ] }
};

const careEmailMask = {
  "caretaker.careemail": {
    $concat: [
      "xxxxxx@",
      { $arrayElemAt: [
        { $split: [ "$caretaker.careemail", "@" ] },
        1
      ]}
    ]
  }
};

const carePhoneMask = {
  "caretaker.carephone": {
    $concat: [
      { $substrCP: [ "$caretaker.carephone", 0, 2 ] },
      "xxxxxxxx",
      { $substrCP: [
        "$caretaker.carephone",
        { $subtract: [{ $strLenCP: "$caretaker.carephone" }, 2] },
        { $strLenCP: "$caretaker.carephone" }
      ]}
    ]
  }
};

const careDescriptionMask = {
  "caretaker.caredescription": "xxxxxx"
};

const caretakerMask = {
  "caretaker.carename": careNameMask["caretaker.carename"],
  "caretaker.caresurname": careSurnameMask["caretaker.caresurname"],
  "caretaker.careemail": careEmailMask["caretaker.careemail"],
  "caretaker.carephone": carePhoneMask["caretaker.carephone"],
  "caretaker.caredescription": careDescriptionMask["caretaker.caredescription"]
};

const statusMask = {
  "status": "xxxxxx"
};

exports.buildPipeline = (policy) => {
  let pipeline = [];

  if (!policy) {
    pipeline = [
      { $set: nameMask },
      { $set: surnameMask },
      { $set: emailValueMask },
      { $set: phoneNumberValueMask },
      { $set: locCoordinatesMask },
      { $set: birthdayMask },
      { $set: addressMask },
      { $set: careNameMask },
      { $set: careSurnameMask },
      { $set: careEmailMask },
      { $set: carePhoneMask },
      { $unset: ["owner", "updated", "created", "_id", "disabilitiesDesc",
        "caretaker.caredescription", "__enc_surname", "__v"]
      }
    ];

    return pipeline;
  }

  policy.masked.forEach(maskedField => {
    switch (maskedField) {
      case "_id":
        pipeline.push({ $set: idMask });
        break;
      case "name":
        pipeline.push({ $set: nameMask });
        break;
      case "surname":
        pipeline.push({ $set: surnameMask });
        break;
      case "owner":
        pipeline.push({ $set: ownerMask });
        break;
      case "email":
        pipeline.push({ $set: emailMask });
        break;
      case "email.value":
        pipeline.push({ $set: emailValueMask });
        break;
      case "email.active":
        pipeline.push({ $set: emailActiveMask });
        break;
      case "phoneNumber":
        pipeline.push({ $set: phoneNumberMask });
        break;
      case "phoneNumber.value":
        pipeline.push({ $set: phoneNumberValueMask });
        break;
      case "phoneNumber.active":
        pipeline.push({ $set: phoneNumberActiveMask });
        break;
      case "loc":
        pipeline.push({ $set: locMask });
        break;
      case "loc.type":
        pipeline.push({ $set: locTypeMask });
        break;
      case "loc.coordinates":
        pipeline.push({ $set: locCoordinatesMask });
        break;
      case "region":
        pipeline.push({ $set: regionMask });
        break;
      case "region.administrative":
        pipeline.push({ $set: regionAdministrativeMask });
        break;
      case "region.municipality":
        pipeline.push({ $set: regionMunicipalityMask });
        break;
      case "disabilities":
        pipeline.push({ $set: disabilitiesMask });
        break;
      case "disabilitiesDesc":
        pipeline.push({ $set: disabilitiesDescMask });
        break;
      case "floor":
        pipeline.push({ $set: floorMask });
        break;
      case "birthday":
        pipeline.push({ $set: birthdayMask });
        break;
      case "created":
        pipeline.push({ $set: createdMask });
        break;
      case "updated":
        pipeline.push({ $set: updatedMask });
        break;
      case "address":
        pipeline.push({ $set: addressMask });
        break;
      case "caretaker":
        pipeline.push({ $set: caretakerMask });
        break;
      case "caretaker.carename":
        pipeline.push({ $set: careNameMask });
        break;
      case "caretaker.caresurname":
        pipeline.push({ $set: careSurnameMask });
        break;
      case "caretaker.careemail":
        pipeline.push({ $set: careEmailMask });
        break;
      case "caretaker.carephone":
        pipeline.push({ $set: carePhoneMask });
        break;
      case "caretaker.caredescription":
        pipeline.push({ $set: careDescriptionMask });
        break;
      case "status":
        pipeline.push({ $set: statusMask });
        break;
      default:
        break;
    }
  });

  if (policy.excluded.length !== 0) {
    pipeline.push({ $unset: policy.excluded });
  }

  return pipeline;
};
