const fpPromise = import("https://fpjscdn.net/v3/W4X6mMlsrLJumj10Q1fA")
	.then(FingerprintJS => FingerprintJS.load({
		region: "eu"
	}));

fpPromise
	.then(fp => fp.get())
	.then(result => {
		const clientID = result.visitorId;
		client(clientID);
		console.log(clientID)
	});

function client(clientID) {

	let socket = io();

  let connected = false;

  function refreshConnectedDisplay() {
    document.getElementById("connected").innerHTML = "Connected: " + connected;
    if(connected == true) {
      submit.addEventListener("click", onSubmit);
    }
    else {
      submit.removeEventListener("click", onSubmit);
    }
  }
  
	function sendc2sPacket(packet, packet_data) {
    try {
    	socket.emit('c2s', { "packet": packet, "packet_data": packet_data, "clientID": clientID });
      console.log(packet);
      console.log(packet_data);
    } catch(err) {
      connected = false;
      refreshConnectedDisplay();
    }
	}
  
	socket.on('s2c', function(msg) {
		let packet = msg.packet;
		let packet_data = msg.packet_data;

    if(packet == "sConnect_Packet") {
      sendc2sPacket("cSendClientID_Packet", "N/A");
    }
    
    if(connected == false && packet == "sServerAcceptedcSendClientID_Packet") {
      connected = true;
      refreshConnectedDisplay();
    }
    
    if (packet == "sResponsecRequestURL_Packet") {
			// window.location.href = "/" + packet_data;
      let DATA = "";
      fetch(window.location.href + "/" + packet_data)
  .then(data => DATA = data);
      console.log(DATA);
			document.querySelector('html').html = DATA;
		}

		console.log(packet);
		console.log(packet_data);
	});

	let submit = document.getElementById("submit");

	function onSubmit() {
		let url = document.getElementById("url").value;
		console.log(url);
		sendc2sPacket("cRequestURL_Packet", url);
	}

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function ping() {
    await(sleep(5000));
    socket.emit('cping',"N/A");
    if(socket.connected == false) {
      connected = false;
      refreshConnectedDisplay();
    }
    ping();
  }
  ping();

}