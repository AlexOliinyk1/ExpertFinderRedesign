(function () {
    "use strict";

    angular.module('expert.core')
        .controller('BaseMenuDropdownDirectiveCtrl', BaseMenuDropdownDirectiveCtrl);

    BaseMenuDropdownDirectiveCtrl.$inject = [];

    function BaseMenuDropdownDirectiveCtrl() {
        var vm = this;

        vm.title = '';
        vm.isClosed = true;
        vm.openClose = openClose;

        function openClose() {
            vm.isClosed = !vm.isClosed;
        }
    }

})();

var _NAV_ = {

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


                //  Updates
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
                        $('#' + id).append('<div class="no_data">' + locale[lang].NoRecordsMessage + '</div>');
                    }
                }

                //  Messages
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
                        $('#' + id).append('<div class="no_data">' + locale[lang].NoRecordsMessage + '</div>');
                    }
                }

                //  Requests
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
                        $('#' + id).append('<div class="no_data">' + locale[lang].NoRecordsMessage + '</div>');
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
