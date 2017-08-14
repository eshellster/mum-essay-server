var P_photo = (function(){

  function output(node) {
		var existing = $('#result .croppie-result');
		if (existing.length > 0) {
			existing[0].parentNode.replaceChild(node, existing[0]);
		}
		else {
			$('#result')[0].appendChild(node);
		}
	}

	function popupResult(result) {
		var html;
		if (result.html) {
			html = result.html;
		}
		if (result.src) {
			html = '<img src="' + result.src + '" />';
		}
		swal({
			title: '',
			html: true,
			text: html,
			allowOutsideClick: true
		});
		setTimeout(function(){
			$('.sweet-alert').css('margin', function() {
        var top = 0, left = 0;
        if (matchMedia("screen and (min-width: 1024px)").matches) {
          top = -1 * ($(this).height() / 2),
  					left = -1 * ($(this).width() / 2);
        } else {
          top = -1 * ($(this).height() / 2);
          $('.sweet-alert').css('width', function(){
            return 234;
          })
        }


				return top + 'px 0 0 ' + left + 'px';
			});
		}, 1);
	}


  function photoUpload() {
    var $uploadCrop;

    function readFile(input) {
      if (input.files && input.files[0]) {
              var reader = new FileReader();

              reader.onload = function (e) {
                $('.upload-demo').addClass('ready');
                $uploadCrop.croppie('bind', {
                  url: e.target.result
                }).then(function(){
                  console.log('jQuery bind complete');
                });

              }

              reader.readAsDataURL(input.files[0]);
          }
          else {
            swal("Sorry - you're browser doesn't support the FileReader API");
        }
    }

    $uploadCrop = $('#upload-demo').croppie({
      viewport: {
        width: 200,
        height: 200,
        type: 'square'
      },
      enableExif: true
    });

    $('#upload').on('change', function () { readFile(this); });
    $('.upload-result').on('click', function (ev) {
      $uploadCrop.croppie('result', {
        type: 'canvas',
        size: 'viewport'
      }).then(function (resp) {
        popupResult({
          src: resp
        });
      });
    });
  }

  function init() {
    photoUpload();
  }

  return {
    init: init
  };

})();
