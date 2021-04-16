const reader = new FileReader();
reader.addEventListener('loadend', (event) => {
  const link = document.createElement('a');
  link.download = '_.gitignore';
  const blob = new Blob([hgToGit(event.target.result)], { type: 'text/plain' });
  link.href = window.URL.createObjectURL(blob);
  link.click();
});

function hgToGit(text) {
  let result = '';
  let match;
  let syntax = 'regexp';
  for (let line of text.split('\n')) {
    if (line.match(/^\s*$/) || line.match(/^#/)) {
      result += line + '\n';
      continue;
    }

    const regex = new RegExp(String.raw`/^${syntax}\s*:\s*(\S+)/`);
    if (match = line.match(regex)) {
      syntax = match[0].toLowerCase();
      //die "Unknown syntax '$syntax' on line $lineno of $hi\n" if ($syntax !~ /(glob|regexp)/);
      continue;
    }

    if (match = line.match(/^((?:\S|\\#)+)(\s*#.*)?\s*$/)) {

      let content = match[0];
      let comment = match[1];

      if (syntax == 'glob') {
        result += `${content}${comment}\n`;
        continue;
      }

      const newLine = content
        .replace(/[\^\$]/g, '')
        .replace(/\.\*/g, '*')
        .replace(/\./g, '?')
        .replace(/\\./g, '.')
        .replace(/(\[.+?\])/g, content);

      result += `${newLine}${comment}\n`;
    }
  }
  return result;
}

const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
  const fileList = event.target.files;

  reader.readAsText(fileList[0]);
});