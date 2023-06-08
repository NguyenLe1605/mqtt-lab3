const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com");

const topic = "duichu";

const generateRandom = (min, max) => {
  // find diff
  let difference = max - min;

  // generate random number
  let rand = Math.random();

  // multiply with difference
  rand = Math.floor(rand * difference);

  // add with min value
  rand = rand + min;

  return rand;
};

client.on("connect", function () {
  setInterval(function () {
    const data = {
      temperature: generateRandom(20, 40),
      soil_humidity: generateRandom(30, 80),
      air_humidity: generateRandom(50, 90),
      luminosity: generateRandom(10, 60),
    };

    const payload = JSON.stringify(data);
    client.publish(topic, payload);
  }, 1000 * 10);
});
