const { firstNameMiddleNameLengthValidator } = require("./fieldsHelper");
const { passportLengthValidator } = require("./fieldsHelper");
const { expiryDateValidator } = require("./fieldsHelper");
const { surnameLengthValidator } = require("./fieldsHelper");

const firstNameMiddleNameLengthValidatorObj = {
  fn: firstNameMiddleNameLengthValidator,
  arguments: [30, "firstName", "middleNames"]
};

const passportLengthValidatorObj = {
  fn: passportLengthValidator,
  arguments: [9, "passportNumber"]
};

const expiryDateValidatorObj = {
  fn: expiryDateValidator,
  arguments: [18, "expiryDate"]
};

const surnameLengthValidatorObj = {
  fn: surnameLengthValidator,
  arguments: [30, "surname"]
};

module.exports = {
  firstNameMiddleNameLengthValidator: firstNameMiddleNameLengthValidator,
  surnameLengthValidator: surnameLengthValidator,
  passportLengthValidator: passportLengthValidator,
  passportNumber: {
    type: "text",
    journeyKey: "passportNumber",
    validate: [
      "required",
      "numeric",
      { type: "limit", fn: (value) => !value.startsWith("9") },
      {
        type: "passportLength",
        ...passportLengthValidatorObj
      }
    ],
    classes: "govuk-input--width-10"
  },
  surname: {
    type: "text",
    validate: [
      "required",
      {
        type: "surnameLength",
        ...surnameLengthValidatorObj
      },
      { type: "regexpassport", fn: (value) => value.match(/^[a-zA-Z .'-]*$/) }
    ],
    journeyKey: "surname"
  },
  firstName: {
    type: "text",
    validate: [
      "required",
      { type: "regexpassport", fn: (value) => value.match(/^[a-zA-Z .'-]*$/) },
      {
        type: "firstNameMiddleNameLength",
        ...firstNameMiddleNameLengthValidatorObj
      }
    ],
    journeyKey: "firstName"
  },
  middleNames: {
    type: "text",
    journeyKey: "middleNames",
    validate: [
      { type: "regexpassport", fn: (value) => value.match(/^[a-zA-Z .'-]*$/) },
      {
        type: "firstNameMiddleNameLength",
        ...firstNameMiddleNameLengthValidatorObj
      }
    ]
  },
  dateOfBirth: {
    type: "date",
    journeyKey: "dateOfBirth",
    validate: [
      "required",
      "date",
      { type: "before", arguments: [new Date().toISOString().split("T")[0]] }
    ],
    autocomplete: "bday"
  },
  expiryDate: {
    type: "date",
    journeyKey: "expiryDate",
    validate: [
      "required",
      "date",
      { type: "date" },
      {
        type: "expiryDate",
        ...expiryDateValidatorObj
      }
    ],
    autocomplete: "expiryDate"
  }
};
