const reader = new FileReader();
const fileSelector = document.getElementById('file-selector');
const hgTextArea = document.getElementById('hgTextArea');
const gitTextArea = document.getElementById('gitTextArea');

function hgToGit(text) {
  let result = '';
  let match;
  let syntax = 'regexp';
  for (let line of text.split('\n')) {
    if (line.match(/^\s*$/) || line.match(/^#/)) {
      result += line + '\n';
      continue;
    }

    if (match = line.match(/^syntax\s*:\s*(\S+)/)) {
      syntax = match[1].toLowerCase();
      //die "Unknown syntax '$syntax' on line $lineno of $hi\n" if ($syntax !~ /(glob|regexp)/);
      continue;
    }

    if (match = line.match(/^((?:\S|\\#)+)(\s*#.*)?\s*$/)) {

      let content = match[1] || '';
      let comment = match[2] || '';

      if (syntax == 'glob') {
        result += `${content}${comment}\n`;
        continue;
      }

      const newLine = content
        .replace(/[\^\$]/g, '')
        .replace(/\.\*/g, '*')
        .replace(/\./g, '?')
        .replace(/\\./g, '.')
        .replace(/(\[.+?\])/g, '$1');

      result += `${newLine}${comment}\n`;
    }
  }
  return result;
}


reader.addEventListener('loadend', (event) => {
  const link = document.createElement('a');
  link.download = '_.gitignore';
  const blob = new Blob([hgToGit(event.target.result)], { type: 'text/plain' });
  link.href = window.URL.createObjectURL(blob);
  link.click();
  fileSelector.value = '';
});

fileSelector.addEventListener('change', (event) => {
  const fileList = event.target.files;

  reader.readAsText(fileList[0]);
});

hgTextArea.addEventListener('input', () => {
  gitTextArea.value = hgToGit(hgTextArea.value);
});