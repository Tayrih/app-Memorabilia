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
      // aca consultamos
      console.log(userExist(user.uid));
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
      console.log(element);
      // esto lo estoy poniendo para comprobar si entra a tu base de datosse
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

} () );
$(document).ready(function() {
       function DropDownMenu() {
        $('.dropdown-button').dropdown();
      }
    });
