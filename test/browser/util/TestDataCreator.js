const PassportSubject = require("../model/PassportSubject.js");

exports.getPassportTestUserFromMap = function (passportSubjectScenario) {
  let primaryPassport = new PassportSubject();
  let incorrectPassport = new PassportSubject();

  primaryPassport.fill({
    passportNumber: "321654987",
    birthDay: "08",
    birthMonth: "07",
    birthYear: "1965",
    middleNames: "",
    lastName: "DECERQUEIRA",
    firstName: "KENNETH",
    passportValidToDay: "01",
    passportValidToMonth: "10",
    passportValidToYear: "2042"
  });

  incorrectPassport.fill({
    passportNumber: "017293846",
    birthDay: "08",
    birthMonth: "07",
    birthYear: "1965",
    middleNames: "",
    lastName: "DECERQUEIRA",
    firstName: "KENNETH",
    passportValidToDay: "01",
    passportValidToMonth: "10",
    passportValidToYear: "2042"
  });

  if (passportSubjectScenario === "PassportSubjectHappyKenneth") {
    return primaryPassport;
  }

  if (
    passportSubjectScenario === "PassportSubjectIncorrectPassportNumberKenneth"
  ) {
    return incorrectPassport;
  }
};
