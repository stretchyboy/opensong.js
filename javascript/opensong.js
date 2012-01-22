(function($)
{
  // jQuery wrapper around openSongLyrics function
  $.fn.openSongLyrics = function(lyrics) {
    try {
      openSongLyrics(this, lyrics);
    } catch(e) {
      alert(e);
    }
  }
  // displays Opensong 
  function openSongLyrics(domElem, lyrics) {
    // clear Html Element and add opensong class
    $(domElem).html("").addClass("opensong");
  
    var lyricsLines = lyrics.split("\n");
  
    while(lyricsLines.length > 0) {
      var line = lyricsLines.shift();
    
      switch(line[0]) {
        case "[":
          var header = line;
          var number = "";
          
          // try to match default style
          var m = /\[(\w)(\d)?\]/g.exec(line);
          if (m) {
            header = replaceHeader(m[1]);
            number = m[2] ? m[2] : "";
          } else {
            // try to match 'custom style'
            m = /\[(\w*)\]/g.exec(line);
            header = m ? m[1] : line;
          }
          
          $(domElem).append("<h2>" + header + " " + number + "</h2>");
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
          // add an item if it is an empty line
          if (chordArr.length == 0) {
            chordArr.push(chordsLine);            
          }
        
          // write html table row for the chords
          var htmlTableRows = "<tr class='chords'><td></td><td>" + chordArr.join("</td><td>") + "</td></tr>\n";
        
          var textLine = "", m = null;
                    
          // while we have lines that match a textLine create an html table row
          while ((textLine = lyricsLines.shift()) && (m = textLine.match(/^([ 1-9])(.*)/))) {
            var textArr = new Array();
            var textLineNr = m[1];
            textLine = m[2];
            
            // split lyrics line based on chord length
            for (var i in chordArr) {
              if (i < chordArr.length - 1) {
                var chordLength = chordArr[i].length;          
                // split String with RegExp (is there a better way?)
                var m = textLine.match(new RegExp("(.{"+ chordLength +"})(.*)"));

                if(m === null) {
                  textArr.push("");
                } else {
                  textArr.push(m[1]);
                  textLine = m[2];
                }
              } else {
                // add the whole string if at the end of the chord arr
                textArr.push(textLine);
              }
            }
            // write html table row for the text (lyrics)
            htmlTableRows = htmlTableRows + "<tr class='lyrics'><td>" + textLineNr + "</td><td>" + textArr.join("</td><td>") + "</td></tr>\n";
          }
          // attach the line again in front (we cut it off in the while loop)
          if(textLine !== undefined) lyricsLines.unshift(textLine);
        
          $(domElem).append("<table>" + htmlTableRows + "</table>");
          break;
        case " ":
          $(domElem).append("<div class='lyrics'>" + line.substr(1) + "</div>");
          break;
        case ";":
          $(domElem).append("<div class='comments'>" + line.substr(1) + "</div>");
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
})(jQuery);
