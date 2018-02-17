var userConect = null;
$(function() {
  $('#slideshow > div:gt(0)').hide();
  setInterval(function() {
    $('#slideshow > div:first').fadeOut(1000).next().fadeIn(1000).end().appendTo('#slideshow');
  }, 3850);
});

$(document).ready(function() {
  // slide
  function loginGoogle() {
  	if (!firebase.auth().currentUser) {
  	 var provider = new firebase.auth.GoogleAuthProvider();
  	 provider.addScope('https://www.googleapis.com/auth/plus.login');
  	 firebase.auth().signInWithPopup(provider).then(function(result) {
			  var token = result.credential.accessToken;
			  var user = result.user;
        var name = result.user.displayName;
        initFirebase(result.user);
      }).catch(function(error) {
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  var email = error.email;
			  var credential = error.credential;

			  if (errorCode === 'auth/account-exists-with-different-credential') {
			  	alert('Es el mismo usuario');
			  }
      });
  	} else {
  		firebase.auth().signOut();
  	}
  }

  function loginFacebook() {
  	if (!firebase.auth().currentUser) {
  	 var provider = new firebase.auth.FacebookAuthProvider();
  	 provider.addScope('public_profile');
  	 firebase.auth().signInWithPopup(provider).then(function(result) {
			  var token = result.credential.accessToken;
			  var user = result.user;
        var name = user.displayName;
        initFirebase(result.user);
      }).catch(function(error) {
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  var email = error.email;
			  var credential = error.credential;

			  if (errorCode === 'auth/account-exists-with-different-credential') {
			  	alert('Es el mismo usuario');
			  }
      });
  	} else {
  		firebase.auth().signOut();
  	}
  }
  /*
  function signOut() {
    window.location.href = 'views/login.html';
  };
*/
  $('#btn-google').on('click', loginGoogle);
  $('#btn-fb').on('click', loginFacebook);

  // esta parte detectara si hay un usuario ya logueado y nos redigira a index

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.location.href = '../index.html';
    }
  });
});

function initFirebase(usuario) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var uid = user.uid;
      userConect = firebase.database().ref('/user/' + usuario.uid + '/data');
      // console.log(user);
      firebase.database().ref('/user/' + usuario.uid + '/data').on('value', function(snapshot) {
        console.log(snapshot.val());
        if (snapshot.val() !== null) {
          if (snapshot.val().uid === usuario.uid) {
            console.log('usuario ya registrado anteriormente');
            window.location.href = '../index.html';
          }
        } else {
          // conecto a la base de datos creo la referencia user y llamo a addUserDb
          addUserDb(usuario.uid, user.displayName, user.photoURL);
        }
      });
    }
  });
}
// obtiene uid y name


function addUserDb(uid, name, photo) {
  var conect = userConect.set({
    uid: uid,
    name: name,
    photo: photo
  });

  window.location.href = '../index.html';
}