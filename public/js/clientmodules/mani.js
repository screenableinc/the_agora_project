
var preview;
var form;
var fileinput;

function processfile(file) {

    if( !( /image/i ).test( file.type ) )
    {
        alert( "File "+ file.name +" is not an image." );
        return false;
    }

    // read the files
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function (event) {
        // blob stuff
        var blob = new Blob([event.target.result]); // create blob...
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob); // and get it's URL

        // helper Image object
        var image = new Image();
        image.src = blobURL;
        $("#triggerUpload").attr('src',blobURL)
        //preview.appendChild(image); // preview commented out, I am using the canvas instead
        image.onload = function() {
            // have to wait till it's loaded
            var resized = resizeMe(image); // send it to canvas


            var newinput = document.createElement("input");
            newinput.type = 'text';
            newinput.name = 'image';
            newinput.id='imagefinal'
            newinput.value=resized


            // put result from canvas into new hidden input
            form.appendChild(newinput);
        }
    };
}

function readfiles(files) {

    // remove the existing canvases and hidden inputs if user re-selects new pics
    var existinginputs = document.getElementsByName('images[]');
    var existingcanvases = document.getElementsByTagName('canvas');
    while (existinginputs.length > 0) { // it's a live list so removing the first element each time
        // DOMNode.prototype.remove = function() {this.parentNode.removeChild(this);}
        form.removeChild(existinginputs[0]);
        preview.removeChild(existingcanvases[0]);
    }

    for (var i = 0; i < files.length; i++) {
        processfile(files[i]); // process each file at once
    }
    // fileinput.value = ""; //remove the original files from fileinput
    // TODO remove the previous hidden inputs if user selects other files
}

export function start(selector, _preview, _form) {
    form = _form
    preview = _preview

    $(selector).change(function (fileinput) {

            if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
                alert('The File APIs are not fully supported in this browser. I suggest using chrome');
                return false;
            }
            readfiles(this.files);

    })

}

function resizeMe(img) {

    var canvas = document.createElement('canvas');

    var width = img.width;
    var height = img.height;
    //check orientation
    width = (width>height)? 480:320
    height = (width<height)? 320:480
    if(width===height){
        width,height=400
    }



    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    console.log(canvas.height)
    preview.appendChild(canvas); // do the actual resized preview

    return canvas.toDataURL("image/jpeg",1); // get the data from canvas as 70% JPG (can be also PNG, etc.)

}