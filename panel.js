function previewAllImages () {
  // TODO can we move this back out somehow?
  // lazy loader
  const Lozad = lozad()

  const previewContainer = document.getElementById('previews')
  getImagesPromise().then(
    (images) => {
      console.log(images)
      html = images.map(
        img => `<img class="lozad imgpreview" onClick="imageClicked(this)" data-src="${img.url}">`
      ).join("\n")
      previewContainer.innerHTML = html
      Lozad.observe()
    }
  )
}

(function(){

  // Slide In Panel - by CodyHouse.co
  var panelTriggers = document.getElementsByClassName('js-cd-panel-trigger');
  if( panelTriggers.length > 0 ) {
    for(var i = 0; i < panelTriggers.length; i++) {
      (function(i){
        var panelClass = 'js-cd-panel-'+panelTriggers[i].getAttribute('data-panel'),
          panel = document.getElementsByClassName(panelClass)[0];
        // open panel when clicking on trigger btn
        panelTriggers[i].addEventListener('click', function(event){
          event.preventDefault();
          addClass(panel, 'cd-panel--is-visible');

          // FIXME only do the operation for the correct container
          previewAllImages()
          loadStory()
        });
        //close panel when clicking on 'x' or outside the panel
        panel.addEventListener('click', function(event){
          if( hasClass(event.target, 'js-cd-close') || hasClass(event.target, panelClass)) {
            event.preventDefault();
            removeClass(panel, 'cd-panel--is-visible');
          }
        });
      })(i);
    }
  }

  //class manipulations - needed if classList is not supported
  //https://jaketrent.com/post/addremove-classes-raw-javascript/
  function hasClass(el, className) {
    if (el.classList) return el.classList.contains(className);
    else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }
  function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += " " + className;
  }
  function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className=el.className.replace(reg, ' ');
    }
  }
})();
