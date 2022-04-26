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
    const processFiles: Promise<unknown>[] = [];
    const mode = document.getElementById("mode") as HTMLInputElement;
    Array.from(files).forEach((f) => {
      processFiles.push(
        f.text().then((text) => {
          let str = '';
          let json = JSON.parse(text);
          let lbft = '';
          if (mode.value === "story") {
            let context = json.content.story.fragments; 
            for (var i = 0; i < context.length; i++)
              str += context[i].data;
          } 
          else {
            lbft = ' lorebook';
            let lbs = json.content.lorebook.entries; 
            for (var i = 0; i < lbs.length; i++) {
              if (i >= 1)
                str += '\n***\n';
              str += lbs[i].text;
            }
          }
          content = str;
          let mname = json.metadata.title + lbft + '.txt';
          if (name === '')
            name = mname;
          results.push({ name: mname, input: str });
        })
      );
    });
    Promise.all(processFiles).then(() => {//
      if(results.length >= 2)
        downloadZip(results)
          .blob()
          .then((blob) => {FileSaver.saveAs(blob, name+'.zip');})
      else {
        var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, name)
      }
      const reset = document.getElementById("reset") as HTMLInputElement;
      reset.value = '';
    }
    );
  };
  return (
    
    <div className="App" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <header>
    <h1>NovelAI plaintext converter</h1>
    Convert any NAI story to a text file with a single click of a button<br />
    <img src="https://cdn.discordapp.com/attachments/356304198398115841/968465366584016916/here.png" alt="download story from novelai img"/>
  </header>
        Download <select id="mode">
    <option value="story">story</option>
    <option value="lorebook">lorebook</option>
  </select> as plaintext<br />
  <br />
      <input
        id="reset"
        type="file"
        multiple={true}
        accept=".story"
        onChange={(e) => processFiles(e.target.files!)}
      />

<pre style={{ textAlign: "left", display: "block" }}>

        <a href="https://www.reddit.com/user/pumegaming" target="_blank" rel="noreferrer">By pume_!</a> check out my:
        <br />• <a href="https://rentry.co/lorebook-guide" target="_blank" rel="noreferrer">lorebook guide</a>
        <br />• <a href="https://pume-p.github.io/ao3-datasetting/" target="_blank" rel="noreferrer">ao3 datasetting</a>
        <br />
        <br />
<a href="https://www.reddit.com/user/Zermelane" target="_blank" rel="noreferrer">Original code by Zermelane</a>

      </pre>

    </div>
  );
}

export default App;
