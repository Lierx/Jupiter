$(document).ready(function() {
  $.ajax({
    url: '/backgrounds', 
    method: 'GET',
    success: function(response) {
      const backgrounds = response 
      var randomIndex = Math.floor(Math.random() * backgrounds.length);
      var randomBackground = backgrounds[randomIndex];


      var style = document.styleSheets[0];
      style.insertRule('body::before { background-image: url("src/backgrounds/' + randomBackground + '"); }', style.cssRules.length);

    },
    error: function(error) {
      console.log(error)
    }
  });
  document.body.addEventListener('wheel', function(e) {
    window.scrollBy(0, e.deltaY);
    e.preventDefault();
  }, { passive: false });
    
    $('.cornerbutton').click(function() {
      console.log('enseñando fondo.')
      var elemento = document.getElementById('contenido');
      elemento.classList.toggle('invisible')
      document.body.classList.toggle('sinBlur');
      
    })
})