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
var nationName = "Unknown Nation";
var yourNationFlag = "https://www.nationstates.net/images/flags/Default.png";
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
var nationDataMap = new Map();
var nsBan = false;

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
    if (url.startsWith('https://www.nationstates.net/cgi-bin/api.cgi?nation=')) {
        if (xhr.status === 429) {
            if (nsBan) {
                alert('You have been banned for' + xhr.getResponseHeader('x-retry-after') + 'seconds by the NationStates API');
            }
            nsBan = true;
            return null;
        } else {
            nsBan = false;
        }
    }
    if (xml) {
        return xhr.responseXML;
    } else {
        return xhr.responseText;
    }
}

function nsRequest(id, info) {
    "use strict";
    if (!nationDataMap.has(id)) {
        nationDataMap.set(id, new Map());
    }
    var nationMap = nationDataMap.get(id);
    var requestString = "";
    var requests = [];
    for (var i = 0; i < info.length; i++) {
        if (!nationMap.has(info[i]) || nationMap.get(info[i]).length === 0) {
            requests.push(info[i]);
            if (requestString.length === 0) {
                requestString = info[i];
            } else {
                requestString += "+" + info[i];
            }
        }
    }
    if (requestString.length !== 0) {
        var requestXML = request("https://www.nationstates.net/cgi-bin/api.cgi?nation=" + id + "&q=" + requestString, true);
        for (var i = 0; i < requests.length; i++) {
            if (requestXML === null) {
                nationMap.set(request[i], "");
            } else {
                nationMap.set(requests[i], requestXML.getElementsByTagName(requests[i].toUpperCase()).item(0).textContent);
            }
        }
    }
    return nationMap;
}

function verify() {
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
        if (response != 1) {
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
        },
        votes: 1
    };

    var electionId = firebase.database().ref().child('elections').push().key;
    firebase.database().ref('elections/' + electionId).set(electionData);
}
*/

function removeElection(election) {
    $('#sec-' + election.key).remove();
}

function randomColor(h, s, v) {
    h_i = Math.floor(h * 6);
    f = h * 6 - h_i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    if (h_i === 0) {
        r = v;
        g = t;
        b = p;
    } else if (h_i === 1) {
        r = q;
        g = v;
        b = p;
    } else if (h_i === 2) {
        r = p;
        g = v;
        b = t;
    } else if (h_i === 3) {
        r = p;
        g = q;
        b = v;
    } else if (h_i === 4) {
        r = t;
        g = p;
        b = v;
    } else if (h_i === 5) {
        r = v;
        g = p;
        b = q;
    }
    return [Math.floor(r * 256), Math.floor(g * 256), Math.floor(b * 256)]
}

var chartMap = new Map();

function updateElectionsData(data) {
    "use strict";
    var elections = document.getElementById('elections');
    var electionSection = document.getElementById('sec-' + data.key);
    if (electionSection === null) {
        electionSection = document.createElement('div');
        electionSection.setAttribute('id', 'sec-' + data.key);
        elections.appendChild(electionSection);
    }
    electionSection.innerHTML = '<hr><h2>' + data.val().election + '</h2>';
    firebase.database().ref('/elections/' + data.key + '/options').on('value', function (snapshot) {
        firebase.database().ref('/citizens/' + internalName + '/' + data.key + '/choices/').once('value', function (voted) {
            var votedCounter = voted.numChildren();
            if (votedCounter === data.val().votes) { // if the person voted,
                $('#' + data.key + '-inner').remove();
                var row = document.getElementById(data.key + '-voted');
                if (row === null) {
                    row = document.createElement('div');
                    row.setAttribute('id', data.key + '-voted');
                    electionSection.appendChild(row);
                }
                var chart;
                if (chartMap.has(data.key)) {
                    chart = chartMap.get(data.key);
                } else {
                    var canvasCont = document.createElement('div');
                    canvasCont.style.position = 'relative';
                    canvasCont.style.margin = 'auto';
                    canvasCont.style.width = '100%';
                    canvasCont.style.height = '20vh';
                    row.appendChild(canvasCont);
                    var canvas = document.createElement('canvas');
                    canvasCont.appendChild(canvas);
                    chart = new Chart(canvas, {
                        type: 'doughnut',
                        data: {
                            labels: [],
                            datasets: [{
                                data: [],
                                backgroundColor: []
                            }]
                        },
                        options: {
                            maintainAspectRatio: false
                        }
                    });
                    chartMap.set(data.key, chart);
                }
                snapshot.forEach(function (candidate) {
                    var index = chart.data.labels.indexOf(candidate.key);
                    if (index === -1) {
                        chart.data.labels.push(nsRequest(candidate.key, ['name', 'flag']).get('name'));
                        chart.data.datasets.forEach((dataset) => {
                            dataset.data.push(candidate.numChildren() - 1);
                            var rgb = randomColor(Math.random(), 0.5, 0.95);
                            dataset.backgroundColor.push('rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')');
                        });
                    } else {
                        chart.data.datasets.forEach((dataset) => {
                            dataset.data[index] = candidate.numChildren() - 1;
                        });
                    }
                    if (chart.data.labels.length === snapshot.numChildren()) {
                        chart.update();
                    }
                });
                var youVoted = document.getElementById(data.key + '-voted-text');
                if (youVoted === null) {
                    youVoted = document.createElement('p');
                    youVoted.setAttribute('id', data.key + '-voted-text');
                    row.appendChild(youVoted);
                    var unvote = document.createElement('button');
                    unvote.textContent = 'Change vote';
                    unvote.classList.add('btn');
                    unvote.classList.add('btn-secondary');
                    unvote.addEventListener('click', function () {
                        voted.forEach(function (candidate) {
                            firebase.database().ref('/elections/' + data.key + '/options/' + candidate.key + '/' + internalName).remove();
                            firebase.database().ref('/citizens/' + internalName + '/' + data.key + '/choices/' + candidate.key).remove();
                        });
                    }, false);
                    row.appendChild(unvote);
                }
                youVoted.innerHTML = 'You voted for ';
                voted.forEach(function (candidate) {
                    votedCounter--;
                    var candidateInfo = nsRequest(candidate.key, ['flag', 'name']);
                    var candidateName = candidateInfo.get('name');
                    var candidateFlag = candidateInfo.get('flag');
                    if (votedCounter === 0) {
                        youVoted.innerHTML += '<img style="max-height: 13px; max-width: 20px; margin-right: 4px" src="' + candidateFlag + '">' + candidateName + '.';
                    } else if (votedCounter === 1) {
                        youVoted.innerHTML += '<img style="max-height: 13px; max-width: 20px; margin-right: 4px" src="' + candidateFlag + '">' + candidateName + ' and ';
                    } else {
                        youVoted.innerHTML += '<img style="max-height: 13px; max-width: 20px; margin-right: 4px" src="' + candidateFlag + '">' + candidateName + ', ';
                    }
                });
            } else { // if they still need to vote
                $('#' + data.key + '-voted').remove();
                chartMap.clear();
                var electionInner = document.createElement('div');
                electionInner.setAttribute('id', data.key + '-inner');
                electionInner.classList.add('card-columns');
                electionSection.appendChild(electionInner);
                snapshot.forEach(function (candidate) {
                    var card = document.getElementById(data.key + '-' + candidate.key);
                    var candidateInfo = nsRequest(candidate.key, ['flag', 'name']);
                    if (card === null) {
                        card = document.createElement('div');
                        card.setAttribute('id', data.key + '-' + candidate.key);
                        card.classList.add('card');
                        card.style.backgroundSize = 'cover';
                        card.style.backgroundPosition = 'center';
                        card.style.backgroundRepeat = 'no-repeat';
                        card.style.backgroundImage = 'linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url("' + flagSrc + '")';
                        electionInner.appendChild(card);
                        var cardBlock = document.createElement('div');
                        cardBlock.classList.add('card-block');
                        card.appendChild(cardBlock);
                        var candidateName = candidateInfo.get('name');
                        cardBlock.innerHTML += '<h4 class="card-title">' + candidateName + '</h4>';
                        document.getElementById(data.key + '-' + candidate.key).addEventListener('click', function () {
                            firebase.database().ref('/elections/' + data.key + '/options/' + candidate.key + '/' + internalName).set(true);
                            firebase.database().ref('/citizens/' + internalName + '/' + data.key + '/choices/' + candidate.key).set(true);
                        }, false);
                    }
                    var flagSrc = candidateInfo.get('flag');
                    firebase.database().ref('/citizens/' + internalName + '/' + data.key + '/choices/' + candidate.key).once('value').then(function (snapshot) {
                        if (snapshot.val()) {
                            card.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("' + flagSrc + '")';
                            card.style.color = '#fff';
                        } else {
                            card.style.backgroundImage = 'linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url("' + flagSrc + '")';
                            card.style.color = '#292b2c';
                        }
                    });
                });
            }
        });
    });
}

function addElection(election) {
    updateElectionsData(election);
}

function unregisterElection(election) {
    removeElection(election);
    firebase.database().ref('elections/' + election.key).off();
}

function startElections() {
    "use strict";
    var elections = document.getElementById('elections');
    elections.innerHTML = '<h1>Vote</h1>';
    elections.innerHTML += '<p class="lead">Welcome, <img style="max-height: 13px; max-width: 20px; margin-right: 4px" src="' + yourNationFlag + '">' + nationName + '. Vote on these elections:</p><p><small>Not ' + nationName + ' or on a public device? </small> <button class="btn btn-secondary btn-sm" onclick="signOut()">sign out</button></p>';
    $('#elections').after('<br><br>');
}

function loginEmbed() {
    "use strict";
    document.getElementById('ns-embed').src = "https://nationstates.net/page=login";
    document.getElementById('embed-switch').removeEventListener('click', loginEmbed, false);
    document.getElementById('embed-text').innerHTML = '<p>Once you have logged in, <button id="embed-switch" class="btn btn-secondary btn-sm">verify your nation</button></p>';
    document.getElementById('embed-switch').addEventListener('click', verifyEmbed, false);
}

function verifyEmbed() {
    "use strict";
    document.getElementById('ns-embed').src = "https://embed.nationstates.net/page=verify_login#proof_of_login_checksum";
    document.getElementById('embed-switch').removeEventListener('click', verifyEmbed, false);
    document.getElementById('embed-text').innerHTML = '<p>If there is an error, or you need to switch nations, <button id="embed-switch" class="btn btn-secondary btn-sm">login first</button></p>';
    document.getElementById('embed-switch').addEventListener('click', loginEmbed, false);
}

function collapseHeader() {
    "use strict";
    document.getElementById('header-toggle').removeEventListener('click', collapseHeader, false);
    document.getElementById('header-toggle').innerHTML = '<span class="fa fa-arrow-down" aria-hidden="true"></span> Expand';
    document.getElementById('header-inside').innerHTML = '<h1 class="display-4"><b>Versutian</b> Elections</h1>';
    document.getElementById('header').classList.remove('jumbotron');
    document.getElementById('header').classList.remove('jumbotron-fluid');
    document.getElementById('header').style.paddingTop = "1rem";
    document.getElementById('header').style.paddingBottom = "1rem";
    document.getElementById('header').style.marginBottom = "2rem";
    document.getElementById('header-toggle').addEventListener('click', expandHeader, false);
}

function expandHeader() {
    "use strict";
    document.getElementById('header-toggle').removeEventListener('click', expandHeader, false);
    document.getElementById('header-toggle').innerHTML = '<span class="fa fa-arrow-up" aria-hidden="true"></span> Collapse';
    document.getElementById('header-inside').innerHTML = '<h1 class="display-3"><b>Versutian</b> Elections</h1><p class="lead">Welcome to the official voting site for the Versutian Federation.</p><p>Here, you may cast your ballot for current elections to participate in our democracy with a simple two step process &mdash; no registration required.</p><a class="btn btn-secondary" href="faq.html">Learn more</a><br><br>';
    document.getElementById('header').classList.add('jumbotron');
    document.getElementById('header').classList.add('jumbotron-fluid');
    document.getElementById('header').style.paddingTop = null;
    document.getElementById('header').style.paddingBottom = null;
    document.getElementById('header').style.marginBottom = null;
    document.getElementById('header-toggle').addEventListener('click', collapseHeader, false);
}

function signOut() {
    "use strict";
    firebase.auth().signOut();
    chartMap.clear();
}

function initApp() {
    "use strict";
    document.getElementById('header-toggle').addEventListener('click', collapseHeader, false);
    firebase.auth().onAuthStateChanged(function (user) {
        var elections = document.getElementById('elections');
        if (user) {
            internalName = user.uid;
            var yourNation = nsRequest(internalName, ['name', 'flag']);
            nationName = yourNation.get('name');
            yourNationFlag = yourNation.get('flag');
            startElections();
            var electionsData = firebase.database().ref('elections/');
            electionsData.on('child_added', function(data) {
                addElection(data);
            });
            electionsData.on('child_removed', function(data) {
                unregisterElection(data);
            });
            if (accessLevel === "OFFICIAL" || accessLevel === "PROTECTOR") {
                elections.innerHTML += '<hr>';
                elections.innerHTML += '<h2>Create new election</h2>';
                elections.innerHTML += '<form><div class="form-group"><input type="text" class="form-control" id="election-name" placeholder="Election name"></div><div class="form-group"><label>Candidates</label><input type="text" class="form-control" id="election-name" placeholder="Nation name"> <br><input type="text" class="form-control" id="election-name" placeholder="Nation name"></div></form> <br><button class="btn btn-primary" onclick="add()">Create election</button><br>';
            }
        } else {
            elections.innerHTML = '<h1>Login with NationStates</h1><div id="login-form"><form><div class="form-group" id="nation-name-group"><input type="text" class="form-control form-control-lg" id="nation-name" aria-describedby="nationHelpBlock" placeholder="Nation name"><div id="nation-name-feedback"></div><p id="nationHelpBlock" class="form-text text-muted">Your nation\'s short name, as it is displayed on NationStates, for example, <b>Akohos</b>.</p></div></form><br><iframe src="https://embed.nationstates.net/page=verify_login#proof_of_login_checksum" style="border:none; height: 33vh; width: 100%" id="ns-embed"></iframe><div id="embed-text"><p>If there is an error, or you need to switch nations, <button id="embed-switch" class="btn btn-secondary btn-sm">login first</button></p></div><br><form><div class="form-group" id="verification-code-group"><input type="text" class="form-control" id="verification-code" aria-describedby="codeHelpBlock" placeholder="Code"><div id="verification-code-feedback"></div><p id="codeHelpBlock" class="form-text text-muted">Copy the code you see from the NationStates.net page into this box.</p></div></form><br><button class="btn btn-primary" onclick="verify()">Login</button></div><br><br>';
            document.getElementById('embed-switch').addEventListener('click', loginEmbed, false);
        }
    });
}

window.onload = function () {
    "use strict";
    initApp();
};