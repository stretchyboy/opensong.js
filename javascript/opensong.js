
$.fn.openSongLyrics = function(lyrics) {

  var lyricsLines = lyrics.split("\n");
  
  while(lyricsLines.length > 0) {
    var line = lyricsLines.shift();
    
    switch(line[0]) {
      case "[":
        var regexp = /\[(\w)(\d)?\]/g;
        var m = regexp.exec(line);
        var header = replaceHeader(m[1]);
        var number = m[2] ? m[2] : "";
        
        $(this).append("<h2>" + header + " " + number + "</h2>");
        break
      case ".":
        var chordsLine = line.substr(1);
        
        var chordArr = new Array();
        // split cords
        while (chordsLine.length > 0) {
          var m = /^(\S*\s*)(.*)$/.exec(chordsLine);
          chordArr.push(m[1]);
          chordsLine = m[2];
        }
        
        var lyricsLine = lyricsLines.shift().substr(1);
        
        var lyricsArr = new Array();
        // split lyrics line based on chord length
        for (var i in chordArr) {
          
          if (i < chordArr.length - 1) {
            var chordLength = chordArr[i].length;          
            // split String with RegExp (is there a better way?)
            var m = lyricsLine.match(new RegExp("(.{"+ chordLength +"})(.*)"));
          
            if(m === null) {
              lyricsArr.push("");
            } else {
              lyricsArr.push(m[1]);
              lyricsLine = m[2];
            }
          } else {
            // add the whole string if at the end of the chord arr
            lyricsArr.push(lyricsLine);
          }
        }
        
        //console.log(chordArr);        
        //console.log(lyricsArr);
        
        var htmlTableRows = "<tr class='chords'><td>" + chordArr.join("</td><td>") + "</td></tr>\n";
        htmlTableRows = htmlTableRows + "<tr class='lyrics'><td>" + lyricsArr.join("</td><td>") + "</td></tr>\n";
        
        $(this).append("<table>" + htmlTableRows + "</table>");
        break;
      case " ":
        $(this).append("<div>" + line + "</div>");
        break;
      default:
        console.log("no support for :" + line);
    };
  }

  function replaceHeader(abbr) {
    switch(abbr) {
      case "C":
        return "Chorus";
      case "V":
        return "Verse";
      case "B":
        return "Bridge";
      case "T":
        return "Tag";
      case "P":
        return "Pre-Chorus";
      case "I":
        return "Intro";
      case "O":
        return "Outro";
      }
  }

}