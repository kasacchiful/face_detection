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
        analyze(image_url, canvas, ctx);
      };
    };
    file_reader.readAsDataURL(file);
  });
});

function analyze(image_data, canvas, ctx) {
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
    display(data, canvas, ctx);
    return $('#loading').css('visibility', 'hidden');
  }).error(function(data, status, xhr) {
    alert(status);
    return $('#loading').css('visibility', 'hidden');
  });
}

function display(data, canvas, ctx) {
  var age, face, gender, height, width, x, y;
  data.forEach(function(face, index, ar) {
    age = face.age.ageRange;
    gender = face.gender.gender;
    height = face.height;
    width = face.width;
    x = face.positionX;
    y = face.positionY;
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = "rgb(255,0,0)";
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("age: " + age + ", gender: " + gender, x, y);
  });
}
