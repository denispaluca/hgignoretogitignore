const reader = new FileReader();
reader.addEventListener('load', (event) => {
    console.log(event.target.result);
    var link = document.createElement('a');
    link.download = '.gitignore';
    var blob = new Blob([event.target.result], { type: 'text/plain' });
    link.href = window.URL.createObjectURL(blob);
    link.click();
});


const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);

    reader.readAsText(fileList[0]);
});