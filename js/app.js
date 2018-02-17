// obtiene imagen y username
var userName = $('#user-name');
var userImg = $('#user-photo');
var userNameProfile = $('#user-name-profile');
var database = firebase.database();
var userConect = null;

var userSession = null;

var buttonFollow = $('<a/>', {
  'class': 'follow',
});

function redirectLogin() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      console.log(window.location.host + '/views/login.html');
      window.location.href = 'http://' + window.location.host + '/views/login.html';
    }
  });
}
redirectLogin();


function index() {
  function initFirebase() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        userConect = database.ref('/user/' + user.uid + '/data');
        // console.log(userExist(user.uid));
        firebase.database().ref('/user/' + user.uid + '/data').on('value', function(snapshot) {
          if (snapshot.val().uid === user.uid) {
            userSession = snapshot.val();
            var displayName = userSession.name;
            var userPhoto = null;

            if (userSession.newPhoto === true)
              userPhoto = userSession.urlNewPhoto;
            else
              userPhoto = userSession.photo;

            if (userSession.aboutYou) {
              var about = userSession.aboutYou;
              $('#about').html('Sobre mi: ' + about);
            }

            if (userSession.newColection) {
              var colec = userSession.newColection;
              $('#colect').html('Colecciono: ' + colec);
            } 

            var pName = $('<p/>', {
              'class': 'user-name',
            });

            var profileName = $('<h3/>', {
              'class': 'user-name-profile',
            });

            pName.append(displayName);
            profileName.append(displayName);
            userName.append(pName);
            userNameProfile.append(profileName);
            
            var imgU = $('<img>', {
              'class': 'responsive-img circle user',
              'src': userPhoto
            });
            userImg.append(imgU);
          } 
        });
      }
    });
  }

  initFirebase();
}

function chat() {
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

    (valTextChat).keypress(function(elm) {
      valTextChat.scrollTop(valTextChat.scrollHeight - valTextChat.height());
      if (elm.which === 13) {
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
      }
    });

    // obtiene data de la base de datos

    firebase.database().ref('chat').on('value', function(snapshot) {
      contChat.html('');
      snapshot.forEach(function(elm) {
        var element = elm.val();
        var txtName = element.name;
        var txtMsg = element.message;
        var tName = $('<p/>', {
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
          var name2 = user.displayName;
          var state = valTextState.val();
          // var timeP = time();
          var icon = 0;

          var cont = 0;

          $('#heart').on('click', function() {
            console.log('uno');
          });

          firebase.database().ref('state').push({
            user: name2,
            message: state,
            // time: time,
            iconh: icon
          });
        }
      });
    });

    var newBox = $('#news-box');
    firebase.database().ref('state').on('value', function(snapshot) {
      newBox.html('');
      snapshot.forEach(function(elm) {
        valTextState.val('');
        var element = elm.val();
        var name2U = element.user;
        var states = element.message;
        var dTime = element.time;
        var contLike = element.iconh;

        var sUserCard = $('<div/>', {
          'class': 'post col s12',
        });

        var iconPost = $('<div/>', {
          'class': 'col s6 icon-box',
        });

        var iconHeart = $('<i/>', {
          'class': 'fa fa-heart-o turq',
          'aria-hiden': 'true',
          'id': 'heart'
        }).text(contLike);

        // var postTime = $('<span/>', {
        //  'class': 'col s6 post-time right-align',
        // }).text(dTime);      

        var post = $('<p/>', {
          'class': 'li',
        }).text(name2U + ': ' + states);

        newBox.prepend(sUserCard);
        sUserCard.append(post);
        sUserCard.append(iconPost);
        // sUserCard.append(postTime);
        iconPost.append(iconHeart);
      });
    });

    var containerContact = $('#contact');
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('user').on('value', function(snapshot) {
          containerContact.html('');
          snapshot.forEach(function(elm) {
            var element = elm.val().data;
            var contact = element.name;
            var photoContact = element.photo;
            var uid = element.uid;
            // consulta dentro de los datos del Usuario actual
            firebase.database().ref('user/' + userSession.uid + '/follow/' + element.uid).on('value', function(snapshot) {
              if (snapshot.val() !== null) {
                buttonFollow = $('<a/>', {
                  'class': 'waves-effect waves-light btn unfollow',
                  'data-id': uid,
                  'data-user': user.uid,
                }).text('Dejar de Seguir');
              } else {
                buttonFollow = $('<a/>', {
                  'class': 'waves-effect waves-light btn follow',
                  'data-id': uid,
                  'data-user': user.uid,
                }).text('Seguir');
              }
            });
            
            // console.log(element);
            
            // var colection; campo que ingresa el usuario al configurar su perfil
            var boxContact = $('<div/>', {
              'class': 'post col s12',
              'id': 'box-contact' + uid
            });

            var boxImg = $('<div/>', {
              'class': 'box-contact col s2',
              'id': 'box-img' + uid
            });

            var imgContact = $('<img>', {
              'class': 'responsive-img circle user img-cont',
              'src': photoContact
            });

            var nameContact = $('<a/>', {
              'href': 'views/profile.html#' + uid,
              'class': 'col s10',
            }).text(contact);

            containerContact.append(boxContact);
            boxContact.append(boxImg);
            $('#box-img' + uid).append(imgContact);
            $('#box-contact' + uid).append(nameContact);
            $('#box-contact' + uid).append(buttonFollow);
          });

          $('.follow').on('click', function() {
            var follow = $(this).data('id');
            var user = $(this).data('user');
            
            console.log($(this).data('id'));
            var postData = {
              follow: follow
            };

            var postUser = {
              follower: user,
            };

            // Get a key for a new Post.
            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/user/' + user + '/follow/' + follow] = postData;
            updates['/user/' + follow + '/follower/' + user] = postUser;

            firebase.database().ref().update(updates);
          });
        });
      }
    });
  });
}
// obtiene lista de seguidores 
function settings() {
  $(document).ready(function() {
    // settings
    var upload = $('#uploader');
    var btNewImage = $('#bt-new-img');
    var btSave = $('#bt-save');

    var useruid = null;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('user/' + user.uid + '/data').on('value', function(snapshot) {
          $('#new-name').val(snapshot.val().name);
          useruid = snapshot.val().uid;
        });
      }
    });

    btSave.on('click', function() {
      var dataUser = null;
      firebase.database().ref('user/' + useruid + '/data').on('value', function(snapshot) {
        dataUser = snapshot.val();
      });

      if ($('#new-name').val() !== '')
        dataUser.name = $('#new-name').val();
      if ($('#new-colect').val() !== '')
        dataUser.newColection = $('#new-colect').val();
      if ($('#about-you').val() !== '')
        dataUser.aboutYou = $('#about-you').val();
      
      var fichero = document.getElementById('newimg');
      var file = fichero.files[0];
      if (file !== undefined) {
        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child('PhotoUsers/' + useruid).put(file);
        dataUser.newPhoto = true;

        uploadTask.on('state_changed',
          function(snapshot) {
            
          }, function(error) {
            alert('Hubo un error');
          }, function() {
            var downloadURL = uploadTask.snapshot.downloadURL;
            dataUser.urlNewPhoto = downloadURL;
            console.log(dataUser);
            var update = {};
            update['/user/' + useruid + '/data'] = dataUser;
      
            firebase.database().ref().update(update);
            alert('Datos actualizados');
          }

        );
      } else {
        console.log(dataUser);
        var update = {};
        update['/user/' + useruid + '/data'] = dataUser;
  
        firebase.database().ref().update(update);
        alert('Datos actualizados');
      }
    });

    // cerrar sesión
  });
}

$(document).ready(function() {
  $('[data-id = "sign-out"]').on('click', function() {
    firebase.auth().signOut();
    window.location.href = 'views/login.html';
  });
  
  $('[data-id = "home"]').on('click', function() {
    window.location.href = '../index.html';
  });
  
  $('[data-id="profile"]').on('click', function() {
    window.location.href = 'views/perfil.html';
  });
  
  $('#config').on('click', function() {
    window.location.href = '../views/settings.html';
  });
  
  $(function() {
    $('.button-collapse').sideNav();
  });
  
  $('.chips').material_chip();
  $('.chips-initial').material_chip({
    data: [{
      tag: 'Futbol',
    }, {
      tag: 'Anime',
    }, {
      tag: 'Monedas',
    }],
  });
  $('.chips-placeholder').material_chip({
    placeholder: 'Enter a tag',
    secondaryPlaceholder: '+Tag',
  });
  $('.chips-autocomplete').material_chip({
    autocompleteOptions: {
      data: {
        'Futbol': null,
        'Anime': null,
        'Monedas': null
      },
      limit: Infinity,
      minLength: 1
    }
  });
});

function profile() {
  // var useruid = window.location.hash.substring(1);
  // console.log(useruid);

  var containerContact = $('#followers');
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase.database().ref('user/' + user.uid + '/follower').on('value', function(snapshot) {
        containerContact.html('');
        console.log(snapshot.val());
        if (snapshot.val() !== null) {
          snapshot.forEach(function(elm) {
            var element = elm.val().follower;
            console.log(element);
            firebase.database().ref('user/' + element + '/data').on('value', function(snapshot) {
              var follower = snapshot.val();
              var contact = follower.name;
              var photoContact = follower.photo;
              var uid = follower.uid;
              // var colection; campo que ingresa el usuario al configurar su perfil
              var boxContact = $('<div/>', {
                'class': 'post col s12',
                'id': 'box-contact' + uid
              });

              var boxImg = $('<div/>', {
                'class': 'box-contact col s2',
                'id': 'box-img' + uid
              });

              var imgContact = $('<img>', {
                'class': 'responsive-img circle user img-cont',
                'src': photoContact
              });

              var nameContact = $('<a/>', {
                'href': 'profile.html#' + uid,
                'class': 'col s10',
              }).text(contact);
              console.log(userSession.uid + '->' + uid);
              var ref = 'user/' + userSession.uid + '/follow/' + uid;
              firebase.database().ref(ref).on('value', function(snapshot) {
                console.log(ref);
                console.log(snapshot.val());
                // Me llaman... corrige aca por que no esta consultando o que paso ya 
                if (snapshot.val() !== null) {
                  buttonFollow = $('<a/>', {
                    'class': 'waves-effect waves-light btn unfollow',
                    'data-id': uid,
                    'data-user': user.uid,
                  }).text('Dejar de Seguir');
                } else {
                  buttonFollow = $('<a/>', {
                    'class': 'waves-effect waves-light btn follow',
                    'data-id': uid,
                    'data-user': userSession.uid,
                  }).text('Seguir');
                }
                
                $('#box-contact' + uid).append(buttonFollow);
                $('.follow').on('click', function() {
                  console.log('Siguiendo a ' + $(this).data('id'));
                  var follow = $(this).data('id');
                  var user = $(this).data('user');
                  
                  // console.log($(this).data('id'));
                  var postData = {
                    follow: follow
                  };
      
                  var postUser = {
                    follower: user,
                  };
      
                  // Get a key for a new Post.
                  // Write the new post's data simultaneously in the posts list and the user's post list.
                  var updates = {};
                  updates['/user/' + user + '/follow/' + follow] = postData;
                  updates['/user/' + follow + '/follower/' + user] = postUser;
      
                  firebase.database().ref().update(updates);
                });
              });
              containerContact.append(boxContact);
              boxContact.append(boxImg);
              $('#box-img' + uid).append(imgContact);
              $('#box-contact' + uid).append(nameContact);
            });
          });
        } 
      }); 
    } 
  }); 
}

function profileContact(params) {
  var useruid = window.location.hash.substring(1);  
  // console.log(useruid); hace referencia al nombre que se da click

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase.database().ref('/user/' + useruid + '/data').on('value', function(snapshot) {
        var userPhoto = $('<img>', {
          'class': 'responsive-img circle user img-cont',
          'src': snapshot.val().photo
        });
        
        var pName = $('<p/>', {
          'class': 'user-name',
        }).text(snapshot.val().name);

        $('#other-user').append(userPhoto);
        $('#other-user-name').append(pName);
      }); 
    } 
  }); 
}