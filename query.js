const { Client } = require("pg");
const credentials = {
  user: "postgres",
  host: "localhost",
  database: "farm",
  password: "postgres",
  port: 5432,
};

const client = new Client(credentials);

const table = "sensor";

const queryAgg = async () => {
  try {
    const temp_string = "AVG(temperature) as avg_temp";
    const soil_hum_string = "AVG(soil_humidity) avg_soil_hum";
    const lum_str = "AVG(luminosity) as avg_lum";
    const air_hum_str = "AVG(air_humidity) as avg_air_hum";
    const query =
      `SELECT ${temp_string}, ${soil_hum_string}, ${lum_str}, ${air_hum_str} FROM ` +
      table;
    await client.connect();
    const res = await client.query(query);
    console.log(res.rows);
  } catch (error) {
    console.log(error);
  } finally {
    await client.end();
  }
};

queryAgg();
