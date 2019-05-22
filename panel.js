if (!Object.entries) {
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

const getPreviewUrl = url => proxyUrl(url, rootUrl => `${rootUrl}&w=250`)

const mapImages = (images) => images.map(
  img => `<img class="lozad imgpreview" onClick="imageClicked(this)" data-src="${img.url}">`
)

function previewAllImages () {
  // TODO can we move this back out somehow?
  // lazy loader
  const Lozad = lozad('.lozad', {
    load: function (el) {
      el.src = getPreviewUrl(el.getAttribute('data-src'))
    }
  })

  const previewContainer = document.getElementById('previews')
  getImagesPromise().then(
    (images) => {
      console.log(images)
      html = mapImages(images)
      Object.entries(peerImages).forEach(([peerId, {name, images}]) => {
        html.push(`<div><h3 style='display: inline-block;'>${name}</h3><span> ${peerId}</span></div>`)
        html = html.concat(mapImages(images))
      })
      previewContainer.innerHTML = html.join("\n")
      Lozad.observe()
    }
  )
}

(function(){

  const storyParagraph = stories => lang => `<p class="${lang}">${stories[lang]}</p>`

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
          const src = document.getElementById("image").dataset.src;
          loadStories(src).then((stories) => {
            console.log('stories', stories)
            html = Object.keys(stories || {}).map(storyParagraph(stories)).join("\n")
            document.getElementById('story').innerHTML = html
          })
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
