
const { ipcRenderer } = require("electron");

// Serial Port
const { SerialPort } = require('serialport')
var sp = null;


// Initialize variables
var response = "Large Language Object";
var w = 550;
var h = 900;  

// GPT Connection via OpenAI NodeJS
//////////////////////////////////////////////////////////////////
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


let prompt = "Play a scenario-based situation puzzle game around the theme of misinformation with me. The actors in the game may include- the local police, local journalists, witnesses, international news agencies, local and national politicians, different communities, etc. Parts of the situation may be true, false, out of context, or half true. If the situation is false or half true, one or many actors have created the false news knowingly or unknowingly. There is a correct answer to the game that you know, but keep the answer a secret until I make the right guess. I am a citizen fact checker and need to find out what happened. I have tools and ways to investigate i.e., interview the actors, check the WhatsApp messages of the actor, reverse image search the news, call local authorities, and find out who else is involved. List all the options that I can choose to investigate the scenario and ask me which options I want to choose for the next step.";
let res_json;
let messages = [];

let caption;
let captionprompt;

let img;
let res_img;
var imgurl = "https://d27jswm5an3efw.cloudfront.net/app/uploads/2019/07/insert-image-html.jpg";

async function getAnswer() {
    //Chat
    messages.push({role: "user", content: prompt});
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        messages
      });
      res_json  = completion.data.choices[0].message;
      messages.push(res_json);

      response = completion.data.choices[0].message.content;
      console.log(response);

    //Generate a caption
    let segments = response.split("\n\n");
    let seg = segments[0].split(": ");
    console.log(seg[1]); //
    captionprompt = "'" + seg[1] + "'Describe the paragraph above as if it is a drawing."
    const description = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        messages:[{role: "user", content: captionprompt}]
      });

      caption = description.data.choices[0].message.content;
      console.log(caption);

    //Create an image
    const image = await openai.createImage({
        prompt: caption,
        n: 2,
        size: "1024x1024",
      });
      res_img = image.data;
      console.log(res_img.data[0].url);
      imgurl = res_img.data[0].url;
}



// SERIAL PORT
//////////////////////////////////////////////////////////////////
// https://serialport.io/docs/guide-usage

// to list serial port, use these commands in terminal:
// ls /dev/tty.*
// ls /dev/cu.*

//"model":"gpt-3.5-turbo-0301",

sp = new SerialPort({ path: '/dev/tty.usbmodem14201', baudRate: 115200 });
sp.open(function (err) {
    if (err) {
        return console.log(err.message)
    }
})

// The open event is always emitted
sp.on('open', function () {
    // open logic
    console.log("Serial Port Opened");
})


// Write data to serial port 
function sendToArduino(data) {
    sp.write(data);
}


// Read data from serial port
sp.on('data', function (data) {
    console.log(data[0])    // print data to console
    response = data[0];     // write it to response so we can show on canvas

})




// MAIN APP
//////////////////////////////////////////////////////////////////
function setup() {
    createCanvas(w, h);
}


function draw() {
    background(255);
    textSize(12);
    fill(0, 0, 0);
    text(response, 0, 0.52*w, 0.6*w, 0.9*h);

    img = createImg(imgurl, 'illustration');
    img.size(270, 270);
    img.position(0.4*w, 0.05*w);
}


// KEYBOARD INPUT
//////////////////////////////////////////////////////////////////
function keyPressed() {

    if (key == 'A' || key == 'a') {
        getAnswer();
    }
    else if(key == 'I' || key == 'i'){
        getImg();
    }
    else if(key == '1'){
        prompt = "I would like to choose option 1.";
        if(messages.length==2){
            prompt = "Every time I respond, a day has passed, and a new update has taken place. For example, a riot has broken out; an international news agency has covered the event; a politician has been elected; a person has been killed, etc. The updates you give me should raise the suspense and tension. Then when I respond, answer with yes or no, why, and give me the update that has happened over the day. I have 7 days to find out the right answer."+prompt +"Tell me the update on day 1 in a news format and ask me for my choice for the next day."
        }
        getAnswer();
    }
    else if(key == '2'){
        prompt = "I would like to choose option 2.";
        if(messages.length==2){
            prompt = "Every time I respond, a day has passed, and a new update has taken place. For example, a riot has broken out; an international news agency has covered the event; a politician has been elected; a person has been killed, etc. The updates you give me should raise the suspense and tension. Then when I respond, answer with yes or no, why, and give me the update that has happened over the day. I have 7 days to find out the right answer."+prompt +"Tell me the update on day 1 in a news format and ask me for my choice for the next day."
        }
        getAnswer();
    }
    else if(key == '3'){
        prompt = "I would like to choose option 3.";
        if(messages.length==2){
            prompt = "Every time I respond, a day has passed, and a new update has taken place. For example, a riot has broken out; an international news agency has covered the event; a politician has been elected; a person has been killed, etc. The updates you give me should raise the suspense and tension. Then when I respond, answer with yes or no, why, and give me the update that has happened over the day. I have 7 days to find out the right answer."+prompt +"Tell me the update on day 1 in a news format and ask me for my choice for the next day."
        }
        getAnswer();
    }
    else if(key == '4'){
        prompt = "I would like to choose option 4.";
        if(messages.length==2){
            prompt = "Every time I respond, a day has passed, and a new update has taken place. For example, a riot has broken out; an international news agency has covered the event; a politician has been elected; a person has been killed, etc. The updates you give me should raise the suspense and tension. Then when I respond, answer with yes or no, why, and give me the update that has happened over the day. I have 7 days to find out the right answer."+prompt +"Tell me the update on day 1 in a news format and ask me for my choice for the next day."
        }
        getAnswer();
    }
    else if(key == '5'){
        prompt = "I would like to choose option 5.";
        if(messages.length==2){
            prompt = "Every time I respond, a day has passed, and a new update has taken place. For example, a riot has broken out; an international news agency has covered the event; a politician has been elected; a person has been killed, etc. The updates you give me should raise the suspense and tension. Then when I respond, answer with yes or no, why, and give me the update that has happened over the day. I have 7 days to find out the right answer."+prompt +"Tell me the update on day 1 in a news format and ask me for my choice for the next day."
        }
        getAnswer();
    }
    else if(key == '6'){
        prompt = "I would like to choose option 6.";
        if(messages.length==2){
            prompt = "Every time I respond, a day has passed, and a new update has taken place. For example, a riot has broken out; an international news agency has covered the event; a politician has been elected; a person has been killed, etc. The updates you give me should raise the suspense and tension. Then when I respond, answer with yes or no, why, and give me the update that has happened over the day. I have 7 days to find out the right answer."+prompt +"Tell me the update on day 1 in a news format and ask me for my choice for the next day."
        }
        getAnswer();
    }
    else if(key == '7'){
        prompt = "I would like to choose option 7.";
        if(messages.length==2){
            prompt = "Every time I respond, a day has passed, and a new update has taken place. For example, a riot has broken out; an international news agency has covered the event; a politician has been elected; a person has been killed, etc. The updates you give me should raise the suspense and tension. Then when I respond, answer with yes or no, why, and give me the update that has happened over the day. I have 7 days to find out the right answer."+prompt +"Tell me the update on day 1 in a news format and ask me for my choice for the next day."
        }
        getAnswer();
    }
    else if(key == '8'){
        prompt = "I would like to choose option 8.";
        if(messages.length==2){
            prompt = "Every time I respond, a day has passed, and a new update has taken place. For example, a riot has broken out; an international news agency has covered the event; a politician has been elected; a person has been killed, etc. The updates you give me should raise the suspense and tension. Then when I respond, answer with yes or no, why, and give me the update that has happened over the day. I have 7 days to find out the right answer."+prompt +"Tell me the update on day 1 in a news format and ask me for my choice for the next day."
        }
        getAnswer();
    }
}


