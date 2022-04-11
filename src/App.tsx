import "./App.css";
import { downloadZip } from "client-zip";
import FileSaver from "file-saver";
export {}
//npm start
//npm run deploy
function App() {
  const processFiles = (files: FileList) => {
    const results: { name: string; input: string }[] = [];
    let name = ''
    let content = ''
    let count = 1
    const processFiles: Promise<unknown>[] = [];
    Array.from(files).forEach((f) => {
      processFiles.push(
        f.text().then((text) => {
          let str = '';

          const oneshot = document.getElementById("oneshot") as HTMLInputElement;
          const nonaph = document.getElementById("nonaph") as HTMLInputElement;
          const bbold = document.getElementById("bold") as HTMLInputElement;
          const iitalics = document.getElementById("italics") as HTMLInputElement;
          let chnumber = 0;
          let seper = '<div class="userstuff">';
          let Spe = false;
          if (text.includes('<div class="meta group">\n  <h2 class="heading">')) Spe = true;
          if (Spe) seper = '<div class="meta group">\n  <h2 class="heading">'

          let sectors = text.split(seper);
          for (var i = 1; i < sectors.length; i++) {
            let text = sectors[i];
            let chaptername = '';
            if (Spe)
            {chaptername = text.split('</h2>')[0];

             text = text.split('<div class="userstuff">')[1];}
            text = text.split('</div>')[0];

            text = text.replaceAll('\n','');

            let bold, italics;
            if (bbold.checked) bold = "'"
            else bold = '';
            
            if (iitalics.checked) italics = "'"
            else italics = '';
            text = text.replaceAll('<strong>',bold);
            text = text.replaceAll('</strong>',bold);
            text = text.replaceAll('<b>',bold);
            text = text.replaceAll('</b>',bold);
            text = text.replaceAll('<em>',italics);
            text = text.replaceAll('</em>',italics);

            text = text.replaceAll('</p>','\n');
            text = text.replaceAll('<br/>','\n');
            text = text.replaceAll('<hr/>','\n***\n');
            text = text.replaceAll('<p>','\n');
            /*text = text.replaceAll('</p>','');
            text = text.replaceAll('<div>','');
            text = text.replaceAll('<div class="gtx-trans-icon">','');
            text = text.replaceAll('<span class="Apple-converted-space">','');
            text = text.replaceAll('<span>','');
            text = text.replaceAll('</span>','');

            text = text.replaceAll('<p class="p1">','');  
            text = text.replaceAll('<p class="p2">','');
            text = text.replaceAll('<p class="p3">','');
            text = text.replaceAll('<span class="s1">','');
            text = text.replaceAll('<span class="s2">','');
            text = text.replaceAll('<span class="s3">','');
            text = text.replaceAll('<span class="s4">','');
            text = text.replaceAll('</strike>','');
            text = text.replaceAll('<strike>','');
            text = text.replaceAll('</u>','');
            text = text.replaceAll('<u>','');*/
            text = text.replaceAll(/^.*<script.*$/gm,'');
            text = text.replaceAll(/<.*?>/gm,'');
            text = text.replaceAll('&gt;','>');
            text = text.replaceAll('&lt;','<');  
            text = text.replaceAll('–','-');
            text = text.replaceAll(' ','');

          text = text.replaceAll("\r", "\n"); // unify newline style
          text = text.replaceAll(/[^\S\n]+/gm, " "); // collapse multiple whitespace
          text = text.replaceAll(/ +,/g, ","); // remove whitespace preceding commas
          text = text.replaceAll(/[“”]/g, '"'); // replace fancy doublequotes
          text = text.replaceAll(/[‘’]/g, "'"); // replace fancy singlequotes
          text = text.replaceAll("…", "..."); // replace fancy ellipses
          text = text.replaceAll(/ +([,!])/g, "$1"); // remove whitespace preceding a comma or bang
          text = text.replaceAll(/^ +([^ ])/gm, "$1"); // remove leading whitespace
          text = text.replaceAll(/([^ ]) +$/gm, "$1"); // remove trailing whitespace
          text = text.replace(/^\n+/, ""); // remove initial empty lines
          text = text.replaceAll(/\n+/g, "\n"); // remove other empty lines

          if (nonaph.checked) text = text.replaceAll(/^[^a-z0-9]+$/gm, "***");

            str+= text;


            let chapter = '***'
            if (oneshot.value === "notnormal") {
              chapter = '⁂';
              chnumber++;
              if(Spe) results.push({ name: f.name.slice(0, -5).substring(0, 124) + ' - ' + chnumber + ' '+chaptername.replaceAll("/", "").substring(0, 124) + '.txt', input: text.trim() });
            }
            if (i !== sectors.length-1)str = str.trim() + '\n' + chapter + '\n';
          }
          //

          /*str = str.replaceAll("\r", "\n"); // unify newline style
          str = str.replaceAll(/[^\S\n]+/gm, " "); // collapse multiple whitespace
          str = str.replaceAll(/ +,/g, ","); // remove whitespace preceding commas
          str = str.replaceAll(/[“”]/g, '"'); // replace fancy doublequotes
          str = str.replaceAll(/[‘’]/g, "'"); // replace fancy singlequotes
          str = str.replaceAll("…", "..."); // replace fancy ellipses
          str = str.replaceAll(/ +([,!])/g, "$1"); // remove whitespace preceding a comma or bang
          str = str.replaceAll(/^ +([^ ])/gm, "$1"); // remove leading whitespace
          str = str.replaceAll(/([^ ]) +$/gm, "$1"); // remove trailing whitespace
          str = str.replace(/^\n+/, ""); // remove initial empty lines
          str = str.replaceAll(/\n+/g, "\n"); // remove other empty lines
          str = str.replaceAll(/^[^a-z0-9]+$/gm, "***"); // replace fully-non-alphanumeric lines with chapter breaks
*/

          if (name === '')
            name = f.name.slice(0, -5);
          else 
            {
              count++
              name = '(' + count + ') ao3 stories';
            }
          if (content === '')
              content = str;
          else 
            content = content.trim() + '\n⁂\n' + str;
            if (oneshot.value === "normal" || Spe === false) results.push({ name: f.name.slice(0, -5) + '.txt', input: str.trim() });
        })
      );
    });
    Promise.all(processFiles).then(() => {//
      const mutiple = document.getElementById("mutiple") as HTMLInputElement;
      if(mutiple.value === "mutipleval" && results.length >= 2)

      downloadZip(results)
        .blob()
        .then((blob) => {
          FileSaver.saveAs(blob, '('+count+") ao3 stories.zip");
        })
      else      {var blob = new Blob([content.trim()], {type: "text/plain;charset=utf-8"});

      FileSaver.saveAs(blob, name)}
    }
    );
  };
  return (
    
    <div className="App" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <header>
    <h1>NovelAI ao3 dataseting</h1>
    Convert any <a href="https://archiveofourown.org/" target="_blank" rel="noreferrer">ao3</a> story to a module with a single click of a button<br />
    <img src="https://cdn.discordapp.com/attachments/356304198398115841/959150260037509120/here.png" alt="download html from ao3 story img"/>

  </header>
      <pre style={{ textAlign: "left", display: "block" }}>
        <br />
        <input type="checkbox" id="bold"/> Cover bold text with single quote: <strong>bold</strong> -{'>'} 'bold'
        <br />
        <input type="checkbox" id="italics"/> Cover italics text with single quote: <em>italics</em> -{'>'} 'italics'
        <br />
        <input type="checkbox" id="nonaph"/> Replace non alphanumeric lines with ***
        <br />
        Separate chapters with <select id="oneshot">
    <option value="normal">***</option>
    <option value="notnormal">⁂</option>
  </select><br />
        &nbsp;&nbsp;&nbsp;&nbsp; Select *** for normal story. <br />
        &nbsp;&nbsp;&nbsp;&nbsp; Select ⁂ for collection of oneshots. 
        <br />
        Separate multiple stories with <select id="mutiple">
    <option value="single">⁂ in a single txt file</option>
    <option value="mutipleval">Multiple txt files</option>
  </select><br />
      </pre>
      <p>Download story as HTML and put it here:</p>
      <input
        type="file"
        multiple={true}
        accept=".html"
        onChange={(e) => processFiles(e.target.files!)}
      />

<pre style={{ textAlign: "left", display: "block" }}>
(You can drag and drop, and select mutiple files at once too-)<br /><br />
        <a href="https://www.reddit.com/user/pumegaming" target="_blank" rel="noreferrer">By pume_!</a>
        <br />

        <a href="https://www.reddit.com/user/Zermelane" target="_blank" rel="noreferrer">Original code by Zermelane</a>
        <br />
        <br />
        Check out my <a href="https://rentry.co/lorebook-guide" target="_blank" rel="noreferrer">guide</a> too!
      </pre>

    </div>
  );
}

export default App;
