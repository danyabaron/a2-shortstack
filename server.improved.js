const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000;

var appdata = [
  {
    Name: "go grocery shopping",
    Priority: "medium",
    Deadline: "Thursday"
  },
  {
    Name: "finish math homework",
    Priority: "high",
    Deadline: "Wednesday"
  }
];

const server = http.createServer(function(request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function(request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/scripts.js") {
    sendFile(response, "public/js/scripts.js");
  } else if (request.url === "/style.css") {
    sendFile(response, "public/css/style.css");
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function(request, response) {
  
  let dataString = '';

  request.on("data", function(data) {
    dataString += data;
    
  
  });

  request.on("end", function() {
  
    var jsonData = JSON.parse(dataString);
    
    console.log(jsonData)

    
    let action = jsonData.action;
    
    if (action.includes("add")) {
      let name = jsonData.taskname;
      let prior = jsonData.taskpriority;
      let deadline = jsonData.taskdeadline;
      let entries = {};
      entries["Name"] = name;
      entries["Priority"] = prior;
      entries["Deadline"] = deadline;
   
      appdata.push(entries);
    }

    
    if (action.includes("edit")) {
      let name = jsonData.taskname;
      let prior = jsonData.taskpriority;
      let deadline = jsonData.taskdeadline;
      let newEntries = {};
      newEntries["Name"] = name;
      newEntries["Priority"] = prior;
      newEntries["Deadline"] = deadline;
    
      appdata(newEntries).push(newEntries);
    }

    
    if (action.includes("delete")) {
      let name = jsonData.taskname;
      let prior = jsonData.taskpriority;
      let deadline = jsonData.taskdeadline;
      let entries = {};
      entries["Name"] = name;
      entries["Priority"] = prior;
      entries["Deadline"] = deadline;
      
      appdata.splice(entries);
    }

    
    var sendingJSON = [];
    for (let newEntry in appdata) {
      sendingJSON.push(appdata[newEntry]);
    }

    console.log(sendingJSON);
  });

  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end(JSON.stringify(appdata));
};

const sendFile = function(response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function(err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
