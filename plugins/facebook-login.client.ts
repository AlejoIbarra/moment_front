export default defineNuxtPlugin(() => {
  if (process.client) {
    // 1. Configurar la función de inicialización de FB
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : 'TU_APP_ID_AQUI', // REEMPLAZA ESTO CON TU APP ID DE FACEBOOK
        cookie     : true,
        xfbml      : true,
        version    : 'v18.0' // La versión de la API que usas
      });
        
      window.FB.AppEvents.logPageView();
    };

    // 2. Cargar el script de Facebook asíncronamente
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/es_LA/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }
})
