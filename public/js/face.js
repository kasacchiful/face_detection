$(document).ready(function() {
  $('#file_analyze').on('click', function() {
    if (!$('#image').get(0).files.length) { return; }
    var file, file_reader, img, image_url;
    file = $('#image').get(0).files[0];
    file_reader = new FileReader();
    file_reader.onload = function(event) {
      img = new Image;
      image_url = event.target.result;
      img.src = image_url;
      img.onload = function() {
        var canvas, ctx;
        $('#canvas').attr({
          'width': img.width,
          'height': img.height
        });
        canvas = $('#canvas').get(0);
        ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        analyze(image_url);
      };
    };
    file_reader.readAsDataURL(file);
  });
});

function analyze(image_data) {
  var api_endpoint = "/api/v1/face";

  $('#loading').css('visibility', 'visible');
  return $.ajax({
    type: 'POST',
    url: api_endpoint,
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({uri: image_data}),
    context: this
  }).success(function(data, status, xhr) {
    console.log(data);
    return $('#loading').css('visibility', 'hidden');
  }).error(function(data, status, xhr) {
    alert(status);
    return $('#loading').css('visibility', 'hidden');
  });
}
