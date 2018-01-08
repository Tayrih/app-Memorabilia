$(document).ready(function() {
  var nameUserChat = $('#name');
  var valTextChat = $('#message');
  var btnSend = $('#btn-send');
  var contChat = $('#content-chat');
  // SLIDESHOW
  $(function() {
    $('#slideshow > div:gt(0)').hide();
    setInterval(function() {
      $('#slideshow > div:first').fadeOut(1500).next().fadeIn(1500).end().appendTo('#slideshow');
    }, 3850);
  });

  function loginGoogle() {
  	if (!firebase.auth().currentUser) {
  	 var provider = new firebase.auth.GoogleAuthProvider();
  	 provider.addScope('https://www.googleapis.com/auth/plus.login');
  	 firebase.auth().signInWithPopup(provider).then(function(result) {
			  var token = result.credential.accessToken;
			  var user = result.user;
			  var name = result.user.displayName;

			  $('#page').css('display', 'none') && $('#page-2').css('display', 'block');
			  $('#well').text('Bienvenido' + name + 'a Memorabilia');
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

			  $('#page').css('display', 'none') && $('#page-2').css('display', 'block');
			  $('#well').text('Bienvenido' + name + 'a Memorabilia');
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

  $('#btn-google').on('click', loginGoogle);
  $('#btn-fb').on('click', loginFacebook);
  btnSend.on('click', function() {
    var name = nameUserChat.val();
    var msg = valTextChat.val();
    
    firebase.database().ref('chat').push({
      name: name,
      message: msg
    });
  });

  firebase.database().ref('chat').on('value', function(snapshot) {
    contChat.html('');
    snapshot.forEach(function(e) {
      var element = e.val();
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
});
