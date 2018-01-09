// obtiene imagen y username
var userName = $('#user-name');
var userImg = $('#user-photo');
function redirectLogin() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      initFirebase();
    } else {
      window.location.href = '../login.html';
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
      var imgU = $('<img>', {
              'class': 'responsive-img',
              'src': userPhoto
            });
      pName.append(displayName);
      userName.append(pName);
      userImg.append(imgU);
    }
  });
}

$(window).on('load', function() {
  redirectLogin();
});

$(document).ready(function() {
  var nameUserChat = $('#name');
  var valTextChat = $('#message');
  var btnSend = $('#btn-send');
  var contChat = $('#content-chat');
  // mandar información a firebase para el chat

  btnSend.on('click', function() {
    var name = nameUserChat.val();
    var msg = valTextChat.val();

    firebase.database().ref('chat').push({
      name: name,
      message: msg
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
      }).text(txtName + ': ');
      var tMsg = $('<li/>', {
        'class': 'li',
      }).text(txtMsg);
      contChat.append(tName);
      contChat.append(tMsg);
    });
  });

  // cerrar sesión 

  $('#sign-out').on('click', function() {
    firebase.auth().signOut().then(function() {
      console.log('cerrar sesion');
    }).catch(function(error) {
      console.log('error');
    });
  });
});

( function() {

	$('#btn-search').on('click', function(e) {

		e.preventDefault();
		$('#search').animate({width: 'toggle'}).focus();

	});

} () );
