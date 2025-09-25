import fs from "fs";
import parsePhoneNumber from "libphonenumber-js/max";

// Lee el archivo JSON de forma sincrónica
const phonesJson = fs.readFileSync("phones_final.json", "utf8");
const phonesData = JSON.parse(phonesJson);

// Datos de prueba
const phoneNumber = "811000";
let country = "Argentina";
const location = "";

//Si no trae country, usar location (Mailerlite)
if (!country && location) {
  country = location;
}

// Buscar el país en el JSON
const matchingCountry = phonesData.find(
  (countryData) =>
    countryData.countryEn === country ||
    countryData.countrySpa === country ||
    countryData.iso === country
);

// Obtener el código ISO del país
let countryIso = "";
if (matchingCountry) {
  countryIso = matchingCountry.iso;
} else {
  console.log(`Country not found: ${country}`);
}

// Procesar el número de teléfono
if (countryIso) {
  const parsedNumber = parsePhoneNumber(phoneNumber, countryIso);

  if (parsedNumber && parsedNumber.isValid()) {
    // Formatear el número en formato internacional
    let formattedNumber = parsedNumber.formatInternational();

    // Eliminar espacios en blanco
    formattedNumber = formattedNumber.replace(/\s+/g, "");

    // Agregar el prefijo de Whatsapp para Argentina y México si no está presente
    if (
      countryIso === "AR" &&
      formattedNumber.startsWith("+54") &&
      !formattedNumber.startsWith("+549")
    ) {
      formattedNumber = formattedNumber.replace("+54", "+549");
    } else if (
      countryIso === "MX" &&
      formattedNumber.startsWith("+52") &&
      !formattedNumber.startsWith("+521")
    ) {
      formattedNumber = formattedNumber.replace("+52", "+521");
    }

    console.log("Número formateado: ", formattedNumber);
  } else {
    console.log("Número inválido");
  }
} else {
  console.log(
    "No se pudo procesar el número debido a la falta de código ISO del país."
  );
}
