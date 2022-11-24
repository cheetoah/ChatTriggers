/// <reference types="../CTAutocomplete" />


const ProcessBuilder = Java.type("java.lang.ProcessBuilder")
const Scanner = Java.type("java.util.Scanner")


// Yoinked from soopyboo32's soopyv2 lol

let spotifyPID = -1

function updateSpotify() {

    current_track.name = "&cNot open"

    if (spotifyPID !== -1) {
        let pid = spotifyPID

        let process = new ProcessBuilder("tasklist.exe", "/FO", "csv", "/V", "/FI", "\"PID eq " + pid + "\"").start();
        let sc = new Scanner(process.getInputStream());
            if (sc.hasNextLine()) sc.nextLine();
            while (sc.hasNextLine()) {
                let line = sc.nextLine();
                let parts = line.replace("\"", "").split("\",\"");
                let song = parts[parts.length - 1].substr(0, parts[parts.length - 1].length - 1)
                if (song === "N/A") continue

                if (song === "Spotify Free" || song === "Spotify Premium" || song === "AngleHiddenWindow") {
                    current_track.name = "&cPaused"
                } else {
                    if (song === "Spotify") {
                        song = "Advertisement"
                        current_track.name = "&cADvertisement"
                    } else {
                        current_track.name = song.replace(/&/g, "&⭍").split("-")[1]
                        current_track.artists = song.replace(/&/g, "&⭍").split("-")[0]
                    }
                }

            }
            process.waitFor();


            current_track.name != undefined? current_track.name = current_track.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : null
        }

        if (current_track.name !== "&cNot open") return

        spotifyPID = -1
        let spotifyProcesses = []
        let process = new ProcessBuilder("tasklist.exe", "/fo", "csv", "/nh").start();
        let sc = new Scanner(process.getInputStream());
        if (sc.hasNextLine()) sc.nextLine();
        while (sc.hasNextLine()) {
            let line = sc.nextLine();
            let parts = line.replace("\"", "").split("\",\"");
            let unq = parts[0]
            let pid = parts[1]
            if (unq === "Spotify.exe") {
                spotifyProcesses.push(pid)
                // console.log(parts.join(" "));
            }
        }
        process.waitFor();

        while (spotifyProcesses.length > 0) {
            let pid = spotifyProcesses.pop()
            // console.log("Loading pid " + pid)
            let process = new ProcessBuilder("tasklist.exe", "/FO", "csv", "/V", "/FI", "\"PID eq " + pid + "\"").start();
            let sc = new Scanner(process.getInputStream());
            if (sc.hasNextLine()) sc.nextLine();
            while (sc.hasNextLine()) {
                let line = sc.nextLine();
                let parts = line.replace("\"", "").split("\",\"");
                let song = parts[parts.length - 1].substr(0, parts[parts.length - 1].length - 1)
                if (song === "N/A") continue

                spotifyPID = pid

                if (song === "Spotify Free" || song === "Spotify Premium" || song === "AngleHiddenWindow") {
                    current_track.name = "&cPaused"
                } else {
                    if (song === "Spotify") {
                        song = "Advertisement"
                        current_track.name = "&cADvertisement"
                    } else {
                        current_track.name = song.replace(/&/g, "&⭍").split("-")[1]
                        current_track.artists = song.replace(/&/g, "&⭍").split("-")[0]
                    }
                    
                }

            }
            process.waitFor();
        }
        
        current_track.name != undefined? current_track.name = current_track.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : null
        
            
}
 


let current_track = {
    "name": "",
    "artists": ""
}


function drawRichString(string, x, y, scale){
    Renderer.translate(x, y)
    Renderer.scale(scale)
    Renderer.drawString(string, 0, 0)
}

register("step", () => {
   updateSpotify()
    
}).setDelay(2)

let settings = {
    "x": 0,
    "y": 0
}

register("renderOverlay", () => {
    
    Renderer.drawRect(Renderer.color(15, 15, 15, 155), settings.x, settings.y, 200, 35)
    Renderer.drawRect(Renderer.color(30, 215, 96), settings.x, settings.y, 1, 35)
    Renderer.drawString(current_track.name != undefined? current_track.name.trim() : "&cAdvertisement", 10, settings.y + 9)
    
    drawRichString(`&7${current_track.artists.trim()}`,10,  settings.y + 20, 0.85)

})

