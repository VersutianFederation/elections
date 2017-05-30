/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser: true */
/*global $, jQuery, firebase, KJUR */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDUCZPMORvRZ1_ZWMlLMpEi5q9PQIAaT4o",
    authDomain: "versutian.firebaseapp.com",
    databaseURL: "https://versutian.firebaseio.com",
    projectId: "versutian",
    storageBucket: "versutian.appspot.com",
    messagingSenderId: "158551980529"
};
firebase.initializeApp(config);
var nationName;
var internalName;
var verificationCode;
var accessLevel = "CITIZEN";
var officials = ["north_arkana", "asairia", "akohos"];
var protectors = ["alamei"];
var sub = 'versutian@appspot.gserviceaccount.com';
var sPKCS8PEM = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9BUKL5OmnfAi6\n2TqOInGOCJ6aq44jC4503Y+NspbEkYF50PuzgtDNA356ZE987iKWoAOpLbRu9emG\nfeThjc+5CgTbJ0H8LPAfNb8uWBRd1JQm4X7nz5q9dDPkFt2+bG7Fxx6szaMKpRlN\n3w0ydk+7RIb+viizqym/XinTnW5KiDMPLbur+L1nlswYdTW445y16rbp4nTHKDGN\nYgqe72LdU0i5G80T2ZLS2zgpDD9myp0YU3k3MdtYthi7w7BnkBwAoB/zdg1NNi7y\ndXhQ684vSxRk972y+yyTzs42LOkzE0OIAc9/qnS8Kdgx0uhfnQirlO1Y3Qs+7Mo1\nUnQYggYtAgMBAAECggEAGeg7Jz5wUf7bmXSFpI6O/tcqmetyl1YRp+3oK5UzOezx\nkJc2sHN5F+hnMPJHvMlM31U+OzVi+iRlZgQiV1HfCy8W3EzErAIixTxSIFF9NSEa\nTzvv72jSfi4LoLMLoHpvMldo2mly89YOIlC0l9qEchfh4s+Ad6O5nJuU4wa8Y6WL\nkHQLzCS/mb38IlBL+jR4BfltFBCowWSDcXeTAn5rwStfSL/fJLNzIFvk77SdIh6Q\n4f3QAkTNYKQ0xGW2D12xlu9e9hzXLzwQWFHfigxbLSYYliCifjQVPXHPODwMZtsw\nKcFQc+wNfv7ECOagVY/+gnwcw+/yAcvI0GtvpZgihwKBgQD4MsxI6r4PbCwwWL8p\nrhFKXvMVftlXsjL1N0/EAE2QK3tOq0jgZ4iGnX0E3nTnyQxM4JIdOd/QxTU/jBLD\nHNpxzPk6mPDgdWlvn6Jod2BrGc4Dv/QaAIX+IMyYtz4fz6OfhehKDMQSihMZ0s/h\nuBy7qyY3MJ1a81XkihuBu0ehmwKBgQDC9kUG2VMVMdH7HXpGSByvfj3WpFBExDXO\nioK5BCLn8/lWUZ7jBhpN65wX+K5f7naty6Kxh5B+nW7hv1+wdOkjCZn9CZYU1Ga3\nMKznlOt3yfhrgpDaUlqiq8Ac9MlKjXE8cPqiwRMsZptLrtXY1dxwU+7/HY4qI7ld\nVXrcKXM31wKBgQCwhdh7J9FjQKkw/X2AVFfh0CQNLrm/wHKzqtIlcZ24ouRBMFtV\nlu0n6Myo8Nqum3QPHU1uUeIYJppXhvU1JclLVOARSANRcNA7Xorwx66gnarDSft/\nns2tz4AUQYeCsngKFf/+4pN1KBSrsh69x+dPpks4x2+y5ww4ze0AWMV6bwKBgGZk\nFl6Bdpvz/VbH5XbR2pbkUy/OPgXPkn61ye/HV1nAjVujJDIQ+3Ge4uzIAzSItbWS\n9BAOpXmJzzkqW+P9ko9/NGtrRHIOFx/wpW4+jOftn9U+zjqK8+TpFM1gVfMck7Lt\nlwQxKJOyE69M1Cy8LLilrCg56ncBKhH1mb/U2RkjAoGBALgBnHMIzhNQHJJcPEPk\nuLVnF+w3rFMH1m/JEngsxYp96BNLNcAoD/vA+Ie57+0ArGmAyQ5rs7jZAFiC5/pc\nB3wojXWg86UzK1h/EvthXYPqH+ukw0aoDuwiXBIIphxP5UOSnwHOFp/MWQyYNLLq\n1fs92SrrtEqiYhDSkAUCZxwb\n-----END PRIVATE KEY-----\n';
var kid = '71485c8500b96d3a3ba4c46fdce05bc81ed0b55f';
var token;
var verifyurl;

function denyCode() {
    "use strict";
    $('#spinner').remove();
    document.getElementById('verification-code-group').classList.add('has-warning');
    document.getElementById('verification-code-feedback').innerHTML = '<div class="form-control-feedback">Your verification code was not approved. Generate a new code.</div>';
}

function request(url, xml) {
    "use strict";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xml) {
        return xhr.responseXML;
    } else {
        return xhr.responseText;
    }
}

function verify() {
    "use strict";
    document.getElementById('nation-name-feedback').innerHTML = '';
    document.getElementById('nation-name-group').classList.remove('has-warning');
    document.getElementById('verification-code-feedback').innerHTML = '';
    document.getElementById('verification-code-group').classList.remove('has-warning');
    nationName = document.getElementById('nation-name').value;
    internalName = nationName.toLowerCase().replace(/ /g, "_");
    verificationCode = document.getElementById('verification-code').value;
    if (nationName === null || nationName.length < 2) {
        document.getElementById('nation-name-group').classList.add('has-warning');
        document.getElementById('nation-name-feedback').innerHTML = '<div class="form-control-feedback">Something\'s not right about that nation name.</div>';
        return;
    }
    if (verificationCode === null || verificationCode === "") {
        denyCode();
        return;
    } else {
        document.getElementById('login-form').innerHTML += '<div id="spinner" class="text-center"><span class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></span><span class="sr-only">Loading...</span></div>';
        var response = request("https://www.nationstates.net/cgi-bin/api.cgi?a=verify&nation=" + nationName + "&checksum=" + verificationCode, false);
        if (response !== 1) {
            denyCode();
            return;
        }
    }
    var oHeader = {alg: 'RS256', kid: kid, typ: 'JWT'},
        oPayload = {},
        tNow = KJUR.jws.IntDate.get('now'),
        tEnd = KJUR.jws.IntDate.get('now + 1hour');
    oPayload.aud = 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit';
    oPayload.exp = tEnd;
    oPayload.iat = tNow;
    oPayload.iss = sub;
    oPayload.sub = sub;
    oPayload.user_id = internalName;
    oPayload.scope = 'https://www.googleapis.com/auth/identitytoolkit';
    var sHeader = JSON.stringify(oHeader),
        sPayload = JSON.stringify(oPayload),
        token = KJUR.jws.JWS.sign(null, sHeader, sPayload, sPKCS8PEM, 'notasecret');
    firebase.auth().signInWithCustomToken(token).catch(function (error) {
        console.error(error);
    });
    var elections = document.getElementById('elections');
    if (officials.indexOf(internalName) !== -1) {
        accessLevel = "OFFICIAL";
    } else if (protectors.indexOf(internalName) !== -1) {
        accessLevel = "PROTECTOR";
    }
}

/*
function addTest() {
    var electionData = {
        election: "Delegate",
        options: {
            akohos: {
                humantus: true
            },
            opponent: {
                other_voter: true
            }
        }
    };

    var electionId = firebase.database().ref().child('elections').push().key;
    firebase.database().ref('elections/' + electionId).set(electionData);
}
*/

function updateElectionsData(data) {
    "use strict";
    firebase.database().ref('/elections/' + data.key + '/options').once('value').then(function (snapshot) {
        var elections = document.getElementById('elections'),
            electionSection = document.createElement('div');
        electionSection.innerHTML = '<hr><h2>' + data.val().election + '</h2>';
        elections.appendChild(electionSection);
        //var pieChart = document.createElement('div');
        //pieChart.setAttribute('id', 'pie-' + data.key);
        firebase.database().ref('/citizens/' + internalName + '/' + data.key + '/choices/').once('value').then(function (voted) {
            var votedCounter = voted.numChildren();
            if (votedCounter === data.val().votes) { // if the person voted,
                var youVoted = document.createElement('p');
                youVoted.innerHTML = 'You voted for ';
                voted.forEach(function (candidate) {
                    votedCounter--;
                    var candidateXML = request("https://www.nationstates.net/cgi-bin/api.cgi?nation=" + candidate.key + "&q=flag+name", true);
                    var candidateName = candidateXML.getElementsByTagName("NAME").item(0).textContent;
                    if (votedCounter === 0) {
                        youVoted.innerHTML += candidateName + '.';
                    } else if (votedCounter === 1) {
                        youVoted.innerHTML += candidateName + ' and ';
                    } else {
                        youVoted.innerHTML += candidateName + ', ';
                    }
                });
                electionSection.appendChild(youVoted);
            } else { // if they still need to vote
                var electionInner = document.createElement('div');
                electionInner.classList.add('card-columns');
                electionSection.appendChild(electionInner);
                snapshot.forEach(function (candidate) {
                    var card = document.createElement('div');
                    card.setAttribute('id', data.key + '-' + candidate.key);
                    card.classList.add('card');
                    firebase.database().ref('/citizens/' + internalName + '/' + data.key + '/choices/' + candidate.key).once('value').then(function (snapshot) {
                        if (snapshot.val()) {
                            card.classList.add('card-inverse');
                        }
                    });
                    electionInner.appendChild(card);
                    var img = document.createElement('img');
                    img.setAttribute('class', 'card-img-top img-fluid');
                    var candidateXML = request("https://www.nationstates.net/cgi-bin/api.cgi?nation=" + candidate.key + "&q=flag+name", true);
                    var flagSrc = candidateXML.getElementsByTagName("FLAG").item(0).textContent;
                    img.setAttribute('src', flagSrc);
                    card.appendChild(img);
                    var cardBlock = document.createElement('div');
                    cardBlock.classList.add('card-block');
                    card.appendChild(cardBlock);
                    var candidateName = candidateXML.getElementsByTagName("NAME").item(0).textContent;
                    cardBlock.innerHTML += '<h4 class="card-title">' + candidateName + '</h4>';
                    document.getElementById(data.key + '-' + candidate.key).addEventListener('click', function () {
                        firebase.database().ref('/elections/' + data.key + '/options/' + candidate.key + '/' + internalName).set(true);
                        firebase.database().ref('/citizens/' + internalName + '/' + data.key + '/choices/' + candidate.key).set(true);
                    }, false);
                });
                electionSection.appendChild(document.createElement('br'));
                electionSection.appendChild(document.createElement('br'));
            }
        });
    });
}

function clearElections() {
    "use strict";
    var elections = document.getElementById('elections');
    elections.innerHTML = '<h1>Vote</h1>';
    elections.innerHTML += '<p class="lead">Vote on these elections, ' + nationName + '.</p><button class="btn btn-secondary" onclick="signOut()">sign out</button><br><br>';
}

function loginembed() {
    "use strict";
    document.getElementById('ns-embed').src = "https://nationstates.net/page=login";
    document.getElementById('embed-switch').removeEventListener('click', loginembed, false);
    document.getElementById('embed-text').innerHTML = '<p>Once you have logged in, <button id="embed-switch" class="btn btn-secondary btn-sm">verify your nation</button>.</p>';
    document.getElementById('embed-switch').addEventListener('click', verifyembed, false);
}

function verifyembed() {
    "use strict";
    document.getElementById('ns-embed').src = "https://embed.nationstates.net/page=verify_login#proof_of_login_checksum";
    document.getElementById('embed-switch').removeEventListener('click', verifyembed, false);
    document.getElementById('embed-text').innerHTML = '<p>If there is an error, or you need to switch nations, <button id="embed-switch" class="btn btn-secondary btn-sm">login first</button>.</p>';
    document.getElementById('embed-switch').addEventListener('click', loginembed, false);
}

function signOut() {
    "use strict";
    firebase.auth().signOut();
}

function initApp() {
    "use strict";
    firebase.auth().onAuthStateChanged(function (user) {
        var elections = document.getElementById('elections');
        if (user) {
            internalName = user.uid;
            var nameXML = request("https://www.nationstates.net/cgi-bin/api.cgi?nation=" + internalName + "&q=name", true);
            nationName = nameXML.getElementsByTagName("NAME").item(0).textContent;
            var electionsData = firebase.database().ref('elections/');
            electionsData.on('value', function (snapshot) {
                clearElections();
                snapshot.forEach(function (childSnapshot) {
                    updateElectionsData(childSnapshot);
                });
            });
            
            if (accessLevel === "OFFICIAL" || accessLevel === "PROTECTOR") {
                elections.innerHTML += '<hr>';
                elections.innerHTML += '<h2>Create new election</h2>';
                elections.innerHTML += '<form><div class="form-group"><input type="text" class="form-control" id="election-name" placeholder="Election name"></div><div class="form-group"><label>Candidates</label><input type="text" class="form-control" id="election-name" placeholder="Nation name"> <br><input type="text" class="form-control" id="election-name" placeholder="Nation name"></div></form> <br><button class="btn btn-primary" onclick="add()">Create election</button><br>';
            }
        } else {
            elections.innerHTML = '<h1>Login with NationStates</h1><div id="login-form"><form><div class="form-group" id="nation-name-group"><input type="text" class="form-control form-control-lg" id="nation-name" aria-describedby="nationHelpBlock" placeholder="Nation name"><div id="nation-name-feedback"></div><p id="nationHelpBlock" class="form-text text-muted">Your nation\'s short name, as it is displayed on NationStates, for example, <b>Akohos</b>.</p></div></form><br><iframe src="https://embed.nationstates.net/page=verify_login#proof_of_login_checksum" style="border:none; height: 33vh; width: 100%" id="ns-embed"></iframe><div id="embed-text"><p>If there is an error, or you need to switch nations, <button id="embed-switch" class="btn btn-secondary btn-sm">login first</button>.</p></div><br><form><div class="form-group" id="verification-code-group"><input type="text" class="form-control" id="verification-code" aria-describedby="codeHelpBlock" placeholder="Code"><div id="verification-code-feedback"></div><p id="codeHelpBlock" class="form-text text-muted">Copy the code you see from the NationStates.net page into this box.</p></div></form><br><button class="btn btn-primary" onclick="verify()">Login</button></div><br><br>';
            document.getElementById('embed-switch').addEventListener('click', loginembed, false);
        }
    });
}

window.onload = function () {
    "use strict";
    initApp();
};