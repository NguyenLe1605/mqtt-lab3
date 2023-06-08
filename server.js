const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com");
const { Client } = require("pg");
const credentials = {
  user: "postgres",
  host: "localhost",
  database: "farm",
  password: "postgres",
  port: 5432,
};

const topic = "duichu";

const connectDb = async () => {
  try {
    await dbClient.connect();
  } catch (err) {
    console.log(err);
  }
};

client.on("connect", function () {
  client.subscribe(topic);
});

const checkThreshold = (temperature, soil_humidity, luminosity) => {
  console.log("<--Action-->");

  if (temperature < 27) {
    console.log("Turn off the fan");
  } else if (temperature > 30) {
    console.log("Turn on the fan");
  }

  if (soil_humidity < 50) {
    console.log("Turn on the water pump");
  } else if (soil_humidity > 60) {
    console.log("Turn off the water pump");
  }

  if (luminosity > 30) {
    console.log("Turn off the light");
  }

  console.log("-----------------");
};

client.on("message", async function (topic, msg) {
  const data = JSON.parse(msg.toString());
  console.log("<--data-->");
  console.log(data);

  const { temperature, soil_humidity, luminosity, air_humidity } = data;
  checkThreshold(temperature, soil_humidity, luminosity);
  const now = new Date().toISOString();
  await insertSensor(now, temperature, luminosity, air_humidity, soil_humidity);
});

const insertSensor = async (
  timestamp,
  temperature,
  luminosity,
  airHumidity,
  soilHumidity
) => {
  const dbClient = new Client(credentials);
  try {
    await dbClient.connect();
    await dbClient.query(
      "INSERT INTO sensor (timestamp, temperature, luminosity, air_humidity, soil_humidity) VALUES ($1, $2, $3, $4, $5)",
      [timestamp, temperature, luminosity, airHumidity, soilHumidity]
    ); // sends queries
  } catch (error) {
    console.error(error.stack);
  } finally {
    await dbClient.end(); // closes connection
  }
};
