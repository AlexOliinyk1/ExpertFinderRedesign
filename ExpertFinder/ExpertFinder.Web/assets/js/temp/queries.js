var _GB_ = {

    path: 'https://expertfinder-dev.smartransfer.de/API/',

    user_id: 0,
    page_id: 1,
    section: null,
    oauth_verifier: null,
    token: null,

    userDeviceArray: [
   	{ device: 'Android', platform: /Android/ },
   	{ device: 'iPhone', platform: /iPhone/ },
   	{ device: 'iPad', platform: /iPad/ },
   	{ device: 'Symbian', platform: /Symbian/ },
   	{ device: 'Windows Phone', platform: /Windows Phone/ },
   	{ device: 'Tablet OS', platform: /Tablet OS/ }
    //{device: 'Linux', platform: /Linux/},
   	//{device: 'Windows', platform: /Windows NT/},
   	//{device: 'Macintosh', platform: /Macintosh/}
    ],

    platform: navigator.userAgent,

    //Define is it mobile device or not
    IsMobile: function () {
        for (var i in this.userDeviceArray) {
            if (this.userDeviceArray[i].platform.test(this.platform)) {
                return true;
            }
        }
        return false;
    },

    initGet: function () {
        if (window.location.search.substr(1).split("&") != 0) {
            var parts = window.location.search.substr(1).split("&");
            var $JS_GET = {};
            for (var i = 0; i < parts.length; i++) {
                var temp = parts[i].split("=");
                $JS_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
            }
            return $JS_GET;
        }
        else {
            return null;
        }
    },

    //Get social network verifier
    getVerifier: function () {
        if (this.initGet() != null) {
            this.oauth_verifier = (this.initGet().oauth_verifier);
            return true;
        }
        else {
            return false;
        }
    },

    encodeUrl: function (str) {
        str = str.replace(/\./g, "@2E");
        str = str.replace(/\?/g, "@3F");
        return str;
    },

    decodeUrl: function (str) {
        str = str.replace(/@2E/g, ".");
        str = str.replace(/@3F/g, "?");
        return str;
    },

    //Get stats from server for chart
    getStats: function () {
        var _data = new FormData();
        _data.append('json', '');
        $.ajax({
            url: _GB_.path + 'statistics',
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log(data);
                statsDataArray = [];
                statsCategoriesArray = [];
                var localObj = JSON.parse(data);

                var colors = Highcharts.getOptions().colors;
                $.each(localObj, function (iter, obj) {
                    statsCategoriesArray.push(obj.name);
                    var numberOfSkills = 0, skillCategories = [], ySkillValue = [];
                    for (var i = 0; i < obj.stats.length; i++) {
                        numberOfSkills += Number(obj.stats[i].num);
                        skillCategories[i] = obj.stats[i].name;
                        ySkillValue[i] = obj.stats[i].num;
                    }
                    var yValue = numberOfSkills, nameValue = obj.name + " skills";

                    var catObject = {
                        y: yValue,
                        color: colors[iter],
                        drilldown: {
                            name: nameValue,
                            categories: skillCategories,
                            data: ySkillValue,
                            color: colors[iter]
                        }
                    }
                    statsDataArray.push(catObject);
                });

                chartInit(statsDataArray, statsCategoriesArray);
            },
            error: function (data) { console.log(data); }
        });
    }

}

//Dialog windows
var _POPUP_ = {

    //Construct dialog box
    init: function (type, text, buttonText, action, autoFadeOut) {
        var popup = "<div id='lightbox_popup'></div><div class='popup " + type + "'>" + text + "<button onclick='javascript:_POPUP_." + action + "($(this).parent());'>" + buttonText + "</button></div>";
        if (autoFadeOut) {
            setTimeout(_POPUP_.destroy, 3000);
        }
        return popup;
    },

    close: function ($elem) {
        $elem.fadeOut(200, function () {
            $(this).remove();
            $('#lightbox_popup').remove();
        });
    },

    destroy: function () {
        $('.popup').fadeOut(200, function () {
            $(this).remove();
            $('#lightbox_popup').remove();
        });
    }

}

//Auth object
_AUTH_ = {

    //Log out
    logout: function () {
        $.ajax({
            url: '/server/core/actions.php',
            type: 'POST',
            dataType: 'text',
            data: { type: "logout" },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                if (data == 1) {
                    window.location.href = '/feeds';
                }
                else if (data == 0) {
                    $('html').css('cursor', 'auto');
                    $('#invalid_field').show();
                }
            }
        });
    },

    profileObj: null,
    //Profile class
    Profile: function (id, name, surname, image_url) {
        var self = this;

        this.id = id;
        this.name = name;
        this.surname = surname;
        this.image_url = image_url;
    },

    //Identifying user, get name and image
    getUserData: function () {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "user_id": _GB_.user_id }));
        $.ajax({
            url: _GB_.path + 'sessions/logout',
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var obj = JSON.parse(data);

                _AUTH_.profileObj = new _AUTH_.Profile(obj.user_id, obj.firstname, obj.surname, obj.image_url);
                $('#userPic img').attr('src', obj.image_url);
                $('.nameSurname').html(obj.firstname + " " + obj.surname);
                if (obj.role == "Admin") {
                    $('<option class="adminPage" value="admin">' + locale[lang].Administrator + '</option>').insertAfter('option.settingPage');
                    $('<a href="/admin"><li style="background-image: url(/img/lock.png);">' + locale[lang].Administrator + '</li></a>').insertAfter('a.settingPage');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

}

_NAV_ = {

    last: 0,
    count: 0,
    load: false,
    //Get requests, messages, updates
    list: function (type, id, list) {
        var number = 0;
        var last = 0;
        if (list) {
            this.load = true;
            last = this.last;
            number = 20;
        }
        else {
            $('#' + id + ' ul').html("");
            number = 10;
        }
        $('#' + id).append('<div class="list_loader"></div>');
        $.ajax({
            url: _GB_.path + type,
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            crossDomain: true,
            mimeType: "multipart/form-data",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                if (list) {
                    _NAV_.count = 0;
                }
                $('#' + id + ' .list_loader').remove();
                $('#' + id + ' .no_data').remove();

                if (type.includes("updates")) {
                    var no_records = true;
                    $.each(JSON.parse(data), function (idx, obj) {
                        $('#' + id + ' ul').append('<li class="notification">' +
							'<div class="user_img"><a href="/profile/' + obj.profile_id + '" class="user_cover_img"><img src="' + obj.image_url + '" /></a></div>' +
							'<div class="not_text"><span>' + obj.firstname + ' ' + obj.surname + '</span> ' + obj.action + '</div>' +
							'<div class="not_date">' + obj.date + '</div>' +
						'</li>');
                        if (list) {
                            _NAV_.count++;
                            _NAV_.last++;
                        }
                        no_records = false;
                    });
                    if (no_records) {
                        $('#' + id).append('<div class="no_data">No Data</div>');
                        //$('#' + id).append('<div class="no_data">' + locale[lang].NoRecordsMessage + '</div>');
                    }
                }
                else if (type.includes("messages")) {
                    var no_records = true;
                    var localObj = JSON.parse(data);
                    $.each(localObj.data, function (idx, obj) {
                        if (obj.type == "regular") {
                            var title = '<div style="font-weight: 600; color: #666; width: 100%;" class="label_subject">' + obj.title + '</div>';
                            if (obj.read) {
                                title = '<div style="font-weight: 400; color: #666; width: 100%;" class="label_subject">' + obj.title + '</div>';
                            }
                            var text = obj.text;
                            var shortText = "";
                            var readButton = '<span class="show_option" msg-id="' + obj.message_id + '">' + locale[lang].ShowMore + '</span>';
                            var lessButton = "<span class='show_option'>" + locale[lang].ShowLess + "</span>";
                            var extra_buttons = '<button class="reply act_button send_message" style="margin: 0; margin-top: 10px; font-weight: 600; font-size: 12px; text-transform: none;" value="' + obj.sender_id + '">' + locale[lang].Reply + '</button>';
                            if (list) {
                                if (text.length > 120) {
                                    shortText = text.substring(0, 120) + "...";
                                }
                                else {
                                    shortText = text;
                                    if (!obj.read) {
                                        readButton = '<span class="show_option" msg-id="' + obj.message_id + '">' + locale[lang].MarkAsRead + '</span>';
                                    }
                                    else {
                                        readButton = "";
                                    }
                                    lessButton = "";
                                }
                                if (obj.favorite) {
                                    extra_buttons += '<button class="favorite remove pass_button" style="margin: 16px 0px 6px 10px;" value="' + obj.message_id + '">' + locale[lang].Favorite + '</button>';
                                }
                                else {
                                    extra_buttons += '<button class="favorite add pass_button" style="margin: 16px 0px 6px 10px;" value="' + obj.message_id + '">' + locale[lang].Favorite + '</button>';
                                }
                            }
                            else {
                                if (text.length > 60) {
                                    shortText = text.substring(0, 60) + "...";
                                }
                                else {
                                    shortText = text;
                                    if (!obj.read) {
                                        readButton = '<span class="show_option" msg-id="' + obj.message_id + '">' + locale[lang].MarkAsRead + '</span>';
                                    }
                                    else {
                                        readButton = "";
                                    }
                                    lessButton = "";
                                }
                            }
                            if (type.includes("outbox")) {
                                extra_buttons = "";
                                if (text.length < 120) {
                                    readButton = "";
                                }
                            }
                            $('#' + id + ' ul').append('<li class="notification">' +
								'<div class="user_img"><a href="/profile/' + obj.profile_id + '" class="user_cover_img"><img src="' + obj.image_url + '" /></a></div>' +
								'<div class="not_text">' +
									'<div style="font-weight: 600; width: 100%;" class="fas">' + obj.firstname + ' ' + obj.surname + '</div>' +
									title + '<div style="width: 100%; color: #666; font-size: 12px; line-height: 16px; margin-top: 10px;" class="shortText">' + shortText + ' ' + readButton + '</div>' +
									'<div style="width: 100%; color: #666; font-size: 12px; line-height: 16px; margin-top: 10px; display: none;" class="wholeText">' + text + ' ' + lessButton + '</div>' +
									extra_buttons +
								'</div>' +
								'<div class="not_date">' + obj.date + '</div>' +
							'</li>');
                        }
                        else if (obj.type == "appointment") {
                            var title = '<div style="font-weight: 600; color: #666; width: 100%;" class="label_subject">' + obj.title + '</div>';
                            if (obj.read) {
                                title = '<div style="font-weight: 400; color: #666; width: 100%;" class="label_subject">' + obj.title + '</div>';
                            }
                            var text = obj.text;
                            var shortText = "";
                            var readButton = '<span class="show_option" msg-id="' + obj.message_id + '">' + locale[lang].ShowMore + '</span>';
                            var lessButton = "<span class='show_option'>" + locale[lang].ShowLess + "</span>";
                            var extra_buttons = '<div style="margin-top: 10px;">' +
										'<button class="apply act_button" style="margin: 0; margin-right: 10px; font-weight: 600; font-size: 12px;" value="' + obj.message_id + '">' + locale[lang].Accept + '</button>' +
										'<button class="deny pass_button" style="margin-right: 10px; font-weight: 600; font-size: 12px;" value="' + obj.message_id + '">' + locale[lang].Deny + '</button>' +
										'<button class="new_time pass_button" style="margin-right: 10px; font-weight: 600; font-size: 12px;" value="' + obj.message_id + '">' + locale[lang].ProposeNewTime + '</button>';
                            if (list) {
                                if (text.length > 120) {
                                    shortText = text.substring(0, 120) + "...";
                                }
                                else {
                                    shortText = text;
                                    if (!obj.read) {
                                        readButton = '<span class="show_option" msg-id="' + obj.message_id + '">' + locale[lang].MarkAsRead + '</span>';
                                    }
                                    else {
                                        readButton = "";
                                    }
                                    lessButton = "";
                                }
                                if (obj.favorite) {
                                    extra_buttons += '<button class="favorite remove pass_button" value="' + obj.message_id + '">' + locale[lang].Favorite + '</button></div>';
                                }
                                else {
                                    extra_buttons += '<button class="favorite add pass_button" value="' + obj.message_id + '">' + locale[lang].Favorite + '</button></div>';
                                }
                            }
                            else {
                                if (text.length > 60) {
                                    shortText = text.substring(0, 60) + "...";
                                }
                                else {
                                    shortText = text;
                                    if (!obj.read) {
                                        readButton = '<span class="show_option" msg-id="' + obj.message_id + '">' + locale[lang].MarkAsRead + '</span>';
                                    }
                                    else {
                                        readButton = "";
                                    }
                                    lessButton = "";
                                }
                            }
                            if (type.includes("outbox")) {
                                extra_buttons = "";
                                if (text.length < 120) {
                                    readButton = "";
                                }
                            }
                            $('#' + id + ' ul').append('<li class="notification">' +
								'<div class="user_img"><a href="/profile/' + obj.profile_id + '" class="user_cover_img"><img src="' + obj.image_url + '" /></a></div>' +
								'<div class="not_text">' +
									'<div style="font-weight: 600; width: 100%;" class="fas">' + obj.firstname + ' ' + obj.surname + '</div>' +
									'<div style="font-weight: 600; width: 100%;">' + locale[lang].AskedForAnAppointment + '</div>' +
									'<div class="appointment_date">' + obj.appointment_date + '</div>' +
									title + '<div style="width: 100%; color: #666; font-size: 12px; line-height: 16px; margin-top: 10px;" class="shortText">' + shortText + ' ' + readButton + '</div>' +
									'<div style="width: 100%; color: #666; font-size: 12px; line-height: 16px; margin-top: 10px; display: none;" class="wholeText">' + text + ' ' + lessButton + '</div>' +
									extra_buttons +
								'</div>' +
								'<div class="not_date">' + obj.date + '</div>' +
							'</li>');
                        }
                        if (list) {
                            _NAV_.count++;
                            _NAV_.last++;
                        }
                        no_records = false;
                    });
                    if (no_records) {
                        $('#' + id).append('<div class="no_data">No Data</div>');
                    }
                }
                else if (type.includes("requests")) {
                    var no_records = true;
                    var localObj = JSON.parse(data);

                    $.each(localObj.data, function (idx, obj) {
                        var skills = "";
                        var buttons = '<button class="add_skills act_button" style="margin: 0; margin-right: 10px; font-weight: 600; font-size: 12px;" value="' + obj._id + '">' + locale[lang].AddSkillsToProfile + '</button>' +
						'<button class="deny_skills pass_button" style="margin-right: 10px; font-weight: 600; font-size: 12px;" value="' + obj._id + '">' + locale[lang].Deny + '</button>' +
						'<button class="review pass_button" onclick="javascript:window.location.href = \'/requests\'" style="margin-right: 10px; font-weight: 600; font-size: 12px;" value="' + obj._id + '">' + locale[lang].Review + '</button>';
                        if (list) {
                            obj.skills.forEach(function (item, i, arr) {
                                var fullSkillJSON = JSON.stringify(item);
                                skills += "<div class='skill' fullSkillJSON='" + fullSkillJSON + "'><div class='delete_skill'></div>" + item.name + "</div>";
                            });
                            buttons = '<button class="add_some_skills act_button" style="margin: 0; margin-right: 20px; font-weight: 600; font-size: 12px;" value="' + obj._id + '" usr-id="' + obj.sender_id + '">' + locale[lang].AddOneOrMoreSkills + '</button>' +
							'<button class="deny_skills pass_button" style="margin-right: 0px; font-weight: 600; font-size: 12px;" value="' + obj._id + '">' + locale[lang].RejectAll + '</button>';
                        }
                        else {
                            obj.skills.forEach(function (item, i, arr) {
                                var fullSkillJSON = JSON.stringify(item);
                                skills += "<div class='skill' fullSkillJSON='" + fullSkillJSON + "'>" + item.name + "</div>";
                            });
                        }
                        $('#' + id + ' ul').append('<li class="notification">' +
							'<div class="user_img"><a href="/profile/' + obj.sender_id + '" class="user_cover_img"><img src="' + obj.sender_image_url + '" /></a></div>' +
							'<div class="not_text"><span>' + obj.sender_firstname + ' ' + obj.sender_surname + '</span> ' + obj.text + ' <div style="display: inline-block; width: 100%;" class="skills_set">' + skills + '</div>' +
    							'<div style="margin-top: 10px;">' + buttons + '</div>' +
							'</div>' +
							'<div class="not_date">' + obj.date + '</div>' +
						'</li>');
                        if (list) {
                            _NAV_.count++;
                            _NAV_.last++;
                        }
                        no_records = false;
                    });
                    if (no_records) {
                        $('#' + id).append('<div class="no_data">No Data</div>');
                    }
                }
                if (list) {
                    _NAV_.load = false;
                }
            },
            error: function (data, status) {
                console.log(data);
            }
        });
    }

}

_MSG_ = {

    //Mark message as read or not
    markMsg: function (id) {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ read: true }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/messages/' + id,
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    //Mark message as favorite or not
    markMsgFav: function (id, status) {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ favorite: status }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/messages/' + id,
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    usersList: [],
    usersListId: [],

    //Get list of proposed users as recipient
    getUserList: function () {
        this.usersList = [];
        this.usersListId = [];
        $.ajax({
            url: _GB_.path + 'profiles',
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var i = 0;
                var localObj = JSON.parse(data);
                console.log(localObj);
                $.each(localObj.data, function (idx, obj) {
                    _MSG_.usersList[i] = obj.firstname + " " + obj.surname;
                    _MSG_.usersListId[i] = obj._id;
                    i++;
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    //Show only appropriate users based on search query
    searchUser: function (text) {
        var max = 0;
        var result = "";
        var count = 0;
        $.each(this.usersList, function (index, val) {
            valUpper = val.toUpperCase();
            var ind = valUpper.search(text.toUpperCase());
            if (ind != -1 && _MSG_.usersListId[index] != _GB_.user_id) {
                if (ind > max) {
                    result += "<div class='recUser'>" + val + "<input type='hidden' value='" + _MSG_.usersListId[index] + "'/></div>";
                    max = ind;
                }
                else {
                    result = "<div class='recUser'>" + val + "<input type='hidden' value='" + _MSG_.usersListId[index] + "'/></div>" + result;
                }
                count++;
            }
        });
        if (count == 0) {
            result = "<div class='no_results'>" + locale[lang].NoResultsMessage + "</div>"
        }
        result = "<div id='userList'>" + result;
        result += "</div>";
        return result;
    },

    showAllRecipients: function () {
        var result = "";
        var count = 0;
        $.each(this.usersList, function (index, val) {
            count++;
            if (_MSG_.usersListId[index] != _GB_.user_id) {
                result += "<div class='recUser'>" + val + "<input type='hidden' value='" + _MSG_.usersListId[index] + "'/></div>";
            }
        });
        if (count == 0) {
            result = "<div class='no_results'>" + locale[lang].NoResultsMessage + "</div>"
        }
        result = "<div id='userList'>" + result;
        result += "</div>";
        return result;
    },

    //Accept suggested appointment
    acceptAppointment: function (id) {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "read": true }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/messages/' + id,
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    //Deny suggested appointment
    denyAppointment: function (id) {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "read": true }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/messages/' + id,
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    //Send message
    sendMessage: function (rec_id, title, text, files, names) {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "user_id": _GB_.user_id, "recipient_id": rec_id, "type": "regular", "title": title, "text": text, "hashnames": files, "filenames": names }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/messages',
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                $('#lightbox').fadeOut(200).removeClass('prevented');
                $('.message_box').fadeOut(200, function () {
                    $('body').append(_POPUP_.init("success", locale[lang].MessageSent, locale[lang].OK, locale[lang].Close, true));
                    $('.file_block').remove();
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    //Send appointment
    sendAppointment: function (rec_id, date, title, text, files, names) {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "user_id": _GB_.user_id, "recipient_id": rec_id, "type": "appointment", "title": title, "text": text, "appointment_date": date, "hashnames": files, "filenames": names }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/messages',
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                $('#lightbox').fadeOut(200).removeClass('prevented');
                $('.message_box').fadeOut(200, function () {
                    $('body').append(_POPUP_.init("success", locale[lang].MessageSent, locale[lang].OK, locale[lang].Close, true));
                    $('.file_block').remove();
                });
            },
            error: function (data) {
                console.log(data.responseText);
            }
        });
    },

    checkBoxState: function ($box) {
        var flag = false;
        $box.find('input, textarea').each(function (e) {
            if ($(this).val().trim() != "") {
                flag = true;
            }
        });

        if (flag) {
            $('body').prepend("<div class='popup warning'>" + lang['en'].CloseNotFinishedQuestion +
			"<button class='half_button confirm_button popup_message'>" + locale[lang].Yes + "</button><button class='half_button cancel_button'>" + locale[lang].Cancel + "</button></div>");
            $('body').prepend('<div id="lightbox_popup"></div>');
            return false;
        }
        else {
            return true;
        }
    }

}

_REQ_ = {

    //Remove suggested skills
    denyReq: function (user_id, id) {
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/requests/' + id,
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    //Accept suggested skills partially
    acceptPartiallyReq: function (user_id, req_id, skills) {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "skills": skills }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/requests/' + req_id,
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
            },
            error: function (data) {
                console.log(data);
            }
        });
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/skills',
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

}

_SEARCH_ = {

    filters: {
        "Role_profile": [],
        "Department": [],
        "Experience": []
    },

    init: function () {
        this.last = 0;
        this.count = 0;
        $('#search_block').html("");
    },

    type: "profiles",
    last: 0,
    count: 0,
    load: false,
    //Get the list of appropriate users based on search query
    list: function (text) {
        this.load = true;
        $('#search_block').append('<div class="list_loader"></div>');
        $.ajax({
            url: _GB_.path + 'search/' + _SEARCH_.type + '?searchstring=' + text
            	+ '&offset=' + this.last + '&limit=20' + '&filters=' + encodeURI(JSON.stringify(_SEARCH_.filters)),
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log(data);
                _SEARCH_.count = 0;
                $('#search_block .list_loader').remove();
                $('#search_block .no_data').remove();
                var no_records = true;
                var localObj = JSON.parse(data);
                if (_SEARCH_.type == "profiles") {
                    $.each(localObj.data, function (idx, obj) {
                        var skills = "";
                        for (var key in obj.tags) {
                            if (obj.tags.hasOwnProperty(key)) {
                                skills += "<div class='rt_skill'>" + obj.tags[key] + "</div>";
                            }
                        }

                        //for(var i = 0; i < obj.tags.length; i++) {
                        //	skills += "<div class='rt_skill'>"+obj.tags[i]+"</div>";
                        //}
                        $('#search_block').append('<div class="rt_block">' +
                                    '<div class="user_img"><a href="/profile/' + obj._id + '"><img src="' + obj.image_url + '" /></a></div>' +
                                    '<div class="user_name"><a href="/profile/' + obj._id + '">' + obj.firstname + ' ' + obj.surname + '</a></div>' +
                                    '<div class="rt_skills">' + skills + '</div>' +
                                    '<div class="rt_desc"><small>' + locale[lang].MatchedTermsFoundInProfile + ':</small>' + obj.text + '</div>' +
                                    //'<div class="rt_rate">Score: '+obj.score+'%</div>'+
                                '</div>');
                        _SEARCH_.last++;
                        _SEARCH_.count++;
                        no_records = false;
                    });
                }
                else if (_SEARCH_.type == "projects") {
                    $.each(localObj.data, function (idx, obj) {
                        $('#search_block').append('<div class="rt_block">' +
                                    '<div class="user_img"><a href="/project/' + obj._id + '"><img src="' + obj.image_url + '" /></a></div>' +
                                    '<div class="user_name"><a href="/project/' + obj._id + '">' + obj.name + '</a></div>' +
                                    '<div class="rt_skills"><div class="rt_skill"><span>' + locale[lang].Category + ':</span> ' + obj.category.name + '</div>' +
                                            '<div class="rt_skill"><span>' + locale[lang].Branch + ':</span> ' + obj.branch.name + '</div><div class="rt_skill"><span>' + locale[lang].Customer + ':</span> ' + obj.customer.name + '</div></div>' +
                                    '<div class="rt_desc"><small>' + locale[lang].Description + ':</small>' + obj.desc + '</div>' +
                                    //'<div class="rt_rate">Score: '+obj.score+'%</div>'+
                                '</div>');
                        _SEARCH_.last++;
                        _SEARCH_.count++;
                        no_records = false;
                    })
                    ;
                }
                else if (_SEARCH_.type == "nuggets") {
                    $.each(localObj.data, function (idx, obj) {
                        $('#search_block').append('<div class="rt_block">' +
                                    '<div class="user_img"><a href="/nugget/' + obj._id + '"><img src="' + obj.author.image_url + '" /></a></div>' +
                                    '<div class="user_name"><a href="/nugget/' + obj._id + '">' + obj.title + '</a></div>' +
                                    '<div class="rt_skills"><div class="rt_skill"><span>' + locale[lang].Type + ':</span> ' + obj.type + '</div>' +
                                            '<div class="rt_skill"><span>' + locale[lang].Author + ':</span> ' + obj.author.firstname + " " + obj.author.surname + ' </div><div class="rt_skill"><span>' + locale[lang].Date + ':</span> ' + obj.date + '</div></div>' +
                                    '<div class="rt_desc"><small>' + locale[lang].Text + ':</small>' + obj.text + '</div>' +
                                    //'<div class="rt_rate">Score: '+obj.score+'%</div>'+
                                '</div>');
                        _SEARCH_.last++;
                        _SEARCH_.count++;
                        no_records = false;
                    })
                    ;
                }

                _SEARCH_.load = false;
                if (no_records) {
                    if (localObj.suggestion != "") {
                        $('#search_block').append('<div class="no_data">' + locale[lang].NotFoundYouMeanMessage + ' <a href="/search/' + localObj.suggestion + '">' + localObj.suggestion + '</a></div>');
                    }
                    else {
                        $('#search_block').append('<div class="no_data">' + locale[lang].NotFoundMessage + '</div>');
                    }
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

};

_PF_ = {

    //Get user profile
    getProfile: function () {
        $('#profile_info').html('<div class="list_loader live_loader"></div>');
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.section,
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var obj = JSON.parse(data);
                console.log(obj);
                var tags = "";
                //Tags processing
                var i_tag = 0;
                $.each(obj.tags, function (ind, val) {
                    if (i_tag == 0) {
                        tags += "<div id='all_tags'><h6>" + locale[lang].Tags + "</h6><div class='tag_user'><small>" + ind + "</small>" + val + "</div>";
                    }
                    else {
                        tags += "<div class='tag_user'><small>" + ind + "</small>" + val + "</div>";
                    }
                    i_tag++;
                });
                if (i_tag != 0) {
                    tags += "</div>";
                }

                //Contact data processing
                var contacts = "<h6>" + locale[lang].Contacts + "</h6>";
                contacts += "<div class='contact_field'><small>" + locale[lang].Phone + "</small><a href='tel:" + obj.contact_data.phone + "'>" + obj.contact_data.phone + "</a></div>";
                contacts += "<div class='contact_field'><small>" + locale[lang].Email + "</small><a href='mailto:" + obj.contact_data.email + "'>" + obj.contact_data.email + "</a></div>";
                contacts += "<div class='contact_field'><small>" + locale[lang].Location + "</small><span id='goto_address'>" + obj.contact_data.address + "</span></div>";
                contacts += "<div class='contact_field hidden'><small>" + locale[lang].Mobile + "</small><a href='tel:" + obj.contact_data.mobile + "'>" + obj.contact_data.mobile + "</a></div>";
                contacts += "<div class='contact_field hidden'><small>" + locale[lang].Skype + "</small><a href='skype:" + obj.contact_data.skype + "'>" + obj.contact_data.skype + "</a></div>";
                contacts += "<div class='contact_field show_more'><span>" + locale[lang].ShowMore + "</span></div>";

                //Languages processing
                var langs = "";
                var i_lang = 0;
                $.each(obj.languages, function (ind, val) {
                    if (i_lang == 0) {
                        langs += "<div id='all_langs'><h6>" + locale[lang].Languages + "</h6><div class='lang_user'><small>" + locale[lang].Native + "</small>" + val['name_en'] + "</div>";
                    }
                    else {
                        langs += "<div class='lang_user'><small>" + locale[lang].Advanced + "</small>" + val['name_en'] + "</div>";
                    }
                    i_lang++;
                });
                if (i_lang != 0) {
                    langs += "</div>";
                }

                var sorted_skills = _PF_.skills(obj.skills);

                if (obj.skills.length == 0) {
                    if (_GB_.user_id == _GB_.section) {
                        sorted_skills = "<div class='no_content'><div>" + locale[lang].NoSkilsActiveUserMessage + "</div>" +
                                                        "<p>" + locale[lang].AddSkillTextFieldActiveUserMessage + "<br/>" + locale[lang].CheckYourSkillsActiveUserMessage + "</p></div>";
                    }
                    else {
                        sorted_skills = "<div class='no_content'><div>" + locale[lang].NoSkillsAddedMessage + "</div>" +
                                                        "<p>" + locale[lang].AddSkillsMessage + "</p></div>";
                    }
                }

                var edit_skills = '<input type="text" name="skill" id="input_skill" placeholder="' + locale[lang].AddNewSkillsMessage + '" /><button class="input_button" id="add_new_skills">' + locale[lang].Add + '</button>';
                var add_new_skills = '<button id="upload_skills">' + locale[lang].AddSkillFile + '</button>';
                var add_project = '<button id="add_project">' + locale[lang].AddProject + '</button>';
                var messages = '';
                var skill_input_length = '';
                //If this is profile page of another user
                if (_GB_.user_id != _GB_.section) {
                    edit_skills = '<input type="text" name="skill" id="input_skill" placeholder="' + locale[lang].EndorseSkills + '" style="width: calc(100% - 90px);" /><button id="endorse_button" class="input_button" style="width: 90px;">' + locale[lang].Endorse + '</button>';
                    skill_input_length = 'style="width: 100%;"';
                    add_new_skills = '';
                    add_project = '';
                    messages = '<div class="full_block" id="messages"><button id="create_message" value="' + _GB_.section + '">Compose message</button></div>';
                    $('h2').text(obj.firstname + " " + obj.surname + "'s profile");
                }
                //Construct final profile page
                $('#profile_info').html('<div id="right_user_cover"><div class="block_cover"><div class="user_img"><div class="square_img"><img src="' + obj.image_url + '" /></div></div>' +
							'<h4 id="user_name">' + obj.firstname + " " + obj.surname + '</h4><p class="about">' + obj.text + '</p>' +
							_PF_.metrics(obj.score, obj.projects.length, _PF_.numOfCat(obj.skills), obj.skills.length, "profile") + '</div>' +
	        		'<div class="block_cover profile_data" style="position: relative; height: 456px;">' +
							'<div class="tabs col_3"><div class="tab active" attr-ref="skills"><div class="tab_skills">' + locale[lang].Skills + '</div></div><div class="tab" attr-ref="projects"><div class="tab_projects">' + locale[lang].Projects + '</div></div><div class="tab" attr-ref="cv"><div class="tab_cv">' + locale[lang].CV + '</div></div></div>' +
							'<div class="full_block _new active" id="skills">' +
	        			'<div id="add_skills_block"><div id="add_skills_cover" ' + skill_input_length + '>' + edit_skills + '</div>' + add_new_skills + '</div>' + sorted_skills +
	        		'</div>' + _PF_.projects(obj.projects, add_project) + _PF_.cv(obj.education, obj.jobs, obj.certificates, obj.goals) + '</div>' + _PF_.files(obj.files) +
	        		'<div id="bottom_user_cover"></div></div>' +
							'<div id="left_user_cover">' +
		        			'<div class="full_block">' + messages + tags +
		        		'</div>' +
		        		'<div class="full_block" id="contacts">' + contacts + '</div>' + langs + '</div>');

                if (_GB_.IsMobile()) {
                    $('#bottom_user_cover').addClass('mobile_view');
                }

                _PF_.getAccounts();
                _PF_.showSimilarProfiles(_GB_.user_id, $('#bottom_user_cover'));
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    accounts: {},

    //Social block
    getAccounts: function () {
        if (_GB_.user_id == _GB_.section) {
            $('#social_block').remove();
            $.ajax({
                url: _GB_.path + 'profiles/' + _GB_.section + '/interfaces/credentials',
                type: 'GET',
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    return myXhr;
                },
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
                },
                success: function (data) {
                    var obj = JSON.parse(data);
                    console.log(obj);
                    _PF_.accounts = obj;
                    var html_str = '<div class="full_block" id="social_block"><h6>' + locale[lang].Accounts + '</h6>';
                    $.each(obj, function (ind, val) {
                        html_str += '<div class="social_field" id="' + String(ind).toLowerCase() + '_connect" value="' + String(ind) + '"><img src="/img/' + String(ind) + '.png" /><div class="account_full_name">' + String(ind) + '</div></div>';
                    });
                    html_str += "</div>";

                    $(html_str).insertAfter('#contacts');
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }
    },

    //Number of categories
    numOfCat: function (skills) {
        var categories = [];
        var num_of_cat = 0;
        $.each(skills, function (ind, val) {
            var flag = false;
            for (i = 0; i < categories.length; i++) {
                if (categories[i] == val.category.title_en) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                categories[num_of_cat] = val.category.title_en;
                num_of_cat++;
            }
        });

        return num_of_cat;
    },

    parentCategories: function (skills) {
        var categories = [];
        var num_of_cat = 0;
        $.each(skills, function (ind, val) {
            if (val.category.parents !== undefined) {
                var flag = false;
                for (i = 0; i < categories.length; i++) {
                    if (categories[i] == val.category.parents[0].parents[0].title_en) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    categories[num_of_cat] = val.category.parents[0].parents[0].title_en;
                    num_of_cat++;
                }
            }
        });

        return categories;
    },

    otherSkills: function (skills) {
        var skillsStr = "";
        $.each(skills, function (ind, val) {
            if (val.category.title_en == "Others") {
                var skill_name = val.name;
                var link = val.source;
                var project = val.project;
                var category = val.category.title_en;
                var _id = val._id;
                var fullSkillJSON = JSON.stringify(val);

                //if there is no source
                if (link == "none" || link.trim() == "") {
                    link = "#";
                }

                var mini_str = "";
                if (_GB_.user_id == _GB_.section) {
                    mini_str += "<div class='skill my_skills second_level' _id='" + _id + "'source='" + link + "' project='" + project + "' category='" + category + "' fullSkillJSON='" + fullSkillJSON + "'><div class='delete_skill'></div><a href='" + link + "' class='skill_text'>" + skill_name + "</a><button class='edit_skill_button'></button></div>";
                }
                else {
                    mini_str += "<div class='skill second_level' source='" + link + "' style='padding-left: 10px;'><a href='" + link + "' class='skill_text'>" + skill_name + "</a></div>";
                }
                skillsStr += mini_str;
            }
        });

        if (skillsStr != "") {
            skillsStr = "<div class='skill_set first_level' style='height: auto;' id='others_category'><div class='main_skill'><div class='skill'><div class='skill_rating'>" + _PF_.numberoOfOtherCategories(skills) + "</div>" + locale[lang].Others + "</div></div>" + skillsStr + "</div>";
        }

        return skillsStr;
    },

    numberoOfOtherCategories: function (skills) {
        var count = 0;
        $.each(skills, function (ind, val) {
            if (val.category.title_en == "Others") {
                count++;
            }
        });
        return count;
    },

    //Skills processing
    skills: function (skills) {

        //Getting parent categories
        var parent_block = "<div id='parent_block'>";
        if (_GB_.user_id == _GB_.section) {
            parent_block += "<div class='parent_elem' style='display: none;' attr-parent='New'>" + locale[lang].New + "</div>";
        }
        var parents = this.parentCategories(skills);
        var parent_array = [];
        for (i = 0; i < parents.length; i++) {
            var key = parents[i];
            var obj = {};
            obj[key] = [];
            parent_array.push(obj);
            var active_class = "";
            if (i == 0) {
                active_class = " active";
            }
            parent_block += "<div class='parent_elem" + active_class + "' attr-parent='" + parents[i] + "'>" + parents[i] + "</div>";
        }
        if (_PF_.numberoOfOtherCategories(skills) > 0) {
            var active_class = "";
            if (parents.length == 0) {
                active_class = " active";
            }
            parent_block += "<div class='parent_elem" + active_class + "' attr-parent='Others'>" + locale[lang].Others + "</div>";
        }
        parent_block += "</div>";

        var subparent = [];
        var num_of_sub = 0;
        $.each(skills, function (ind, val) {
            if (val.category.parents !== undefined) {
                var flag = false;
                for (i = 0; i < subparent.length; i++) {
                    if (subparent[i].title == val.category.parents[0].title_en) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    subparent[num_of_sub] = { "title": val.category.parents[0].title_en, "parent": val.category.parents[0].parents[0].title_en };
                    num_of_sub++;
                }
            }
        });

        var categories = [];
        var num_of_cat = 0;
        $.each(skills, function (ind, val) {
            if (val.category.parents !== undefined) {
                var flag = false;
                for (i = 0; i < categories.length; i++) {
                    if (categories[i] == val.category.title_en) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    categories[num_of_cat] = val.category.title_en;
                    num_of_cat++;
                }
            }
        });

        var sorted_skills = "";
        for (j = 0; j < subparent.length; j++) {
            var sub_str = "";
            var local_num_of_cat = 0;
            var existing_cat = [];
            for (i = 0; i < categories.length; i++) {
                var mini_str = "";
                var local_num_of_skills = 0;
                $.each(skills, function (ind, val) {
                    if (val.category.parents !== undefined) {
                        if (val.category.parents[0].title_en == subparent[j].title) {
                            if (val.category.title_en == categories[i]) {
                                var flag = false;
                                for (var k = 0; k < existing_cat.length; k++) {
                                    if (existing_cat[k] == val.category.title_en) {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (!flag) {
                                    local_num_of_cat++;
                                    existing_cat.push(val.category.title_en);
                                }
                                local_num_of_skills++;
                                var skill_name = val.name;
                                var link = val.source;
                                var project = val.project;
                                var category = val.category.title_en;
                                var _id = val._id;
                                var fullSkillJSON = JSON.stringify(val);

                                //if there is no source
                                if (link == "none" || link.trim() == "") {
                                    link = "#";
                                }

                                if (_GB_.user_id == _GB_.section) {
                                    mini_str += "<div class='third_level'><div class='skill my_skills' _id='" + _id + "' source='" + link + "' project='" + project + "' category='" + category + "' fullSkillJSON='" + fullSkillJSON + "'><div class='delete_skill'></div><a href='" + link + "' class='skill_text'>" + skill_name + "</a><button class='edit_skill_button'></button></div></div>";
                                }
                                else {
                                    mini_str += "<div class='third_level'><div class='skill' source='" + link + "' style='padding-left: 10px;'><a href='" + link + "' class='skill_text'>" + skill_name + "</a></div></div>";
                                }
                            }
                        }
                    }
                });
                if (local_num_of_skills != 0) {
                    sub_str += "<div class='skill_set second_level'><div class='main_skill'><div class='skill'><div class='skill_rating'>" + local_num_of_skills + "</div>" + categories[i] + "</div></div>" + mini_str + "</div>";
                }
            }
            if (local_num_of_cat != 0) {
                var obj = subparent[j].parent;
                for (m = 0; m < parent_array.length; m++) {
                    $.each(parent_array[m], function (ind, val) {
                        if (obj == String(ind)) {
                            val.push("<div class='skill_set first_level'><div class='main_skill'><div class='skill'><div class='skill_rating'>" + local_num_of_cat + "</div>" + subparent[j].title + "</div></div>" + sub_str + "</div>");
                        }
                    });
                };
            }
        }

        var skills_block = "";
        for (var i = 0; i < parent_array.length; i++) {
            $.each(parent_array[i], function (ind, val) {
                var active_class = "";
                if (i == 0) {
                    active_class = " active";
                }
                skills_block += "<div class='per_skills_block" + active_class + "' attr-parent='" + String(ind) + "'>";
                for (var j = 0; j < val.length; j++) {
                    skills_block += val[j];
                }
                skills_block += "</div>";
            });
        }
        if (_PF_.numberoOfOtherCategories(skills) > 0) {
            var active_class = "";
            if (parent_array.length == 0) {
                active_class = " active";
            }
            skills_block += "<div class='per_skills_block" + active_class + "' attr-parent='Others'>" + _PF_.otherSkills(skills) + "</div>";
        }
        sorted_skills += skills_block;

        sorted_skills = "<div id='cat_skill_block'>" + sorted_skills + "</div>";

        var html_str = parent_block + sorted_skills;
        if (_GB_.user_id != _GB_.section) {
            html_str = '<div id="endorse_skills"><button id="endorse_all">' + locale[lang].EndorseAll + '</button></div>' + html_str;
        }
        else {
            if ($('#profile_info .full_block #loading_skills').length == 0) {
                html_str = "<div id='loading_skills'></div>" + html_str;
            }
        }

        return html_str;
    },

    //Metrics of user for profile page
    metrics: function (score, projects, categories, skills, type) {
        var elem = null;
        if (type == "profile") {
            elem = "<div class='full_block _new' id='metrics'>" +
					   	    "<div class='metric score_metric' style='background-image: url(/img//profile/score.png);'><div class='num_metric'>" + score + "<span>%</span></div><div class='label_metric'><div class='metric_img'>" + locale[lang].Score + "</div></div></div>" +
					   	    "<div class='metric projects_metric' style='background-image: url(/img/profile/projects.png);'><div class='num_metric'>" + projects + "</div><div class='label_metric'><div class='metric_img'>" + locale[lang].Projects + "</div></div></div>" +
					   	    "<div class='metric categories_metric' style='background-image: url(/img/profile/categories.png);'><div class='num_metric'>" + categories + "</div><div class='label_metric'><div class='metric_img'>" + locale[lang].Categories + "</div></div></div>" +
					   	    "<div class='metric skills_metric' style='background-image: url(/img/profile/skills.png);'><div class='num_metric'>" + skills + "</div><div class='label_metric'><div class='metric_img'>Skills</div></div></div>" +
					   	"</div>";
        }
        else if (type == "project") {
            elem = "<div class='full_block' id='metrics'>" +
					   	    "<div class='metric categories_metric' style='width: 50%;'><div class='num_metric'>" + categories + "</div><div class='label_metric'><div class='metric_img' style='background-image: url(/img/category_icon.png);'>" + locale[lang].Categories + "</div></div></div>" +
					   	    "<div class='metric skills_metric' style='width: 50%;'><div class='num_metric'>" + skills + "</div><div class='label_metric'><div class='metric_img' style='background-image: url(/img/skill_icon.png);'>Skills</div></div></div>" +
					   	"</div>";
        }
        return elem;
    },

    //Projects processing for profile page
    projects: function (projects, add_project) {
        add_project = add_project || "";
        var elem = "";
        var iter = 0;
        $.each(projects, function (ind, val) {
            iter++;
            if (ind == 0) {
                elem = "<div class='full_block _new' id='projects'><div style='width: 94%; margin: 0px 3% 20px;' class='projects_container'>";
            }
            var extra_elem = '';
            if (_GB_.user_id == _GB_.section && _GB_.page_id == 6) {
                extra_elem = '<button class="delete_obj" value="project"></button>';
            }
            elem += "<div class='project'>" + extra_elem + "<div class='project_img'><img src='/img/project_icon.png' /></div><a href='/project/" + val.name + "' attr-source='" + val.name + "'>" + val.name + "</a></div>";
        });

        if (iter != 0) {
            elem += "</div>" + add_project + "</div>";
        }

        if (projects.length == 0) {
            if (_GB_.user_id == _GB_.section && _GB_.page_id == 6) {
                elem = "<div class='full_block _new' id='projects'><div class='no_content'><div>" + locale[lang].NoProjectsActiveUserMessage + "</div>" +
												"<p>" + locale[lang].AddProjectActiveUserMessage + "</p></div>" + add_project + "</div>";
            }
            else {
                elem = "<div class='full_block _new' id='projects'><div class='no_content'><div>" + locale[lang].NoProjectsMessage + "</div>" +
												"<p>" + locale[lang].NoConnectedProjectsMessage + "</p></div></div>";
            }
        }

        return elem;
    },

    //Existing files processing for profile page
    files: function (files) {
        var elem = "";
        var iter = 0;
        $.each(files, function (ind, val) {
            iter++;
            if (ind == 0) {
                elem = "<div class='block_cover'><div class='full_block hidden' id='files'><h6 style='margin: 20px 3%; width: 94%;'>" + locale[lang].Files + "&nbsp<span style='float: none;'>(" + files.length + ")</span></h6><div id='show_files'>" + locale[lang].ShowFiles + "</div><div style='width: 94%; margin: 0px 3%;'>";
            }
            var extra_elem = '';
            var download_button_style = 'style="right: 0px;"';
            if (_GB_.user_id == _GB_.section && _GB_.page_id == 6) {
                extra_elem = '<button class="delete_obj" value="file"></button>';
                download_button_style = '';
            }
            var filename = val.url.split('/');
            elem += "<div class='file_set'><div><a href='" + val.url + "' target=_blank class='file_name'>" + val.originalName + "</a></div><a " + download_button_style + " href='/server/core/download.php?url=" + filename[filename.length - 1] + "' class='file_download'></a>" + extra_elem + "</div>";
        });

        if (iter != 0) {
            elem += "</div></div></div>";
        }
        return elem;
    },

    //CV processor
    cv: function (education, jobs, certificates, goals) {
        var elem = '';
        var addCVData = "";
        if (education.length == 0 && jobs.length == 0 && certificates.length == 0 && goals.length == 0) {
            if (_GB_.user_id == _GB_.section && _GB_.page_id == 6) {
                addCVData = "<div id='cv_controls'><button class='open_social_account' style='background-image: url(/img/Xing.png); background-color: #006064;' value='Xing'>Xing</button><button id='upload_cv'>" + locale[lang].AddCVFile + "</button></div>";
                elem = "<div class='full_block _new' id='cv'>" + addCVData + "<div class='no_content'><div>You CV is still empty</div>" +
											 "<p>" + locale[lang].AddDetailInfoMessage + "</p></div></div>";
            }
            else {
                elem = "<div class='full_block _new' id='cv'><div class='no_content'><div>CV hasn't been filled yet</div>" +
												"<p>" + locale[lang].UserNotHaveCVMessage + "</p></div></div>";
            }
        }
        else {
            if (_GB_.user_id == _GB_.section && _GB_.page_id == 6) {
                addCVData = "<div id='cv_controls'><button class='open_social_account' style='background-image: url(/img/Xing.png); background-color: #006064;' value='Xing'>Xing</button><button id='upload_cv'>" + locale[lang].AddCVFile + "</button></div>";
            }
            elem = "<div class='full_block _new' id='cv'>" + addCVData;

            if (education.length != 0) {
                elem += "<h6 style='margin: 20px 3%; width: 94%;'>" + locale[lang].Education + "</h6>";
            }
            $.each(education, function (ind, val) {
                elem += "<div class='cv_elem cv_education'>" +
									"<div class='cv_text_small'>" + locale[lang].From + " " + val.from + " - " + val.until + "</div>" +
									"<div class='cv_text_large'>" + val.institution + "</div>" +
									"<div class='cv_text_bold'>" + val.name_en + "</div>" +
								"</div>";
            });

            if (jobs.length != 0) {
                elem += "<h6 style='margin: 20px 3%; width: 94%;'>" + locale[lang].Jobs + "</h6>";
            }
            $.each(jobs, function (ind, val) {
                elem += "<div class='cv_elem cv_jobs'>" +
									"<div class='cv_text_small'>" + locale[lang].From + " " + val.from + " - " + val.until + "</div>" +
									"<div class='cv_text_large'>" + val.company + "</div>" +
									"<div class='cv_text_bold'>" + val.name_en + "</div>" +
								"</div>";
            });

            if (certificates.length != 0) {
                elem += "<h6 style='margin: 20px 3%; width: 94%;'>" + locale[lang].Certificates + "</h6>";
            }
            $.each(certificates, function (ind, val) {
                elem += "<div class='cv_elem cv_certificates'>" +
									"<div class='cv_text_small'>" + locale[lang].From + " " + val.from + "</div>" +
									"<div class='cv_text_large'>" + val.name_en + "</div>" +
								"</div>";
            });

            if (goals.length != 0) {
                elem += "<h6 style='margin: 20px 3%; width: 94%;'>" + locale[lang].Goals + "</h6>";
            }
            $.each(goals, function (ind, val) {
                elem += "<div class='cv_elem cv_goals'>" +
									"<div class='cv_text_large'>" + val.title_en + "</div>" +
									"<div class='cv_text_bold'><span>" + locale[lang].ParentCategory + ":</span>&nbsp" + val.parents[0].parents[0].title_en + "</div>" +
									"<div class='cv_text_small'><span>" + locale[lang].Subcategory + ":</span>&nbsp" + val.parents[0].title_en + "</div>" +
								"</div>";
            });

            elem += "</div>";
        }
        return elem;
    },

    //Show similar profiles
    showSimilarProfiles: function (user_id, $elem) {
        $elem.html('<div class="list_loader"></div>');
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.section + '/similars',
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var obj = JSON.parse(data);
                console.log(obj);
                var html_str = "<h5>" + locale[lang].SimilarProfiles + "</h5>";
                var iter = 0;
                $.each(obj.data, function (ind, val) {
                    var extra_class = "";
                    if (ind == 0) {
                        extra_class = " active";
                    }
                    if (iter == 5) {
                        html_str += '</div>';
                        iter = 1;
                    }
                    else {
                        iter++;
                    }
                    if (ind == 0 || ind % 5 == 0) {
                        html_str += '<div class="recommend_row' + extra_class + '">';
                    }
                    html_str += '<div class="recommend_item">' +
                    '<div class="proj_user_block"><a href="/profile/' + val._id + '" class="user_img"><div class="square_img">' +
                    '<img src="' + val.image_url + '" /></div></a><div style="width: 100%; text-align: center; line-height: 20px; height: 40px; overflow: hidden;">' +
                    '<a href="/profile/' + val._id + '" class="proj_name_link">' + val.firstname + ' ' + val.surname + '</a></div></div></div>';
                    if (iter < 5 && obj.data.length - 1 == ind) {
                        html_str += '</div>';
                    }
                });
                if (obj.data.length > 5) {
                    html_str += "<button class='recommend_arr prev_arr'></button><button class='recommend_arr next_arr'></button>";
                }
                $elem.html(html_str);
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    processSlides: function ($active, $called) {
        $active.animate({ opacity: '0' }, 300, function () {
            $called.fadeIn(200, function () {
                $active.removeClass('active').removeAttr('style');
                $(this).addClass('active');
            });
        });
    },

    //Add one skill manually
    addSkill: function (name) {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "user_id": _GB_.user_id, "names": [name] }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/interfaces/inputs/skills',
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log(data);
                var obj = JSON.parse(data)
                if (obj.length != 0) {
                    _PF_.getSkills();
                }
                else {
                    $('body').append(_POPUP_.init("warning", locale[lang].SkillsNotSavedMessage, locale[lang].OK, locale[lang].Close, false));
                    $('#profile_info .full_block #loading_skills').fadeOut(200);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    getSkills: function () {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "fields": "skills" }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id,
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
                var obj = JSON.parse(data);
                $('#parent_block, #cat_skill_block').remove();
                $(_PF_.skills(obj.skills)).insertAfter('#add_skills_block');
                $('#profile_info .full_block #loading_skills').fadeOut(200);

                $('.full_block#metrics .metric.categories_metric .num_metric').text(_PF_.numOfCat(obj.skills));
                $('.full_block#metrics .metric.skills_metric .num_metric').text(obj.skills.length);

                _PF_.getScore();
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    //Delete one skill manually
    deleteSkill: function (skillObj) {
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/skills/' + skillObj._id,
            type: 'DELETE',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
                _PF_.getScore();
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    //Massive skills update (currently we're getting these skills through extracting file after uploading)
    updateSkills: function (acceptedSkills, rejectedSkills, reload) {
        reload = reload || null;
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "user_id": _GB_.user_id, "skills": acceptedSkills, "rejectedSkills": rejectedSkills }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/skills',
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
                if (reload) {
                    _PF_.getProfile();
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    editSkill: function (id, new_skill) {
        $('#change_skill_data').text('Processing...').css('opacity', '0.7');
        var _data = new FormData();
        _data.append('json', JSON.stringify(new_skill));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/skills/' + id,
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
                _PF_.getProfile();
                //$('.skill.editing_mode').val(new_skill["name"]).attr('source',new_skill["source"]).attr('project',new_skill["project"]).attr('category',new_skill["category"]);
                $('#lightbox, .editing_box').fadeOut(200);
                $('#change_skill_data').text(locale[lang].SaveChanges).css('opacity', '1');
                //$('.skill.editing_mode').removeClass('editing_mode');
            },
            error: function (data) {
                console.log(data.responseText);
            }
        });
    },

    getCategoryList: function ($select, default_val) {
        $.ajax({
            url: _GB_.path + 'categories',
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var localObj = JSON.parse(data);
                $list = "";
                $.each(localObj.data, function (ind, val) {
                    if (val.title_en != default_val) {
                        $list += "<option value='" + JSON.stringify(val) + "'>" + val.title_en + "</option>";
                    }
                    else {
                        $('.skill_category_current').val(JSON.stringify(val));
                    }
                });
                $select.append($list);
            },
            error: function (data) {
                console.log(data.responseText);
            }
        });
    },

    getProjectList: function ($select, default_val) {
        $list = "";
        $('#projects .project').each(function (e) {
            var source = $(this).find('a');
            if (source.attr('attr-source').trim() != default_val) {
                $list += "<option value='" + source.attr('attr-source').trim() + "'>" + source.text().trim() + "</option>";
            }
        });
        $select.append($list);
    },

    //Get all projects except existed
    getAllProjectsFromList: function (projects) {
        $('#lightbox, .add_project_box').fadeIn(200);
        $('#projects_choosing_block').html('<div class="list_loader"></div>');
        $.ajax({
            url: _GB_.path + 'projects',
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var localObj = JSON.parse(data);
                var mini_str = "";
                $.each(localObj.data, function (ind, val) {
                    var flag = false;
                    for (i = 0; i < projects.length; i++) {
                        if (val._id == projects[i]) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        mini_str += "<div style='padding-right: 10px;' class='_project removed' attr-source='" + val._id + "'><div class='add_proj'></div>" + val.name + "</div>";
                    }
                });
                if (mini_str != "") {
                    $('#projects_choosing_block').html(mini_str);
                }
                else {
                    $('#projects_choosing_block').html('<div class="no_data">' + locale[lang].NoAvailableProjectsMessage + '</div>');
                }
            },
            error: function (data) {
                console.log(data.responseText);
            }
        });
    },

    //Add selected projects to Profile
    addProjectsToProfile: function (projects) {
        console.log(skills);
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "user_id": _GB_.user_id, "projects": projects }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/projects',
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var mini_str = "";
                $.each(projects, function (ind, val) {
                    mini_str += "<div class='project'><button class='delete_obj' value='project'></button><div class='project_img'><img src='/img/project_icon.png' /></div><a href='/project/" + val.name + "' attr-source='" + val.name + "'>" + val.name + "</a></div>";
                });
                if (mini_str != "") {
                    if ($('#profile_info .full_block#projects').find('.no_content').length != 0) {
                        $('#profile_info .full_block#projects').find('.no_content').remove();
                        $('#profile_info .full_block#projects').prepend('<div style="width: 94%; margin: 0px 3% 20px;" class="projects_container"></div>');
                    }
                    $('#profile_info .full_block#projects > div').append(mini_str);
                }
                $('#lightbox, .add_project_box').fadeOut(200);
                $('.full_block#metrics .metric.projects_metric .num_metric').text($('#projects .project').length);
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    //Endorse several skills to another user
    sendRequest: function (skills) {
        console.log(skills);
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "user_id": _GB_.user_id, "recipient_id": _GB_.section, "type": "endorsement", "text": locale[lang].EndoreSkillsToUserMessage, "skills": skills }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/requests',
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                $('body').append(_POPUP_.init("success", locale[lang].EndoreSkillsRequestSendMessage, locale[lang].OK, locale[lang].Close, true));
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    skill_project_name: "",

    //Load file for extracting skills from there
    loadSkills: function (id, elem_id) {
        var form = document.getElementById(id);
        var formData = new FormData();
        var file = document.getElementById(id).files[0];
        formData.append('file', file);
        hr = new XMLHttpRequest();
        $.ajax({
            type: "POST",
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/interfaces/files/skills',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var localObj = JSON.parse(data);
                console.log(data);
                console.log(localObj);

                var elem = "";
                _PF_.skill_project_name = "";
                $.each(localObj.data, function (ind, val) {
                    var mini_str = "";
                    $.each(val.skills, function (ind, val) {
                        var skill_name = val.name;
                        var skill_stem = val.stem;
                        var link = val.source;
                        var project = val.project;
                        _PF_.skill_project_name = project;
                        var category = JSON.stringify(val.category);
                        var fullSkillJSON = JSON.stringify(val);

                        mini_str += "<div style='padding-right: 10px;' class='skill my_skills _minibox' source='" + link + "' project='" + project + "' stem='" + skill_stem + "' category='" + category + "' fullSkillJSON='" + fullSkillJSON + "'><div class='delete_skill'></div>" + skill_name + "</div>";
                    });
                    elem += "<div class='skill_set'><div class='slide_arrow'></div><div class='skill_set_name active'>" + val.name.title_en + "</div>" + mini_str + "</div>";
                });
                $('#add_to_project').remove();
                if (_PF_.skill_project_name != "")
                    $("<div id='add_to_project' class='active'>" + locale[lang].ConnectSkillsToProject + " <a href='/project/" + _PF_.skill_project_name + "'>" + _PF_.skill_project_name + "<a></div>").insertAfter('#' + elem_id);

                $('#' + elem_id).html(elem);
                $('#upload_skills').text(locale[lang].AddSkillFile).removeClass('loading');
                $('#lightbox, .mini_box').fadeIn(200);
                $('#skills_uploading').val("");
            },
            data: formData,
            cache: false,
            crossDomain: true,
            mimeType: "multipart/form-data",
            contentType: false,
            processData: false
        });
    },

    //Load file for extracting cv data from there
    loadCV: function (id, elem_id) {
        var form = document.getElementById(id);
        var formData = new FormData();
        var file = document.getElementById(id).files[0];
        formData.append('file', file);
        formData.append('json', JSON.stringify({ 'uploadFile': false }));
        hr = new XMLHttpRequest();
        $.ajax({
            type: "POST",
            url: _GB_.path + 'profiles/' + _GB_.user_id + '/interfaces/files/cv',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var localObj = JSON.parse(data);
                console.log(localObj);
                _POPUP_.destroy();
                _CONNECT_.processCV(localObj.data[0], elem_id);
                $('#upload_cv').text(locale[lang].AddCVFile).removeClass('loading');
                $('#cv_uploading').val("");
            },
            error: function (data) {
                console.log(data.responseText);
            },
            data: formData,
            cache: false,
            crossDomain: true,
            mimeType: "multipart/form-data",
            contentType: false,
            processData: false
        });
    },

    //Remove project or file from profile
    removeObjFromProfile: function (source, type, $elem) {
        $('#lightbox').hide();
        _POPUP_.destroy();
        var _data = new FormData();
        var path = "";
        if (type == "file") {
            path = 'profiles/' + _GB_.user_id + '/files';
            _data.append('json', JSON.stringify({ "fileSource": source }));
            $('#profile_info').find('.file_set:eq(' + $elem + ')').remove();
        }
        else if (type == "project") {
            path = 'profiles/' + _GB_.user_id + '/projects/' + encodeURI(source);
            $('#profile_info').find('.project:eq(' + $elem + ')').remove();
            if ($('#profile_info').find('.project').length == 0) {
                $('#profile_info .full_block#projects').find('.projects_container').remove();
                $('#profile_info .full_block#projects').prepend("<div class='no_content'><div>" + locale[lang].NoProjectsActiveUserMessage + "</div><p>" + locale[lang].AddProjectActiveUserMessage + "</p></div>");
            }
            $('.full_block#metrics .metric.projects_metric .num_metric').text($('#projects .project').length);
        }
        $.ajax({
            url: _GB_.path + path,
            type: 'DELETE',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log('OK');
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    getScore: function () {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "fields": "score" }));
        $.ajax({
            url: _GB_.path + 'profiles/' + _GB_.user_id,
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var obj = JSON.parse(data);
                $('.full_block#metrics .metric.score_metric .num_metric').text(obj.score + "%");
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

};

_PRJ_ = {

    num_categories: 0,
    num_skills: 0,

    //Get project
    getProject: function () {
        $('#project_info').html('<div class="list_loader"></div>');
        $.ajax({
            url: _GB_.path + 'projects/' + encodeURI(_GB_.section),
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var obj = JSON.parse(data);
                console.log(obj);
                var files = [];
                $.each(obj.files, function (ind, val) {
                    //	var name = val.originalName;
                    //	var temp_obj = {"url":val.url,"name":name};
                    files.push(val);
                });

                var text = obj.desc;
                var skills_block = _PRJ_.processSkills(obj.users);
                $('h2').html(locale[lang].Project + ' ' + obj.name);

                $('#project_info').html('<div id="left_project_block">' +
                '<div class="right_project_block"><div class="full_block">' +
                    '<h4 id="project_name">' + locale[lang].Project + ' ' + obj.name + '</h4>' +
                    '<div class="user_img"><div class="square_img"><img src="' + obj.image_url + '" /></div></div>' +
                    '<div id="project_spec">' +
                        '<small style="background-image: url(/img/category_icon.png);"><span>' + locale[lang].Category + ':</span>&nbsp' + obj.category.name + '</small>' +
                        '<small style="background-image: url(/img/branch.png);"><span>' + locale[lang].Branch + ':</span>&nbsp' + obj.branch.name + '</small>' +
                        '<small style="background-image: url(/img/customer.png);"><span>' + locale[lang].Customer + ':</span>&nbsp' + obj.customer.name + '</small>' +
                        '<small style="background-image: url(/img/calendar.png);"><span>' + locale[lang].From + '</span>&nbsp' + obj["start-date"] + '&nbsp<span>to</span>&nbsp' + obj["end-date"] + '</small>' +
                    '</div>' +
                    '<h6>' + locale[lang].About + '</h6><div id="proj_desc">' + text + '</div><small id="show_desc">' + locale[lang].ShowMore + '</small>' +
                '</div></div>' +
                '<div class="right_project_block">' +
                '<div class="full_block" style="padding-bottom: 10px;" id="proj_members"><h6 style="margin-top: 10px; margin-bottom: 0px;">' + locale[lang].Members + '</h6><small>' + obj.users.length + ' ' + locale[lang].MembersLowerCase + '</small>' + _PRJ_.getMembers(obj.users, obj.lead_id) +
                '<div class="full_block"><button id="invite_members" value="' + _GB_.section + '">' + locale[lang].InviteMembers + '</button></div></div>' +
                '</div>' +
                '</div>' +
                '<div id="center_project_block">' + _PF_.metrics(null, null, _PRJ_.num_categories, _PRJ_.num_skills, "project") + '<div class="full_block" style="margin-bottom: 20px;">' +
                    '<h5>Skills</h5><div id="skills" class="full_block">' + skills_block + '</div>' +
                '</div>' + _PF_.files(files) +
                '</div><div id="bottom_user_cover"></div>');

                if (_GB_.IsMobile()) {
                    $('#bottom_user_cover').addClass('mobile_view');
                }

                _PRJ_.showSimilarProjects(_GB_.section, $('#bottom_user_cover'));
            }
        });
    },

    getMembers: function (users, lead_id) {
        var common_str = '<div id="project_user_list">';
        var str = "";
        $.each(users, function (ind, val) {
            if (val._id == lead_id) {
                str = '<div class="proj_user_block lead_member"><a href="/profile/' + val._id + '" class="user_img"><div class="square_img"><img src="' + val.image_url + '" /></div></a><div style="width: 100%; text-align: center; line-height: 12px; height: 32px; overflow: hidden;"><a href="/profile/' + val._id + '" class="proj_name_link">' + val.firstname + ' ' + val.surname + '</a></div></div>' + str;
            }
            else {
                str += '<div class="proj_user_block"><a href="/profile/' + val._id + '" class="user_img"><div class="square_img"><img src="' + val.image_url + '" /></div></a><div style="width: 100%; text-align: center; line-height: 12px; height: 32px; overflow: hidden;"><a href="/profile/' + val._id + '" class="proj_name_link">' + val.firstname + ' ' + val.surname + '</a></div></div>';
            }
        });
        common_str += str + '</div>';
        return common_str;
    },

    processSkills: function (users) {
        var skills = [];
        $.each(users, function (i, v) {
            $.each(v.skills, function (ind, val) {
                skills.push(val);
            });
        });
        //Categories processing
        var categories = [];
        var num_of_cat = 0;
        $.each(skills, function (ind, val) {
            var flag = false;
            for (i = 0; i < categories.length; i++) {
                if (categories[i].title_en == val.category.title_en) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                categories[num_of_cat] = val.category;
                num_of_cat++;
            }
        });

        //Sort skills by categories
        var elem = "";
        var num_of_skills = 0;
        for (i = 0; i < categories.length; i++) {
            var local_num_of_skills = 0;
            var mini_str = "";
            $.each(skills, function (ind, val) {
                if (val.category.title_en == categories[i].title_en) {
                    num_of_skills++;
                    local_num_of_skills++;
                    var skill_name = val.name;
                    var link = val.source;
                    var project = val.project;
                    var category = val.category;
                    var fullSkillJSON = JSON.stringify(val);

                    mini_str += "<div class='skill' source='" + link + "' project='" + project + "' category='" + category + "' fullSkillJSON='" + fullSkillJSON + "' style='padding-left: 10px;'><a href='" + link + "' class='skill_text'>" + skill_name + "</a></div>";
                }
            });
            elem += "<div class='skill_set'><div class='main_skill'><div class='skill'><div class='skill_rating'>" + local_num_of_skills + "</div>" + categories[i].title_en + "</div></div>" + mini_str + "</div>";
        }

        this.num_categories = num_of_cat;
        this.num_skills = num_of_skills;

        return elem;
    },

    //Show similar profiles
    showSimilarProjects: function (project_id, $elem) {
        $elem.html('<div class="list_loader"></div>');
        $.ajax({
            url: _GB_.path + 'projects/' + project_id + '/similars',
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var obj = JSON.parse(data);
                console.log(obj);
                var html_str = "<h5>Similar projects</h5>";
                var iter = 0;
                $.each(obj.data, function (ind, val) {
                    var extra_class = "";
                    if (ind == 0) {
                        extra_class = " active";
                    }
                    if (iter == 5) {
                        html_str += '</div>';
                        iter = 1;
                    }
                    else {
                        iter++;
                    }
                    if (ind == 0 || ind % 5 == 0) {
                        html_str += '<div class="recommend_row' + extra_class + '">';
                    }
                    html_str += '<div class="recommend_item">' +
                    '<div class="proj_user_block"><a href="/project/' + val._id + '" class="user_img"><div class="square_img">' +
                    '<img src="' + val.image_url + '" /></div></a><div style="width: 100%; text-align: center; line-height: 20px; height: 40px; overflow: hidden;">' +
                    '<a href="/project/' + val._id + '" class="proj_name_link">' + val.name + '</a></div></div></div>';
                    if (iter < 5 && obj.data.length - 1 == ind) {
                        html_str += '</div>';
                    }
                });
                if (obj.data.length > 5) {
                    html_str += "<button class='recommend_arr prev_arr'></button><button class='recommend_arr next_arr'></button>";
                }
                $elem.html(html_str);
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

}

//Connection with social networks
_CONNECT_ = {

    connectionArray: {
        "xing": ["CV", "Skills"],
        "dropbox": ["Skills"],
        "slack": ["Skills"],
        "confluence": ["Skills"],
        "stackexchange": ["Skills"],
        "sharepoint": ["Skills"]
    },

    init: function (type) {
        var _data = new FormData();
        _data.append('json', JSON.stringify({ "user_id": _GB_.user_id }));
        $.ajax({
            url: _GB_.path + type,
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                obj = JSON.parse(data);
                window.location.href = obj.url;
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    setAccountCredentials: function (res, arr) {
        res = res.toLowerCase();
        if (res != "dropbox") {
            var queryType = "POST";
            var type = _GB_.path + "profiles/" + _GB_.user_id + "/interfaces/" + res + "/credentials";
            var _data = new FormData();
            _data.append('json', JSON.stringify(arr));
            $.ajax({
                url: type,
                type: queryType,
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    return myXhr;
                },
                data: _data,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
                },
                success: function (data) {
                    console.log(data);
                    _PF_.getAccounts();
                    $('.close_box').trigger('click');
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }
        else {
            window.location.href = _GB_.path + "profiles/" + _GB_.user_id + "/interfaces/dropbox/credentials";
        }
    },

    showOptions: function (res) {
        res = String(res.toLowerCase());
        var options = "";
        if (_CONNECT_.connectionArray[res] !== undefined) {
            options += "<div id='connect_cover_options'>";
            var valArr = _CONNECT_.connectionArray[res];
            for (i = 0; i < valArr.length; i++) {
                if (valArr[i] == "Skills") {
                    options += "<div class='connect_option skills_option' value='skills' res='" + res + "'><div class='connect_option_title'>" + locale[lang].GetSkills + "</div><small>" + locale[lang].CanGetSkillsSocialMessage + "</small></div>";
                }
                else if (valArr[i] == "CV") {
                    options += "<div class='connect_option cv_option' value='cv' res='" + res + "'><div class='connect_option_title'>" + locale[lang].GetCVData + "</div><small>" + locale[lang].CanGetCVSocialMessage + "</small></div>";
                }
            }
            options += "</div>";
        }
        return options;
    },

    getDataFromAccount: function (res, partition, arr) {
        arr = arr || {};
        res = res.toLowerCase();
        var type = _GB_.path + "profiles/" + _GB_.user_id + "/interfaces/" + res + "/" + partition;
        var _data = new FormData();
        _data.append('json', JSON.stringify(arr));
        $.ajax({
            url: type,
            type: 'GET',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                var localObj = JSON.parse(data);
                console.log(localObj);
                _POPUP_.destroy();
                if (!$.isEmptyObject(localObj)) {
                    if (partition == "skills") {
                        _CONNECT_.processSkills(localObj, "skills_set_block");
                    }
                    else if (partition == "cv") {
                        _CONNECT_.processCV(localObj, "cv_set_block");
                    }
                }
                else {
                    $('.close_box').trigger('click');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    updateProfile: function (obj) {
        var type = _GB_.path + "profiles/" + _GB_.user_id;
        var _data = new FormData();
        _data.append('json', JSON.stringify(obj));
        $.ajax({
            url: type,
            type: 'POST',
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            data: _data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
            },
            success: function (data) {
                console.log(data);
                $('#lightbox').trigger('click');
                $('#update_profile_info').text('Update profile');
                _PF_.getProfile();
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    processSkills: function (localObj, elem_id) {
        var elem = "";
        _PF_.skill_project_name = "";
        $.each(localObj.data, function (ind, val) {
            var mini_str = "";
            $.each(val.skills, function (ind, val) {
                var skill_name = val.name;
                var skill_stem = val.stem;
                var link = val.source;
                var project = val.project;
                _PF_.skill_project_name = project;
                var category = JSON.stringify(val.category);
                var fullSkillJSON = JSON.stringify(val);

                mini_str += "<div style='padding-right: 10px;' class='skill my_skills _minibox' source='" + link + "' project='" + project + "' stem='" + skill_stem + "' category='" + category + "' fullSkillJSON='" + fullSkillJSON + "'><div class='delete_skill'></div>" + skill_name + "</div>";
            });
            elem += "<div class='skill_set'><div class='slide_arrow'></div><div class='skill_set_name active'>" + val.name.title_en + "</div>" + mini_str + "</div>";
        });
        if (_PF_.skill_project_name != "")
            $("<div id='add_to_project' class='active'>" + locale[lang].ConnectSkillsToProject + " <a href='/project/" + _PF_.skill_project_name + "'>" + _PF_.skill_project_name + "<a></div>").insertAfter('#' + elem_id);

        $('#' + elem_id).html(elem);
        $('#lightbox, .mini_box').fadeIn(200);
    },

    processCV: function (localObj, elem_id) {
        var elem = "";
        //Profile info
        if (localObj.image_url !== undefined && localObj.firstname !== undefined && localObj.surname !== undefined) {
            elem += "<div class='cv_set'><div class='slide_arrow'></div><div class='cv_set_name active'>" + locale[lang].Profile + "</div>" +
			"<div class='cv_cell' style='margin-right: 70%;' data='" + localObj.image_url + "' attr-category='profile' attr-profile='image_url'><div class='delete_cv_cell'></div><img src='" + localObj.image_url + "' /></div>" +
			"<div style='padding-right: 10px;' class='cv_cell' data='" + localObj.firstname + "' attr-category='profile' attr-profile='firstname'><div class='delete_cv_cell'></div>" + localObj.firstname + "</div>" +
			"<div style='padding-right: 10px;' class='cv_cell' data='" + localObj.surname + "' attr-category='profile' attr-profile='surname'><div class='delete_cv_cell'></div>" + localObj.surname + "</div></div>";
        }

        $.each(localObj, function (ind, val) {
            var keyStr = String(ind).toLowerCase();
            if (keyStr != "image_url" && keyStr != "firstname" && keyStr != "surname") {
                var mini_str = "";
                $.each(val, function (ind, val) {
                    var content = "";
                    if (keyStr == "jobs" || keyStr == "work") {
                        content = val.name_en + " <span>" + locale[lang].AtLowerCase + "</span> " + val.company + " <span>" + locale[lang].FromLowerCase + "</span> " + val.from + "-" + val.until;
                    }
                    else if (keyStr == "education") {
                        content = val.name_en + " <span>" + locale[lang].AtLowerCase + "</span> " + val.institution + " <span>" + locale[lang].FromLowerCase + "</span> " + val.from + "-" + val.until;
                    }
                    else if (keyStr == "languages") {
                        content = val.name_en;
                    }
                    mini_str += "<div style='padding-right: 10px;' class='cv_cell' data='" + JSON.stringify(val) + "' attr-category='" + keyStr + "'><div class='delete_cv_cell'></div>" + content + "</div>";
                });
                elem += "<div class='cv_set'><div class='slide_arrow'></div><div class='cv_set_name active'>" + keyStr + "</div>" + mini_str + "</div>";
            }
        });

        $('#' + elem_id).html(elem);
        $('#lightbox, .profile_info_box').fadeIn(200);
    }

};

//Content Nuggets
var _NUGGET_ = {

    //Global content nugget object
    nuggetObj: null,

    //Content nugget class
    ContentNugget: function () {
        var self = this;

        //Variables init
        this.id = 0;
        this.type = "";
        this.user_id = 0;
        this.text = "";
        this.title = "";
        this.files = [];
        this.tags = [];

        //New or existing post
        this.isNew = true;

        //Init creating function
        this.create = function (user_id) {
            if (!arguments.length) {
                throw new Error(locale[lang].NugetCreateErrorMessage);
            }
            this.user_id = user_id;

            createNugget();
        };

        //Creating function
        function createNugget() {
            var _data = new FormData();
            _data.append('json', JSON.stringify({ "user_id": self.user_id }));
            $.ajax({
                url: _GB_.path + "nuggets",
                type: 'POST',
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    return myXhr;
                },
                data: _data,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
                },
                success: function (data) {
                    console.log(data);
                    var localObj = JSON.parse(data);
                    self.id = localObj._id;
                    window.location.href = '/edit_nugget/' + localObj._id;
                },
                error: function (data) {
                    console.log(data);
                }
            });
        };

        //Init getting function
        this.get = function (user_id, id, $elem) {
            if (!arguments.length) { throw new Error(locale[lang].NugetGetErrorMessage); }

            this.id = id;
            this.user_id = user_id;
            getNugget($elem);
        };

        //Get existing nugget
        function getNugget($elem) {
            $elem.html('<div class="list_loader"></div>');
            //var _data = new FormData();
            //_data.append('json', JSON.stringify({"user_id": self.user_id, "nugget_id": self.id}));
            $.ajax({
                url: _GB_.path + "nuggets/" + self.id,
                type: 'GET',
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    return myXhr;
                },
                //data: _data,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
                },
                success: function (data) {
                    console.log(data);
                    var obj = JSON.parse(data);
                    if (_GB_.page_id == 9) {
                        $elem.html(initMainPage(obj._id, obj.author, obj.date, obj.title, obj.text, obj.tags, obj.files, obj.type));
                        getExpertRecommendations($elem);
                    }
                    else if (_GB_.page_id == 10) {
                        if (_GB_.user_id == Number(obj.author.user_id)) {
                            $elem.html(self.initModifyPage(obj.title, obj.text, obj.type, obj.tags, obj.files));
                            _NUGGET_.nugget.initEditor($('#wysiwyg_editor'));
                        }
                        else {
                            window.location.href = "/";
                        }
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        };

        //Init page for creating and editing
        this.initModifyPage = function (title, text, type, tags, files) {
            var content = "";
            var page_title = "";
            if (title.trim() != "" && text.trim() != "") {
                self.isNew = false;
                page_title = 'Edit post';

                var typeSelector = "";
                if (type == "Issue") {
                    typeSelector = '<option value="Issue" selected=selected>' + locale[lang].Issue + '</option>' +
					'<option value="Solution">' + locale[lang].Solution + '</option>';
                }
                else if (type == "Solution") {
                    typeSelector = '<option value="Issue">' + locale[lang].Issue + '</option>' +
					'<option value="Solution" selected=selected>' + locale[lang].Solution + '</option>';
                }

                var tagsBlock = "";
                if (tags.length > 0) {
                    var tagsBlock = "<div class='local_tags'><span>" + locale[lang].Tags + ": </span>";
                    tags.forEach(function (item, i, arr) {
                        tagsBlock += "<div class='tag' _id='" + item._id + "' title_en='" + item.title_en + "' title_de='" + item.title_de + "' stem_en='" + item.stem_en + "' stem_de='" + item.stem_de + "'><div class='delete_tag'></div>" + item.title_en + "</div>";
                    });
                    tagsBlock += "</div>";
                }

                var filesBlock = "";
                files.forEach(function (item, i, arr) {
                    var filename = item.split('/');
                    filesBlock += '<div class="file_item" file-url="' + item + '">' + filename[filename.length - 1] + '<div class="delete"></div></div>';
                });

                content = '<input type="text" placeholder="' + locale[lang].Title + '" name="title" id="nugget_title" value="' + title + '" />' +
				'<select class="message_select" id="nugget_type" name="type">' + typeSelector + '</select>' +
		    '<div id="wysiwyg_editor" placeholder="' + locale[lang].TypeTextHereMessage + '">' + text + '</div>' +
				'<div id="additional_data"><input type="text" placeholder="' + locale[lang].TagsExamples + '" name="tags" id="nugget_tags" />' +
				'<button id="attach_file"></button></div><div id="attachment_section">' + tagsBlock + filesBlock + '</div>';
            }
            else {
                self.isNew = true;
                page_title = locale[lang].CreatePost;

                content = '<input type="text" placeholder="' + locale[lang].Title + '" name="title" id="nugget_title" />' +
				'<select class="message_select" id="nugget_type" name="type">' +
				'<option value="Issue" selected=selected>' + locale[lang].Issue + '</option>' +
				'<option value="Solution">' + locale[lang].Solution + '</option>' +
				'</select>' +
		    '<div id="wysiwyg_editor" placeholder="' + locale[lang].TypeTextHereMessage + '"></div>' +
				'<div id="additional_data"><input type="text" placeholder="' + locale[lang].TagsExamples + '" name="tags" id="nugget_tags" />' +
				'<button id="attach_file"></button></div><div id="attachment_section"></div>';
            }

            $('title').html(page_title + $('title').text());
            $('h2').text(page_title);

            if (self.isNew) {
                content += '<button id="create_nugget" class="nugget_confirm_button disabled">' + locale[lang].PublishPost + '</button>';
            }
            else {
                content += '<button id="edit_nugget" class="nugget_confirm_button">' + locale[lang].SavePost + '</button>';
            }
            return content;
        };

        //Upload and attach file to function
        this.attachFileToNugget = function (id, $section) {
            var form = document.getElementById(id);
            var formData = new FormData();
            var file = document.getElementById(id).files[0];
            formData.append('file', file);
            formData.append('json', JSON.stringify({ "user_id": _GB_.user_id }));
            hr = new XMLHttpRequest();
            $.ajax({
                type: "POST",
                url: _GB_.path + "nuggets/files",
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    return myXhr;
                },
                data: formData,
                cache: false,
                crossDomain: true,
                mimeType: "multipart/form-data",
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
                },
                success: function (data) {
                    console.log(data);
                    var localObj = JSON.parse(data);

                    if (localObj.data.length > 0) {
                        var tags = "<div class='local_tags'><span>" + locale[lang].Tags + ": </span>";
                        localObj.data.forEach(function (item, i, arr) {
                            tags += "<div class='tag' _id='" + +item._id + "' title_en='" + item.title_en + "' title_de='" + item.title_de + "' stem_en='" + item.stem_en + "' stem_de='" + item.stem_de + "'><div class='delete_tag'></div>" + item.title_en + "</div>";
                        });
                        tags += "</div>";
                    }

                    $section.append('<div class="file_item" file-url="' + localObj.source + '">' + localObj.uniqueName + '<div class="delete"></div></div>' + tags);

                    $('#nugget_container #attach_file').removeClass('loading');
                },
                error: function (data) {
                    console.log(data);
                },
                data: formData,
                cache: false,
                crossDomain: true,
                mimeType: "multipart/form-data",
                contentType: false,
                processData: false
            });
        };

        function initMainPage(_id, author, date, title, text, tags, files, links) {
            var editing_control = "";
            if (author.user_id == _GB_.user_id) {
                editing_control = "<a href='/edit_nugget/" + _id + "' class='gray_link'>Edit post</a>";
            }

            var tagsElem = "";
            for (i = 0; i < tags.length; i++) {
                tagsElem += "<div class='nugget_tag'>" + tags[i].title_en + "</div>";
            }

            var filesElem = "";
            for (i = 0; i < files.length; i++) {
                if (i == 0) {
                    filesElem += '<div id="file_block">';
                }
                var filename = files[i].split('/');
                var shortName = filename[filename.length - 1];
                if (filename[filename.length - 1].length > 40) {
                    shortName = filename[filename.length - 1].substring(0, 40) + "...";
                }
                filesElem += "<div class='file_item' title='" + filename[filename.length - 1] + "'><div class='file_img'><img src='/img/green_doc.png'></div><div class='file_content'><div class='file_name'>" + shortName + "</div>" +
				"<div class='file_functions'><a style='background-image: url(/img/content/download_icon.png);' href='" + files[i] + "'>" + locale[lang].Download + "</a>" +
				"<a style='background-image: url(/img/content/external_link.png);' style='background-image: url(/img/content/download_icon.png);' target='_blank' href='" + files[i] + "'>" + locale[lang].NewTab + "</a></div></div></div>";
                if (i == files.length - 1) {
                    filesElem += "</div>";
                }
            }

            var content = '<div class="user_img profile_img"><a href="/profile/' + author.user_id + '"><img src="' + author.image_url + '" /></a></div>' +
			'<div class="user_name_date">' +
				'<div class="user_name"><a href="/profile/' + author.user_id + '">' + author.firstname + ' ' + author.surname + '</a></div>' +
				'<div class="user_date">' + locale[lang].Published + ' ' + date + '</div>' +
			'</div>' + editing_control + '<h1>' + title + '</h1><div id="text_block">' + text + '</div><div id="tags_block">' + tagsElem + '</div>' + filesElem;

            return content;
        };

        this.initEditor = function ($editor) {
            $editor.trumbowyg({
                btnsDef: {
                    // Customizables dropdowns
                    image: {
                        dropdown: ['insertImage', 'base64', 'noembed'],
                        ico: 'insertImage'
                    }
                },
                btns: [
                    ['undo', 'redo'],
                    ['formatting'],
                    'btnGrp-design',
                    ['link'],
                    ['image'],
                    'btnGrp-justify',
                    'btnGrp-lists',
                    ['foreColor', 'backColor'],
                    ['preformatted'],
                    ['horizontalRule']
                ]
            });
        };

        this.getSimilar = function ($container) {
            console.log(_GB_.path + "nuggets/" + Number(self.id) + "/similars");
            $.ajax({
                url: _GB_.path + "nuggets/" + Number(self.id) + "/similars",
                type: 'GET',
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    return myXhr;
                },
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
                },
                success: function (data) {
                    console.log(data);
                    var obj = JSON.parse(data);

                    var content = "";
                    if (obj.data.length > 0) {
                        $.each(obj.data, function (ind, val) {
                            content += '<div class="sgcn_block"><div class="user_img"><a target="_blank" href="/profile/' + val.author.user_id + '"><img src="' + val.author.image_url + '" /></a></div>' +
							'<div class="title_name_type">' +
								'<div class="sgcn_title"><a target="_blank" href="/nugget/' + val.nugget_id + '">' + val.title + '</a></div>' +
								'<div class="sgcn_type">' + val.type + '</div>' +
								'<div class="sgcn_user"><span>' + locale[lang].PublishedBy + '</span> <a target="_blank" href="/profile/' + val.author.user_id + '">' + val.author.firstname + ' ' + val.author.surname + '</a></div>' +
							'</div><div class="date">' + val.date + '</div></div>';
                        });
                    }
                    $container.html(content);
                },
                error: function (data) {
                    console.log(data);
                }
            });
        };

        this.packTags = function ($input, $tag_class) {
            var tagArray = [];
            if ($input.val().trim() != "") {
                tagArray = $input.val().trim().split(',');
            }
            var tags = [];
            for (i = 0; i < tagArray.length; i++) {
                var value = tagArray[i].trim();
                var tag = { "_id": value, "title_de": value, "title_en": value, "stem_de": value, "stem_en": value };
                tags.push(tag);
            }
            $tag_class.each(function () {
                if (!$(this).hasClass('removed')) {
                    var tag = { "_id": $(this).attr('_id'), "title_de": $(this).attr('title_de'), "title_en": $(this).attr('title_en'), "stem_de": $(this).attr('stem_de'), "stem_en": $(this).attr('stem_en') };
                    tags.push(tag);
                }
            });
            return tags;
        };

        this.edit = function (user_id, title, text, type, files, tags, redirect) {
            if (!arguments.length) {
                throw new Error(locale[lang].NugetCreateErrorMessage);
            }

            this.type = type;
            this.user_id = user_id;
            this.text = text;
            this.title = title;
            this.files = files;
            this.tags = tags;

            editNugget();
        };

        function editNugget(redirect) {
            redirect = redirect || true;
            var _data = new FormData();
            _data.append('json', JSON.stringify({ "user_id": self.user_id, "nugget": { "_id": Number(self.id), "title": self.title, "text": self.text, "type": self.type, "tags": self.tags, "files": self.files } }));
            $.ajax({
                url: _GB_.path + "nuggets/" + Number(self.id),
                type: 'POST',
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    return myXhr;
                },
                data: _data,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
                },
                success: function (data) {
                    console.log(data);
                    if (redirect) {
                        window.location.href = '/nugget/' + self.id;
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        };

        function getExpertRecommendations($container) {
            var _data = new FormData();
            _data.append('json', JSON.stringify({ "user_id": self.user_id, "nugget_id": Number(self.id), "startindex": 0, "number": 10 }));
            $.ajax({
                url: _GB_.path + "nuggets/" + self.id + "/experts",
                type: 'GET',
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    return myXhr;
                },
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _GB_.token);
                },
                success: function (data) {
                    console.log(data);
                    var obj = JSON.parse(data);
                    if (obj.data.length > 0) {
                        var html_str = "<h5>" + locale[lang].RecommendedExperts + "</h5>";
                        var iter = 0;
                        $.each(obj.data, function (ind, val) {
                            var extra_class = "";
                            if (ind == 0) {
                                extra_class = " active";
                            }
                            if (iter == 5) {
                                html_str += '</div>';
                                iter = 1;
                            }
                            else {
                                iter++;
                            }
                            if (ind == 0 || ind % 5 == 0) {
                                html_str += '<div class="recommend_row' + extra_class + '">';
                            }
                            html_str += '<div class="recommend_item">' +
							'<div class="proj_user_block"><a href="/profile/' + val._id + '" class="user_img"><div class="square_img">' +
							'<img src="' + val.image_url + '" /></div></a><div style="width: 100%; text-align: center;">' +
							'<a href="/profile/' + val._id + '" class="proj_name_link">' + val.firstname + ' ' + val.surname + '</a>' +
							'<strong style="width: 100%; font-size: 12px; margin: 5px 0px;">' +/*val.text+*/'</strong></div></div></div>';
                            if (iter < 5 && obj.data.length - 1 == ind) {
                                html_str += '</div>';
                            }
                        });
                        if (obj.data.length > 5) {
                            html_str += "</div><button class='recommend_arr prev_arr'></button><button class='recommend_arr next_arr'></button>";
                        }
                        $container.append("<div id='attachment_section' class='recommend_section'><div id='bottom_user_cover'></div></div>");
                        $('#bottom_user_cover').html(html_str);
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        };

    }

};
