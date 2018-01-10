// obtiene imagen y username
var userName = $('#user-name');
var userImg = $('#user-photo');
var database = firebase.database();
var userConect = null;

function redirectLogin() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      initFirebase();
    } else {
      window.location.href = '../views/login.html';
    }
  });
}

function initFirebase() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var displayName = user.displayName;
      var userPhoto = user.photoURL;
      var pName = $('</p>', {
        'class': 'black',
      });

      pName.append(displayName);
      userName.append(pName);

      if (userPhoto) {
        var imgU = $('<img>', {
          'class': 'responsive-img',
          'src': userPhoto
        });
      } else {
        var imgU = $('<img>', {
          'class': 'responsive-img',
          'src': '../assets/images/user_circle.png'
        });
      }

      userImg.append(imgU);
      userConect = database.ref('/user/' + user.uid);
      // console.log(userExist(user.uid));
      if (!userExist(user.uid)) {
        // conecto a la base de datos creo la referencia user y llamo a addUserDb
        addUserDb(user.uid, user.displayName);
      }
    }
  });
}
// obtiene uid y name
function addUserDb(uid, name) {
  var conect = userConect.set({
    uid: uid,
    name: name
  });
}

function userExist(uid) {
  var exist = false;
  firebase.database().ref('user').on('value', function(snapshot) {
    snapshot.forEach(function(elm) {
      var element = elm.val();
      // console.log(element);
      if (element.uid === uid) {
        exist = true;
      }
    });
  });
  return exist;
}

$(window).on('load', function() {
  redirectLogin();
});

$(document).ready(function() {
  // var nameUserChat = $('#name');
  var valTextChat = $('#cht_log_email');
  var btnSend = $('#btn-send');
  var contChat = $('#content-msg');
  var contState = $('#contain-val-text');
  // mandar información a firebase para el chat

  btnSend.on('click', function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var name = user.displayName;
        var msg = valTextChat.val();

        firebase.database().ref('chat').push({
          name: name,
          message: msg
        });
      }
    });
  });

  // obtiene data de la base de datos

  firebase.database().ref('chat').on('value', function(snapshot) {
    contChat.html('');
    snapshot.forEach(function(elm) {
      var element = elm.val();
      var txtName = element.name;
      var txtMsg = element.message;
      var tName = $('<li/>', {
        'class': 'li',
      }).text(txtName + ': ' + txtMsg);

      contChat.append(tName);
      $('#cht_log_email').val('');
    });
  });
  // obtiene data para estados
  var valTextState = $('#textarea');
  $('#bt-send-text').on('click', function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var state = valTextState.val();

        firebase.database().ref('state').push({
          message: state
        });
      }
    });
  });


  firebase.database().ref('state').on('value', function(snapshot) {
    var newBox = $('#news-box');
    snapshot.forEach(function(elm) {
      var element = elm.val();
      var stateUser = element.stateU;
      var sUser = $('<p/>', {
        'class': 'li',
      }).append(stateUser);

      newBox.append(sUser);
    });
  });

  toggleFab();

  // Fab click
  $('#prime').click(function() {
    toggleFab();
  });

  // Toggle chat and links
  function toggleFab() {
    $('.prime').toggleClass('zmdi-plus');
    $('.prime').toggleClass('zmdi-close');
    $('.prime').toggleClass('is-active');
    $('#prime').toggleClass('is-float');
    $('.cht').toggleClass('is-visible');
    $('.fab').toggleClass('is-visible');
  }

  // Loader effect
  function loadBeat(beat) {
    beat ? $('.cht_loader').addClass('is-loading') : $('.cht_loader').removeClass('is-loading');
  }
  // cerrar sesión

  $('#sign-out').on('click', function() {
    firebase.auth().signOut().then(function() {
      console.log('cerrar sesion');
    }).catch(function(error) {
      console.log('error');
    });
  });
  // boton para estados, guarda en firebase
  $('#bt-send-text').on('click', function() {
    var valText = $('#textarea').val();
    firebase.database().ref('/state').set({
      message: valText
    });
  });
});

(function() {
  $('#btn-search').on('click', function(elm) {
    elm.preventDefault();
    $('#search').animate({width: 'toggle'}).focus();
  });
}());
