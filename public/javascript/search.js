var userSearch = "";
var songsObj = [];
var songs = "";
var playlist_name = "";

const search = function (event) {
  event.preventDefault();
  userSearch = document.getElementById("search").value;

  fetch("/api/playlists/search", {
    method: "POST",
    body: JSON.stringify({
      userSearch,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      var count = 1;
      songsObj = data;
      var songCard = document.getElementById("song-card");
      songCard.innerHTML = "";
      return data.forEach((element) => {
        var songList = document.createElement("h5");
        songList.setAttribute("id", `song${count}`);
        songList.setAttribute("onclick", `getInfo(this)`);
        songList.innerHTML +=
          count + ". " + element.name + " - " + element.song;
        count++;
        var songCard = document.getElementById("song-card");
        songCard.appendChild(songList);
      });
    });
};

function getInfo(data) {
  var id = data.id.split("song")[1] - 1;
  data.setAttribute("hidden", "");
  songs += songsObj[id].name + " " + songsObj[id].song + ", ";
}

async function done(event) {
  event.preventDefault();
  playlist_name = document.getElementById("playlist-name").value;

  if (playlist_name) {
    if ((songs == "")) {
      alert("Song required");
    } else {      
      var songsArray = songs.split(',')
      songs = ""
      for(var i=0; i<songsArray.length - 1; i++) {
        if (i == songsArray.length - 2) {
          songs += songsArray[i]
        } else {
          songs += songsArray[i] + ','
        }
      }    

      const response = await fetch("api/playlists/create_playlist", {
        method: "post",
        body: JSON.stringify({
          playlist_name,
          songs,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("good");
      } else {
        console.log("bad");
      }
    }
  } else {
    alert("Playlist name required");
  }
}


var displayPlaylist = function(data) {
  var id = data.id.split('playlist')[1]
  const response = fetch(`homepage/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    console.log("good");
  } else {
    console.log("bad");
  }
}


document.querySelector("#search-btn").addEventListener("click", search);
document.querySelector("#done-btn").addEventListener("click", done);
