let artistNameForDisplay = "";

//makes the GET request which goes to MusicBrainz
function httpGet(theURL, cbFunction){
    //create new object for XMLHttpRequest
    let xmlHTTP = new XMLHttpRequest();

    xmlHTTP.open("GET", theURL);
    xmlHTTP.send();

    //wait for the response to be ready
    xmlHTTP.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200) {
            cbFunction(this);
        }
    };
}

function artistQuery() {
    let params = (new URL(document.location)).searchParams;

    //checks if there has been an artist name submitted
    if (params.has('artist')){
        let artistName = params.get('artist');
        let mbBaseURL = "https://musicbrainz.org/ws/2/";
        let mbArtistQuery = "artist?query=";

        let searchURL = mbBaseURL + mbArtistQuery + artistName;
        console.log(searchURL);

        //call httpGet function, takes API url and artist name to retrieve MBID.
        httpGet(searchURL, getMBID);
    }
}

//callback function
function getMBID(xhttp){
    let returnedData = xhttp.responseXML; //logs data from XML doc
    console.log(returnedData);

    //parse the data from the XML Response
    let artistData = returnedData.getElementsByTagName("artist")[0];
    artistNameForDisplay = artistData.getElementsByTagName("name")[0].innerHTML;
    let artistMBID = artistData.id;
    console.log("Artist ID: " + artistMBID);

    document.getElementById("loading").innerHTML = "Loading...";

    //Now use the recently retrieved MBID to call the function for obtaining an artists albums
    releasesQuery (artistMBID);
}

function releasesQuery (artistMBID){
    let mbBaseURL = "https://musicbrainz.org/ws/2/";
    let mbReleasesBrowse = "release-group?artist=";
    let type = "&type=album|ep"
    let browseURL = mbBaseURL + mbReleasesBrowse + artistMBID + type;
    console.log(browseURL);

    //call httpGet for releases, takes url and MBID to retrieve releases and dates.
    httpGet(browseURL, getReleases);
}

//callback function
function getReleases(xhttp){
    
    let returnedData = xhttp.responseXML; //stores data from returned XML doc
    console.log(returnedData);

    //retrieve the list of albums from XML
    let albumsList = returnedData.getElementsByTagName("release-group-list")[0];
    let albums = albumsList.getElementsByTagName("release-group");
    let numberOfAlbums = albums.length;
    console.log("Number of Albums: "+numberOfAlbums);

    let albumNames = [numberOfAlbums];
    let albumDates = [numberOfAlbums];

    // Storing each album names and release dates in two arrays
    for (let i=0; i<numberOfAlbums; i++){
        let currentAlbum = albumsList.getElementsByTagName("release-group")[i];
        let currentName = currentAlbum.getElementsByTagName("title")[0].innerHTML;
        let currentDate = currentAlbum.getElementsByTagName("first-release-date")[0].innerHTML;
        
        albumNames[i] = currentName;
        albumDates[i] = currentDate;
    }

    console.log(albumNames);
    console.log(albumDates);

    // creating an html table and adding the header row 
    table = "<tr><th>Album Name</th>"
    table += "<th>Release Date</th></tr>";

    // Adding each albums and release dates in a specfic line on the the table
    for (let i=0; i<albumNames.length; i++) {
        table+="<tr><td> "+albumNames[i]+"</td>";
        table+="<td> "+albumDates[i]+"</td></tr>";
    }

    document.getElementById("loading").innerHTML = "";
    document.getElementById("artistName").innerHTML = "Here is a list of album names from "+artistNameForDisplay+", as well as their release dates:";
    document.getElementById('placeholder').innerHTML = table;
    
}
//activates the artistQuery function
window.onload = artistQuery;