var imageFieldPreview;
var imageFieldHid;

function selectImageField(el, imageName, hiddenField, triggerUpload, deleteFunction) {
    imageFieldPreview = $('#' + imageName);
    imageFieldHid = $('#' + hiddenField);
    var link = $(el);
    console.log('select image field');

    initEditor(link.data('width'), link.data('height'), imageFieldHid.val(), imageFieldPreview[0].parentNode, selectImageFieldCallback, triggerUpload, deleteFunction);
}

function selectImageFieldCallback(imageData) {
    setTimeout(function () {
        imageFieldPreview = $('#' + imageFieldPreview[0].id);  //it was destroyed and recreated by cropper.  reselect it.
        imageFieldPreview.attr('src', imageData);
        $(imageFieldPreview[0].parentNode).removeClass('cropperPreview');
        imageFieldHid.val(imageData).trigger('change');
        initPreview();
    }, 150);
}

function sidebarToggle() {
    if ($('#sidebar').hasClass('d-none')) $('#sidebar').removeClass('d-none').css('margin-top', '10px');
    else $('#sidebar').addClass('d-none').css('margin-top', '');
}