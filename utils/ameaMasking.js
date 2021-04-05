'use strict';

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

const emailValueMask = {
  "email.value": "xxxxx@xxxxx.xxx"
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

const locCoordinatesMask = {
  "loc.coordinates": [
    { $round: [
      { $add: [
        { $arrayElemAt: ["$loc.coordinates", 0] },
        { $add: [
          { $multiply: [
            { $rand: {} },
            ( 0.0025 - 0.0015 )
          ]},
          0.0015
        ]}
      ]},
      7
    ]},
    { $round: [
      { $add: [
        { $arrayElemAt: ["$loc.coordinates", 1] },
        { $add: [
          { $multiply: [
            { $rand: {} },
            ( 0.0025 - 0.0015 )
          ]},
          0.0015
        ]}
      ]},
      7
    ]}
  ]
};

const disabilitiesDescMask = {
  "disabilitiesDesc": "xxxxxxxxxx"
};

const birthdayMask = {
  "birthday": { $subtract: [
    "$birthday",
    { $floor:
      { $add: [
        { $multiply: [
          { $rand: {} },
          ( 94670777900 - 31556926000 )
        ]},
        31556926000
      ]}
    }
  ]}
};

const createdMask = {
  "created": { $subtract: [
    "$created",
    { $floor:
      { $add: [
        { $multiply: [
          { $rand: {} },
          ( 94670777900 - 31556926000 )
        ]},
        31556926000
      ]}
    }
  ]}
};

const updatedMask = {
  "updated": { $subtract: [
    "$updated",
    { $floor:
      { $add: [
        { $multiply: [
          { $rand: {} },
          ( 94670777900 - 31556926000 )
        ]},
        31556926000
      ]}
    }
  ]}
};

const addressMask = {
  "address": "xxxxxxxxxx"
};

const careNameMask = {
  "caretaker.carename": { $substrCP: [ "$caretaker.carename", 0, 1 ] }
};

const careSurnameMask = {
  "caretaker.caresurname": { $substrCP: [ "$caretaker.caresurname", 0, 1 ] }
};

const careEmailMask = {
  "caretaker.careemail": "xxxxx@xxxxx.xxx"
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
  "caretaker.caredescription": "xxxxxxxxxx"
};

exports.buildPipeline = (policy) => {
  let pipeline = [];

  if (!policy) {
    pipeline = [
      { "$set": nameMask },
      { "$set": surnameMask },
      { "$set": emailValueMask },
      { "$set": phoneNumberValueMask },
      { "$set": locCoordinatesMask },
      { "$set": birthdayMask },
      { "$set": addressMask },
      { "$set": careNameMask },
      { "$set": careSurnameMask },
      { "$set": careEmailMask },
      { "$set": carePhoneMask },
      { "$set": careDescriptionMask },
      { "$unset": ["owner", "updated", "created", "_id", "disabilitiesDesc",
        "caretaker.caredescription", "__enc_surname", "__v"]
      }
    ];

    return pipeline;
  }

  if (policy.excluded.length !== 0) {
    pipeline.push({ "$unset": policy.excluded });
  }

  policy.masked.forEach(maskedField => {
    switch (maskedField) {
      case "name":
        pipeline.push({ "$set": nameMask });
        break;
      case "surname":
        pipeline.push({ "$set": surnameMask });
        break;
      case "email.value":
        pipeline.push({ "$set": emailValueMask });
        break;
      case "phoneNumber.value":
        pipeline.push({ "$set": phoneNumberValueMask });
        break;
      case "loc.coordinates":
        pipeline.push({ "$set": locCoordinatesMask });
        break;
      case "disabilitiesDesc":
        pipeline.push({ "$set": disabilitiesDescMask });
        break
      case "birthday":
        pipeline.push({ "$set": birthdayMask });
        break;
      case "created":
        pipeline.push({ "$set": createdMask });
        break;
      case "updated":
        pipeline.push({ "$set": updatedMask });
        break;
      case "address":
        pipeline.push({ "$set": addressMask });
        break;
      case "caretaker.carename":
        pipeline.push({ "$set": careNameMask });
        break;
      case "caretaker.caresurname":
        pipeline.push({ "$set": careSurnameMask });
        break;
      case "caretaker.careemail":
        pipeline.push({ "$set": careEmailMask });
        break;
      case "caretaker.carephone":
        pipeline.push({ "$set": carePhoneMask });
        break;
      case "caretaker.caredescription":
        pipeline.push({ "$set": careDescriptionMask });
        break;
      default:
        break;
    }
  });

  return pipeline;
};
