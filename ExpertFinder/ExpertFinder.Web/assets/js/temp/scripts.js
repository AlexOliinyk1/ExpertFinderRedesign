$(document).ready(function () {

    //Check if it is Mobile View
    if (_GB_.IsMobile()) {
        $('#middle_container, h2, body, #subHead, #msg_manage_block, #new_message.reply, .box, .message_box, .mini_box, #profile_info, #project_info, #nugget_container, .editing_box, .add_project_box, .project_edit_box, .suggested_nuggets_box, .profile_info_box')
            .addClass('mobile_view');
    }

    ////Drop Down Menu show or hide event
    //$(document).on('click', '#userPic_cover, #user_cover_mobile', function (e) {
    //    $('.dropDown').hide();
    //    $('.navIcon').removeClass('active');
    //    $this = $(e.currentTarget);
    //    if (!$this.hasClass('active')) {
    //        $('#dropMenu').show();
    //        $this.addClass('active');
    //    }
    //    else {
    //        $('#dropMenu').hide();
    //        $this.removeClass('active');
    //    }
    //});

    ////Hide dropdowm menu
    //$(document).on('click', '.container', function (e) {
    //    if ($('#userPic_cover').hasClass('active')) {
    //        $('#dropMenu').hide();
    //        $this.removeClass('active');
    //    }
    //});

    ////Hide dropdowm menu
    //$(document).on('click', 'h2, #scroll_container', function (e) {
    //    $('.dropDown').hide();
    //    $('.navIcon').removeClass('active');
    //});

    //Check if screen size is needed in Mobile menu
    $mobile = false;
    $(window).resize(function (e) {
        if ($(this).width() < 1050 && !$mobile) {
            $mobile = true;
            $('.navIcon').hide();
            $('.mobile').show();
            if (_GB_.user_id == 0) {
                $('.profile_mobile').hide();
            }
            else {
                $('.profile_mobile').show();
            }
        }
        else if ($(this).width() > 1050 && $mobile) {
            $mobile = false;
            $('.navIcon').show();
            $('.mobile').hide();
        }
    });

    if ($(window).width() < 1050 && !$mobile) {
        $mobile = true;
        $('.navIcon').hide();
        $('.mobile').show();
        if (_GB_.user_id == 0) {
            $('.profile_mobile').hide();
        }
        else {
            $('.profile_mobile').show();
        }
    }
    else if ($(window).width() > 1050 && $mobile) {
        $mobile = false;
        $('.navIcon').show();
        $('.mobile').hide();
    }

    //Load appropriate content which depends on page ID
    if (_GB_.page_id == 1) {
        //Get content for main page
        // moved to angular
        //_NF_.list();
    }
    else if (_GB_.page_id == 2) {
        //Load content for page with recent updates
        _NAV_.list('profiles/' + _GB_.user_id + '/updates', 'notifications_block', true);
    }
    else if (_GB_.page_id == 3) {
        //Load content for page with message (inbox, outbox, favorites)
        if (_GB_.section == null || _GB_.section == "inbox") {
            _NAV_.list('profiles/' + _GB_.user_id + '/messages?type=inbox&favorite=false&offset=0&limit=20', 'messages_block', true);
        }
        else if (_GB_.section == "sent") {
            _NAV_.list('profiles/' + _GB_.user_id + '/messages?type=outbox&favorite=false&offset=0&limit=20', 'messages_block', true);
        }
        else if (_GB_.section == "favorites") {
            _NAV_.list('profiles/' + _GB_.user_id + '/messages?type=inbox&favorite=true&offset=0&limit=20', 'messages_block', true);
        }
    }
    else if (_GB_.page_id == 4) {
        //Load content for page with requests
        _NAV_.list('profiles/' + _GB_.user_id + '/requests?offset=0&limit=20', 'requests_block', true);
    }
    else if (_GB_.page_id == 5) {
        //Search
        if (_GB_.section != null) {
            _GB_.section = _GB_.decodeUrl(_GB_.section);
            _SEARCH_.list(_GB_.section);
            $('#searchBar input[name=ef_search]').val(_GB_.section);
        }
        else {
            window.location.href = "/";
        }
    }
    else if (_GB_.page_id == 6) {
        //Profile page
        if (_GB_.section != null) {
            _PF_.getProfile();
            //Check if there was a query to social network before
            if (_GB_.getVerifier()) {
                //If so then open window to select necessary skills from social network
                _CONNECT_.getData("skills_set_block");
            }
        }
    }
    else if (_GB_.page_id == 7) {
        //Project page
        if (_GB_.section != null) {
            _PRJ_.getProject(_GB_.section);
        }
        else {
            window.location.href = "/";
        }
    }
    else if (_GB_.page_id == 8) {
        //Admin page
        _ADMIN_.init();
    }
    else if (_GB_.page_id == 9 || _GB_.page_id == 10) {
        _NUGGET_.nugget = new _NUGGET_.ContentNugget();
        if (_GB_.section != null) {
            _NUGGET_.nugget.get(_GB_.user_id, _GB_.section, $('#nugget_container'));
        }
        else {
            window.location.href = "/";
        }
    }

    //Load previous content for the current page
    $(window).scroll(function () {
        if (_GB_.page_id == 1) {
            if ($(window).scrollTop() == $(document).height() - $(window).height()
                && _NF_.count == 20 && !_NF_.load) {
                _NF_.list();
            }
        }
        else if (_GB_.page_id == 2) {
            if ($(window).scrollTop() == $(document).height() - $(window).height() && _NAV_.count == 20 && !_NAV_.load) {
                _NAV_.list('profiles/' + _GB_.user_id + '/updates?offset=0&limit=20', 'notifications_block', true);
            }
        }
        else if (_GB_.page_id == 3) {
            if ($(window).scrollTop() == $(document).height() - $(window).height() && _NAV_.count == 20 && !_NAV_.load) {
                if (_GB_.section == null || _GB_.section == "inbox") {
                    _NAV_.list('profiles/' + _GB_.user_id + '/messages?type=inbox&favorite=false&offset=0&limit=20', 'messages_block', true);
                }
                else if (_GB_.section == "sent") {
                    _NAV_.list('profiles/' + _GB_.user_id + '/messages?type=outbox&favorite=false&offset=0&limit=20', 'messages_block', true);
                }
                else if (_GB_.section == "favorites") {
                    _NAV_.list('profiles/' + _GB_.user_id + '/messages?type=inbox&favorite=true&offset=0&limit=20', 'messages_block', true);
                }
            }
        }
        else if (_GB_.page_id == 4) {
            if ($(window).scrollTop() == $(document).height() - $(window).height() && _NAV_.count == 20 && !_NAV_.load) {
                _NAV_.list('profiles/' + _GB_.user_id + '/requests?offset=0&limit=20', 'requests_block', true);
            }
        }
        else if (_GB_.page_id == 5) {
            if ($(window).scrollTop() == $(document).height() - $(window).height() && _SEARCH_.count == 20 && !_SEARCH_.load) {
                if (_GB_.section != null) {
                    _SEARCH_.list(_GB_.section);
                }
            }
        }
    });

    //Auth click event
    $(document).on('click', '#submit_auth', function (e) {
        $this = $(e.currentTarget);
        $('li.alerts').hide();
        var email = $('#email_auth').val();
        var pwd = $('#pwd_auth').val();
        if (email.trim() != "" && pwd.trim() != "") {
            $('html').css('cursor', 'progress');
            _AUTH_.login(email, pwd);
        }
        else {
            $('html').css('cursor', 'auto');
            $('#fill_error_field').show();
        }
    });
    //Auth keypress event
    $(document).on('keyup', '#email_auth, #pwd_auth', function (e) {
        if (e.which == 13) {
            $('li.alerts').hide();
            var email = $('#email_auth').val();
            var pwd = $('#pwd_auth').val();
            if (email.trim() != "" && pwd.trim() != "") {
                $('html').css('cursor', 'progress');
                _AUTH_.login(email, pwd);
            }
            else {
                $('html').css('cursor', 'auto');
                $('#fill_error_field').show();
            }
        }
    });
    if (_GB_.user_id > 0) {
        _AUTH_.getUserData();
    }

    //Log out event
    $(document).on('click', '.logout', function (e) {
        $this = $(e.currentTarget);
        $('html').css('cursor', 'progress');
        _AUTH_.logout();
    });

    //Events for mobile menu
    $(document).on('change', '.profile_mobile_menu select, .profile_mobile select', function (e) {
        $this = $(e.currentTarget);
        //Log out
        if ($this.val() == "logout") {
            $('html').css('cursor', 'progress');
            _AUTH_.logout();
        }
            //Link to profile
        else if ($this.val() == "profile") {
            window.location.href = "/profile/" + _GB_.user_id;
        }
    });

    ////Open small window with Notification
    //// moved to directive 'shared/menuDropdown'
    //$(document).on('click', '.navNotification', function (e) {
    //    $this = $(e.currentTarget);
    //    if (!$this.hasClass('disable')) {
    //        $('.dropDown').hide();
    //        if (!$this.hasClass('active')) {
    //            $('.navIcon, #userPic_cover, #user_cover_mobile').removeClass('active');
    //            $('#dropNotification').show();
    //            $this.addClass('active');
    //            _NAV_.list('profiles/' + _GB_.user_id + '/updates?offset=0&limit=20', 'notificationUpdate', false);
    //        }
    //        else {
    //            $('#dropNotification').hide();
    //            $this.removeClass('active');
    //        }
    //    }
    //});

    //Open small window with Messages
    //$(document).on('click', '.navMessage', function (e) {
    //    $this = $(e.currentTarget);
    //    if (!$this.hasClass('disable')) {
    //        $('.dropDown').hide();
    //        if (!$this.hasClass('active')) {
    //            $('.navIcon, #userPic_cover, #user_cover_mobile').removeClass('active');
    //            $('#dropMessage').show();
    //            $this.addClass('active');
    //            _NAV_.list('profiles/' + _GB_.user_id + '/messages?type=inbox&favorite=false&offset=0&limit=20', 'messageUpdate', false);
    //        }
    //        else {
    //            $('#dropMessage').hide();
    //            $this.removeClass('active');
    //        }
    //    }
    //});
    //Mark message as read (SlideDown and SlideUp whole text of message)
    $(document).on('click', '.show_option', function (e) {
        $this = $(e.currentTarget);
        if ($this.parent().hasClass('shortText')) {
            $this.parent().hide();
            $this.parent().next().show();
            $this.parent().prev().css('font-weight', '400');
            _MSG_.markMsg($this.attr('msg-id'));
        }
        else {
            $this.parent().hide();
            $this.parent().prev().show();
        }
    });
    //Add message to favorite
    $(document).on('click', '.favorite.add', function (e) {
        $this = $(e.currentTarget);
        _MSG_.markMsgFav($this.val(), true);
        $this.removeClass('add').addClass('remove');
    });
    //Remove message from favorite
    $(document).on('click', '.favorite.remove', function (e) {
        $this = $(e.currentTarget);
        _MSG_.markMsgFav($this.val(), false);
        $this.removeClass('remove').addClass('add');
    });
    //Accept appointment
    $(document).on('click', '.apply.act_button', function (e) {
        $this = $(e.currentTarget);
        _MSG_.acceptAppointment($this.val());
        $this.parents('.not_text').append('<div class="acceptMini" style="margin-top: 10px;">Accepted</div>');
        $this.parent().remove();
    });
    //Deny appointment
    $(document).on('click', '.deny.pass_button', function (e) {
        $this = $(e.currentTarget);
        _MSG_.denyAppointment($this.val());
        $this.parents('.not_text').append('<div class="denyMini" style="margin-top: 10px;">Denied</div>');
        $this.parent().remove();
    });

    //Close message window
    $(document).on('click', '.close_box:not(.prevented), #lightbox:not(.prevented)', function (e) {
        $this = $(e.currentTarget);
        $('.box, .message_box, .mini_box, #lightbox, .editing_box, .add_project_box, .suggested_nuggets_box, .profile_info_box').fadeOut(200);
        _POPUP_.destroy();
    });
    //Create new message
    $(document).on('click', '#new_message', function (e) {
        $this = $(e.currentTarget);
        $parent = $('.standart_box').find('.message_input[name=recipient]').parent();
        if ($parent.hasClass('active')) {
            $parent.removeClass('active');
        }
        $('.standart_box').find('.message_input[name=recipient]').val("");
        $('.standart_box').find('.message_input[name=subject]').val("");
        $('.standart_box').find('button.send_message').val("");
        $('.standart_box').find('.message_input[name=text]').val("");
        $('.standart_box').find('.date_time_field').find('input').val("");
        $('#upload_file').text("Upload file");
        $('.message_box, #lightbox').fadeIn(200);
        $('#lightbox').addClass('prevented');
        _MSG_.getUserList();
    });
    //Search for Recipient
    $(document).on('keyup', '.standart_box .message_input[name=recipient]', function (e) {
        $this = $(e.currentTarget);
        $this.parents('.message_field').removeClass('active').find('#userList').remove();
        $('.standart_box').find('button.send_message').val("");
        if ($this.val().trim() != "") {
            $this.parents('.message_field').append(_MSG_.searchUser($this.val()));
        }
    });
    //Add recipient
    $(document).on('click', '#userList .recUser', function (e) {
        $this = $(e.currentTarget);
        $parent = $('.standart_box').find('.message_input[name=recipient]').parent();
        if (!$parent.hasClass('active')) {
            $parent.addClass('active');
        }
        $parent.find('button.expand_list').removeClass('opened');

        $('.standart_box').find('.message_input[name=recipient]').val($this.text());
        $('.standart_box').find('button.send_message').val($this.find('input[type=hidden]').val());
        $this.parents('#userList').remove();
    });
    //Reply to user
    $(document).on('click', '.reply.send_message', function (e) {
        $this = $(e.currentTarget);
        _MSG_.getUserList();

        $parent = $('.standart_box').find('.message_input[name=recipient]').parent();
        if (!$parent.hasClass('active')) {
            $parent.addClass('active');
        }
        $('.standart_box').find('.message_input[name=recipient]').val($this.parents('.not_text').find('.fas').text());
        $('.standart_box').find('.message_input[name=subject]').val("AW: " + $this.parent().find('.label_subject').text());
        $('.standart_box').find('button.send_message').val($this.val());
        $('.standart_box').find('.message_input[name=text]').val("");
        $('#regular_box').trigger('click');
        $('.message_box, #lightbox, .standart_box').fadeIn(200);
        $('#lightbox').addClass('prevented');
    });
    //Offer new time event
    $(document).on('click', '.new_time', function (e) {
        $this = $(e.currentTarget);
        _MSG_.getUserList();
        var dt_str = $this.parents('.not_text').find('.appointment_date').text();
        var date = dt_str.substring(0, dt_str.lastIndexOf(','));
        var startTime = dt_str.substring(dt_str.lastIndexOf(',') + 2, dt_str.indexOf('-'));
        var endTime = dt_str.substring(dt_str.indexOf('-') + 1);
        $('#dateApp').val(date);
        $('#startTimeApp').val(startTime);
        $('#endTimeApp').val(endTime);

        $parent = $('.standart_box').find('.message_input[name=recipient]').parent();
        if (!$parent.hasClass('active')) {
            $parent.addClass('active');
        }
        $('.standart_box').find('.message_input[name=recipient]').val($this.parents('.not_text').find('.fas').text());
        $('.standart_box').find('.message_input[name=subject]').val("AW: " + $this.parents('.not_text').find('.label_subject').text());
        $('.standart_box').find('button.send_message').val($this.val());
        $('.standart_box').find('.message_input[name=text]').val("");
        $('#appointment_box').trigger('click');
        $('.message_box, #lightbox, .standart_box').fadeIn(200);
        $('#lightbox').addClass('prevented');
    });
    //Remove user from recipient
    $(document).on('click', '.standart_box .message_field button.expand_list', function (e) {
        $this = $(e.currentTarget);
        if (!$this.hasClass('opened')) {
            $this.addClass('opened');
            $this.parents('.message_field').append(_MSG_.showAllRecipients());
        }
        else {
            $this.removeClass('opened');
            $('#userList').remove();
        }
    });
    //Send regular message
    $(document).on('click', '#regular_message', function (e) {
        $this = $(e.currentTarget);
        if ($('.standart_box').find('.message_input[name=recipient]').parent().hasClass('active') && $('.standart_box').find('.message_input[name=subject]').val().trim() != "" && $('.standart_box').find('.message_input[name=text]').val().trim() != "") {
            //Collect filenames
            var files = "";
            var names = "";
            $('.file_block').each(function (e) {
                if (e == 0) {
                    files += $(this).attr('file-hash');
                    names += $(this).text();
                }
                else {
                    files += ", " + $(this).attr('file-hash');
                    names += ", " + $(this).text();
                }
            });
            _MSG_.sendMessage($this.val(), $('.standart_box').find('.message_input[name=subject]').val().trim(), $('.standart_box').find('.message_input[name=text]').val().trim(), files, names);
        }
        else {
            $('body').append(_POPUP_.init("warning", "Please fill all fields!", "Continue", "close", false));
        }
    });
    //Send an appointment
    $(document).on('click', '#appointment_message', function (e) {
        $this = $(e.currentTarget);
        if ($('.standart_box').find('.message_input[name=recipient]').parent().hasClass('active') && $('.standart_box').find('.message_input[name=subject]').val().trim() != "" && $('.standart_box').find('.message_input[name=text]').val().trim() != "" && $('#dateApp').val() != "" && $('#startTimeApp').val() != "" && $('#endTimeApp').val() != "") {
            //Date contructor
            var appDate = $('#dateApp').val() + ", " + $('#startTimeApp').val() + "-" + $('#endTimeApp').val();

            //Collect filenames
            var files = "";
            var names = "";
            $('.file_block').each(function (e) {
                if (e == 0) {
                    files += $(this).attr('file-hash');
                    names += $(this).text();
                }
                else {
                    files += ", " + $(this).attr('file-hash');
                    names += ", " + $(this).text();
                }
            });

            _MSG_.sendAppointment($this.val(), appDate, $('.standart_box').find('.message_input[name=subject]').val().trim(), $('.standart_box').find('.message_input[name=text]').val().trim(), files, names);
        }
        else {
            $('body').append(_POPUP_.init("warning", "Please fill all fields!", "Continue", "close", true));
        }
    });

    //Ask if user wants to close message box
    $(document).on('click', '.close_box.prevented, #lightbox.prevented', function (e) {
        $this = $(e.currentTarget);
        if (_MSG_.checkBoxState($('.message_box'))) {
            _POPUP_.destroy();
            $('#lightbox').fadeOut(200).removeClass('prevented');
            $('.message_box').fadeOut(200);
        }
    });

    //Close message box
    $(document).on('click', '.popup .confirm_button.popup_message', function (e) {
        $this = $(e.currentTarget);
        _POPUP_.destroy();
        $('#lightbox').fadeOut(200).removeClass('prevented');
        $('.message_box').fadeOut(200);
    });

    //Delete uploaded file
    $(document).on('click', '.upload_field .file_block .delete', function (e) {
        $this = $(e.currentTarget);
        $this.parent().remove();
        if ($('.file_block').length < 5) {
            $('.message_field.upload_field').append('<button id="upload_file">Upload file</button>');
        }
    });

    //Init date&timePicker
    $('#dateApp').datetimepicker({
        timepicker: false,
        format: 'D, M d'
    });
    $('#startTimeApp').datetimepicker({
        datepicker: false,
        format: 'h:ia',
        step: 5
    });
    $('#endTimeApp').datetimepicker({
        datepicker: false,
        format: 'h:ia',
        step: 5
    });
    $('#project_start_date').datetimepicker({
        timepicker: false,
        format: 'm-Y'
    });
    $('#project_end_date').datetimepicker({
        timepicker: false,
        format: 'm-Y'
    });

    //Switch Message type
    $(document).on('click', '.message_type div', function (e) {
        $this = $(e.currentTarget);
        if (!$this.hasClass('active')) {
            $('.message_type div').removeClass('active');
            $this.addClass('active');
            if ($this.attr('id') == "regular_box") {
                $('.date_time_field').hide();
                $('.message_field').find('.send_message').attr('id', 'regular_message').text('Send message');
            }
            else {
                $('.date_time_field').show();
                $('.message_field').find('.send_message').attr('id', 'appointment_message').text('Ask for appointment');
            }
        }
    });

    //Get all Requests
    $(document).on('click', '.navRequest', function (e) {
        $this = $(e.currentTarget);
        if (!$this.hasClass('disable')) {
            $('.dropDown').hide();
            if (!$this.hasClass('active')) {
                $('.navIcon, #userPic_cover, #user_cover_mobile').removeClass('active');
                $('#dropRequest').show();
                $this.addClass('active');
                _NAV_.list('profiles/' + _GB_.user_id + '/requests?offset=0&limit=20', 'requestUpdate', false);
            }
            else {
                $('#dropRequest').hide();
                $this.removeClass('active');
            }
        }
    });


    //Add proposed skills
    $(document).on('click', '.add_skills', function (e) {
        $this = $(e.currentTarget);
        $cover_skill = $this.parents('.not_text').find('.skills_set');
        var skills = [];
        $i = 0;
        $cover_skill.find('.skill:not(.removed)').each(function (e) {
            skills[$i] = JSON.parse($(this).attr('fullSkillJSON'));
            $i++;
        });
        _REQ_.acceptPartiallyReq($this.attr('usr-id'), $this.val(), skills);
        $this.parents('.not_text').append('<div class="acceptMini" style="margin-top: 10px;">Added</div>');
        $this.parent().remove();
    });
    //Remove proposed skills
    $(document).on('click', '.deny_skills', function (e) {
        $this = $(e.currentTarget);
        _REQ_.denyReq($this.attr('usr-id'), $this.val());
        $this.parents('.not_text').append('<div class="denyMini" style="margin-top: 10px;">Denied</div>');
        $this.parent().remove();
    });
    //Remove one certain skill
    $(document).on('click', '.delete_skill, .add_proj, .delete_cv_cell', function (e) {
        $this = $(e.currentTarget);
        $this.parent().addClass('removed');
    });
    //Take removed skill back
    $(document).on('click', '.removed .delete_skill, .removed .add_proj, .removed .delete_cv_cell', function (e) {
        $this = $(e.currentTarget);
        $this.parent().removeClass('removed');
    });
    //Accept skills partially
    $(document).on('click', '.add_some_skills', function (e) {
        $this = $(e.currentTarget);
        $cover_skill = $this.parents('.not_text').find('.skills_set');
        var skills = [];
        $i = 0;
        $cover_skill.find('.skill:not(.removed)').each(function (e) {
            skills[$i] = JSON.parse($(this).attr('fullSkillJSON'));
            $i++;
        });
        _REQ_.acceptPartiallyReq($this.attr('usr-id'), $this.val(), skills);
        $this.parents('.not_text').append('<div class="acceptMini" style="margin-top: 10px;">Added</div>');
        $this.parent().remove();
    });

    //Search filters states
    $(document).on('click', '.filter_param', function (e) {
        $this = $(e.currentTarget);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
        else {
            $this.removeClass('active');
        }
    });

    //Search redirect
    $(document).on('click', '#searchBar button', function (e) {
        $this = $(e.currentTarget);
        // delete certain special characters from search string
        $searchstring = ($this.parent().find('input[name=ef_search]').val());
        $searchstring = $searchstring.replace(/[^\w\säöüßÄÖÜ\+\-\#\_]/gi, '');
        if ($searchstring.trim().length == 0)
            $searchstring = "please enter a search string";
        window.location.href = "/search/" + _GB_.encodeUrl($searchstring);
    });

    //Link to search page
    $(document).on('keyup', '#searchBar input[name=ef_search]', function (e) {
        $this = $(e.currentTarget);
        // delete certain special characters from search string
        $searchstring = $this.val();
        $searchstring = $searchstring.replace(/[^\w\säöüßÄÖÜ\+\-\#\_]/gi, '');
        if ($searchstring.trim().length == 0)
            $searchstring = "please enter a search string";
        if (e.which == 13) {
            window.location.href = "/search/" + _GB_.encodeUrl($searchstring);
        }
    });

    //Process all filters before sending search query
    $(document).on('click', '#filter_results', function (e) {
        $this = $(e.currentTarget);
        _SEARCH_.filters.Role_profile = [];
        _SEARCH_.filters.Department = [];
        _SEARCH_.filters.Experience = [];
        $('.filter_param.active').each(function (e) {
            var arr = $(this).parents('.filter').find('.filter_name').text();
            if (arr == "Role profile") {
                _SEARCH_.filters.Role_profile.push($(this).attr('param'));
            }
            else if (arr == "Department") {
                _SEARCH_.filters.Department.push($(this).attr('param'));
            }
            else if (arr == "Experience") {
                _SEARCH_.filters.Experience.push($(this).attr('param'));
            }
        });
        if (_GB_.section != null && _SEARCH_.load != true) {
            _SEARCH_.init();
            _SEARCH_.list(_GB_.section);
        }
    });

    //Switch between tabs
    $(document).on('click', '#search_users', function (e) {
        $this = $(e.currentTarget);

        if (!$this.hasClass('active')) {
            $('.search_tab').removeClass('active');
            $this.addClass('active');

            _SEARCH_.type = "profiles";
            if (_GB_.section != null && _SEARCH_.load != true) {
                _SEARCH_.init();
                _SEARCH_.list(_GB_.section);
            }
        }
    });

    $(document).on('click', '#search_projects', function (e) {
        $this = $(e.currentTarget);

        if (!$this.hasClass('active')) {
            $('.search_tab').removeClass('active');
            $this.addClass('active');

            _SEARCH_.type = "projects";
            if (_GB_.section != null && _SEARCH_.load != true) {
                _SEARCH_.init();
                _SEARCH_.list(_GB_.section);
            }
        }
    });

    $(document).on('click', '#search_nuggets', function (e) {
        $this = $(e.currentTarget);

        if (!$this.hasClass('active')) {
            $('.search_tab').removeClass('active');
            $this.addClass('active');

            _SEARCH_.type = "nuggets";
            if (_GB_.section != null && _SEARCH_.load != true) {
                _SEARCH_.init();
                _SEARCH_.list(_GB_.section);
            }
        }
    });

    //Show and hide search filters in mobile version
    $(document).on('click', '#filters_title', function (e) {
        $this = $(e.currentTarget);
        if (!$this.hasClass('active')) {
            $('#middle_container.mobile_view #filter_block').slideDown(200);
            $this.addClass('active');
        }
        else {
            $('#middle_container.mobile_view #filter_block').slideUp(200);
            $this.removeClass('active');
        }
    });

    //Show or hide additional contact data
    $(document).on('click', '#profile_info .contact_field.show_more span', function (e) {
        $this = $(e.currentTarget);
        if ($this.hasClass('opened')) {
            $this.removeClass('opened').text('Show more');
            $('.contact_field:eq(3), .contact_field:eq(4)').addClass('hidden');
        }
        else {
            $this.addClass('opened').text('Show less');
            $('.contact_field:eq(3), .contact_field:eq(4)').removeClass('hidden');
        }
    });

    //Switch between tabs on profile page
    $(document).on('click', '#profile_info .block_cover.profile_data .tab', function (e) {
        $this = $(e.currentTarget);
        $parent = $('#profile_info .block_cover.profile_data');
        if (!$this.hasClass('active')) {
            $('.tab').removeClass('active');
            $this.addClass('active');

            $parent.find('.full_block._new').fadeOut(200, function () {
                $(this).removeClass('active');
            });
            $parent.find('.full_block._new#' + $this.attr('attr-ref')).fadeIn(200, function () {
                $(this).addClass('active');
            });
        }
    });

    //Show and hide files on profile page
    $(document).on('click', '#profile_info .full_block#files #show_files', function (e) {
        $this = $(e.currentTarget);
        $parent = $('#profile_info .full_block#files');
        if (!$parent.hasClass('hidden')) {
            $parent.addClass('hidden');
            $this.text('Show files');
        }
        else {
            $parent.removeClass('hidden');
            $this.text('Hide files');
        }
    });

    //Open parent category
    $(document).on('click', '#profile_info .full_block#skills .parent_elem', function (e) {
        $this = $(e.currentTarget);
        if (!$this.hasClass('active')) {
            $('#profile_info .full_block#skills .parent_elem').removeClass('active');
            $this.addClass('active');
            $('#profile_info .full_block#skills .per_skills_block').removeClass('active');
            $('#profile_info .full_block#skills .per_skills_block[attr-parent="' + String($this.attr('attr-parent')) + '"]').addClass('active');
        }
    });

    //Delete certain Skill
    $(document).on('click', '#profile_info .skill.my_skills .delete_skill', function (e) {
        $this = $(e.currentTarget);
        $this.parent().fadeOut(200, function (e) {

            if ($('.per_skills_block.active').attr('attr-parent').trim() != "Others") {
                var cat_number = $(this).parents('.skill_set.second_level').find('.main_skill .skill .skill_rating').text();
                $(this).parents('.skill_set.second_level').find('.main_skill .skill .skill_rating').text(cat_number - 1);

                if (Number($(this).parents('.skill_set.second_level').find('.main_skill .skill .skill_rating').text()) == 0) {
                    var parent_cat_number = $(this).parents('.skill_set.first_level').find('.main_skill').first().find('.skill .skill_rating').text();
                    $(this).parents('.skill_set.first_level').find('.main_skill').first().find('.skill .skill_rating').text(parent_cat_number - 1);

                    if (Number($(this).parents('.skill_set.first_level').find('.main_skill').first().find('.skill .skill_rating').text()) == 0) {
                        $(this).parents('.skill_set.first_level').remove();
                    }
                    else {
                        $(this).parents('.skill_set.second_level').remove();
                    }
                }

                $(this).parent().remove();
            }
            else {
                var cat_number = $(this).parents('.skill_set.first_level').find('.main_skill .skill .skill_rating').text();
                $(this).parents('.skill_set.first_level').find('.main_skill .skill .skill_rating').text(cat_number - 1);

                $(this).remove();
            }

            _PF_.deleteSkill(JSON.parse($(this).attr('fullSkillJSON')));

            $('.full_block#metrics .metric.categories_metric .num_metric').text($('.full_block#skills .skill_set.second_level').length + 1);
            $('.full_block#metrics .metric.skills_metric .num_metric').text($('.full_block#skills .skill.my_skills').length);
        });
    });

    //Add new skill manually
    $(document).on('click', '#add_new_skills', function (e) {
        $this = $(e.currentTarget);
        if ($('#input_skill').val().trim() != "") {
            $('#profile_info .full_block #loading_skills').fadeIn(200);
            _PF_.addSkill($('#input_skill').val().trim());
            $('#input_skill').val("");
        }
    });

    $(document).on('keyup', '#input_skill', function (e) {
        $this = $(e.currentTarget);
        if (e.which == 13) {
            $('#add_new_skills').trigger('click');
        }
    });

    //Show or hide skills from category
    $(document).on('click', '.main_skill .skill', function (e) {
        $this = $(e.currentTarget);
        $elem = $this.closest('.skill_set');
        if ($elem.height() == 33) {
            $elem.height("auto");
        }
        else {
            $elem.height(33);
        }
    });

    //Add skill to endorsed partition
    $(document).on('click', '#endorse_button', function (e) {
        $this = $(e.currentTarget);
        if ($('#input_skill').val().trim() != "") {
            if ($('#endorse_skills').is(':hidden')) {
                $('#endorse_skills').show();
            }
            $('#endorse_skills').prepend("<div class='skill' source='/profile/" + _GB_.user_id + "'><div class='delete_skill'></div>" + $('#input_skill').val().trim() + "</div>");
            $('#input_skill').val("");

            //Change height of two blocks under endorse block
            var marginTop = $('#endorse_skills').height() + Number(41);
            $('#cat_skill_block').css('height', 'calc(100% - 84px - ' + marginTop + 'px)');
            $('#parent_block').css('height', 'calc(100% - 74px - ' + marginTop + 'px)');
        }
    });

    //Remove skill from endorsed partition
    $(document).on('click', '#endorse_skills .skill .delete_skill', function (e) {
        $this = $(e.currentTarget);
        $(this).parent().remove();

        //Change height of two blocks under endorse block
        var marginTop = $('#endorse_skills').height() + Number(41);
        $('#cat_skill_block').css('height', 'calc(100% - 84px - ' + marginTop + 'px)');
        $('#parent_block').css('height', 'calc(100% - 74px - ' + marginTop + 'px)');

        if ($('#endorse_skills .skill .delete_skill').length == 0) {
            $('#endorse_skills').hide();
            $('#cat_skill_block').removeAttr('style');
            $('#parent_block').removeAttr('style');
        }
    });

    //Endorse skills to another user
    $(document).on('click', '#endorse_all', function (e) {
        $this = $(e.currentTarget);
        if ($('#endorse_skills .skill .delete_skill').length != 0) {
            var skills = [];
            $i = 0;
            $('#endorse_skills .skill').each(function (e) {
                var localObj = { name: $(this).text(), source: $(this).attr('source') };
                skills[$i] = localObj;
                $i++;
            });
            _PF_.sendRequest(skills);
            $('#endorse_skills').hide();
            $('#endorse_skills .skill').remove();
            $('#cat_skill_block').removeAttr('style');
            $('#parent_block').removeAttr('style');
        }
    });

    //Open computer directory to choose file for uploading new skills from there
    $(document).on('click', '#upload_skills', function (e) {
        $this = $(e.currentTarget);
        if (!$('#upload_skills').hasClass('loading')) {
            $('#skills_uploading').trigger('click');
        }
    });

    //Upload skills from document
    $(document).on('change', '#skills_uploading', function (e) {
        $this = $(e.currentTarget);
        $('#upload_skills').text('').addClass('loading');
        _PF_.loadSkills($this.attr('id'), "skills_set_block");
    });

    //Open computer directory to choose file for uploading new skills from there
    $(document).on('click', '#upload_cv', function (e) {
        $this = $(e.currentTarget);
        if (!$('#upload_cv').hasClass('loading')) {
            $('#cv_uploading').trigger('click');
        }
    });

    //Upload skills from document
    $(document).on('change', '#cv_uploading', function (e) {
        $this = $(e.currentTarget);
        $('#upload_cv').text('').addClass('loading');
        _PF_.loadCV($this.attr('id'), "cv_set_block");
    });

    $(document).on('click', '.skill_set_name', function (e) {
        $this = $(e.currentTarget);
        if ($this.hasClass('active')) {
            $this.parents('.skill_set').find('.skill.my_skills').addClass('removed');
            $this.removeClass('active');
        }
        else {
            $this.parents('.skill_set').find('.skill.my_skills').removeClass('removed');
            $this.addClass('active');
        }
    });

    $(document).on('click', '.cv_set_name', function (e) {
        $this = $(e.currentTarget);
        if ($this.hasClass('active')) {
            $this.parents('.cv_set').find('.cv_cell').addClass('removed');
            $this.removeClass('active');
        }
        else {
            $this.parents('.cv_set').find('.cv_cell').removeClass('removed');
            $this.addClass('active');
        }
    });

    $(document).on('click', '.skill_set .slide_arrow', function (e) {
        $this = $(e.currentTarget);
        if ($this.hasClass('up')) {
            $this.parents('.skill_set').css({ height: "auto" });
            $this.removeClass('up');
        }
        else {
            $this.parents('.skill_set').css({ height: "50px" });
            $this.addClass('up');
        }
    });

    $(document).on('click', '.cv_set .slide_arrow', function (e) {
        $this = $(e.currentTarget);
        if ($this.hasClass('up')) {
            $this.parents('.cv_set').css({ height: "auto" });
            $this.removeClass('up');
        }
        else {
            $this.parents('.cv_set').css({ height: "50px" });
            $this.addClass('up');
        }
    });

    $(document).on('click', '#add_to_project', function (e) {
        $this = $(e.currentTarget);
        if ($this.hasClass('active')) {
            $('.skill.my_skills._minibox').attr('project', "");
            $this.removeClass('active');
        }
        else {
            $('.skill.my_skills._minibox').attr('project', _PF_.skill_project_name);
            $this.addClass('active');
        }
    });

    //Add skills from proposed skills which were extracted from uploaded file
    $(document).on('click', '.standart_box #update_uploaded_skills', function (e) {
        $this = $(e.currentTarget);
        var acceptedSkills = [];
        var rejectedSkills = [];
        $i = 0;
        $j = 0;
        $('.skill.my_skills._minibox').each(function (e) {
            var localObj = { "name": $(this).text(), "project": $(this).attr('project'), "stem": $(this).attr('stem'), "source": $(this).attr('source'), "category": JSON.parse($(this).attr('category')) };
            if ($(this).hasClass('removed')) {
                rejectedSkills[$j] = localObj;
                $j++;
            }
            else {
                acceptedSkills[$i] = JSON.parse($(this).attr('fullSkillJSON'));//localObj;
                $i++;
            }
        });

        _PF_.updateSkills(acceptedSkills, rejectedSkills, true);
        $('#lightbox').trigger('click');
    });

    //Edit skills
    $(document).on('click', '#profile_info .full_block#skills .skill.my_skills .edit_skill_button', function (e) {
        $this = $(e.currentTarget);
        $skill = $this.parents('.skill');
        $('#profile_info .full_block#skills .skill.my_skills').removeClass('editing_mode');
        $skill.addClass('editing_mode');
        $box = $('.editing_box').find('.standart_box');

        $box.find('#skill_title').val($skill.find('.skill_text').text().trim()).attr('default', $skill.find('.skill_text').text().trim());
        $box.find('#skill_source').val($skill.attr('source').trim()).attr('default', $skill.attr('source').trim());
        if ($skill.attr('source').trim() == "" || $skill.attr('source').trim() == "#") {
            $('#remove_or_return').hide();
            $box.find('#skill_source').css('background-color', '#EEE').val("");
            $box.find('#skill_source').attr('default', '');
        }

        $box.find('#skill_project').html('<option selected="selected" value="' + $skill.attr('project').trim() + '">' + $skill.attr('project').trim() + '</option>').attr('default', $skill.attr('project').trim());
        $box.find('#skill_category').html('<option selected="selected" class="skill_category_current" value="' + $skill.attr('category').trim() + '">' + $skill.attr('category').trim() + '</option>').attr('default', $skill.attr('category').trim());

        _PF_.getProjectList($box.find('#skill_project'), $skill.attr('project').trim());
        _PF_.getCategoryList($box.find('#skill_category'), $skill.attr('category').trim());

        $('#change_skill_data').val($skill.attr('_id'));

        $('#lightbox, .editing_box').fadeIn(200);
    });

    $(document).on('click', '#remove_or_return', function (e) {
        $this = $(e.currentTarget);
        if ($box.find('#skill_source').attr('default').trim() != "") {
            if ($this.hasClass('removed')) {
                $box.find('#skill_source').val($box.find('#skill_source').attr('default').trim());
                $this.removeClass('removed');
            }
            else {
                $box.find('#skill_source').val("");
                $this.addClass('removed');
            }
        }
    });

    $(document).on('click', '#change_skill_data', function (e) {
        $this = $(e.currentTarget);
        $box = $('.editing_box').find('.standart_box');

        var id = $this.val(); // Needs to be adjusted
        var new_skill = { "name": $box.find('#skill_title').val().trim(), "project": $box.find('#skill_project').val().trim(), "category": JSON.parse($box.find('#skill_category').val()), "source": $box.find('#skill_source').val().trim() };
        _PF_.editSkill(id, new_skill);
    });

    //Add new project to profile
    $(document).on('click', '#profile_info #add_project', function (e) {
        $this = $(e.currentTarget);
        var projects = [];
        $('#profile_info .project').each(function (e) {
            projects.push($(this).find('a').attr('attr-source').trim());
        });
        _PF_.getAllProjectsFromList(projects);
    });

    $(document).on('click', '.add_project_box #update_projects', function (e) {
        $this = $(e.currentTarget);
        var projects = [];
        $('#projects_choosing_block ._project').each(function (e) {
            if (!$(this).hasClass('removed')) {
                projects.push({ "name": $(this).attr('attr-source').trim() });
            }
        });
        _PF_.addProjectsToProfile(projects);
    });

    //Delete project
    $(document).on('click', '#profile_info .project .delete_obj', function (e) {
        $this = $(e.currentTarget);
        if (_GB_.user_id == _GB_.section && _GB_.page_id == 6) {
            var source = $this.parents('.project').find('a').attr('attr-source');
            $elem = $this.parents('.project').index();
            $('body').prepend("<div class='popup warning'>Would you like to remove this project?" +
			"<button class='half_button confirm_button project_popup' source='" + source + "' value='" + $this.val() + "' elem='" + $elem + "'>Yes</button><button class='half_button cancel_button'>Cancel</button></div>");
            $('body').prepend('<div id="lightbox_popup"></div>');
        }
    });

    //Delete project
    $(document).on('click', '#profile_info .file_set .delete_obj', function (e) {
        $this = $(e.currentTarget);
        if (_GB_.user_id == _GB_.section && _GB_.page_id == 6) {
            var source = $this.parent().find('a').attr('href');
            $elem = $this.parents('.file_set').index();
            $('body').prepend("<div class='popup warning'>Would you like to remove this file?" +
			"<button class='half_button confirm_button file_popup' source='" + source + "' value='" + $this.val() + "' elem='" + $elem + "'>Yes</button><button class='half_button cancel_button'>Cancel</button></div>");
            $('body').prepend('<div id="lightbox_popup"></div>');
        }
    });

    $(document).on('click', '.popup button.confirm_button.file_popup, .popup button.confirm_button.project_popup', function (e) {
        $this = $(e.currentTarget);
        _PF_.removeObjFromProfile($this.attr('source'), $this.val(), $this.attr('elem'));
    });

    $(document).on('click', '.popup button.cancel_button', function (e) {
        $this = $(e.currentTarget);
        _POPUP_.destroy();
    });

    $(document).on('click', '#update_profile_info', function (e) {
        $this = $(e.currentTarget);
        var obj = {};
        $('.cv_cell').each(function (e) {
            if (!$(this).hasClass('removed')) {
                var category = $(this).attr('attr-category');
                var data = $(this).attr('data');
                if (category != "profile") {
                    var parseData = JSON.parse(data);
                    if (obj[category] !== undefined) {
                        obj[category].push(parseData);
                    }
                    else {
                        obj[category] = [parseData];
                    }
                }
                else {
                    var type = $(this).attr('attr-profile');
                    obj[type] = data;
                }
            }
        });
        $('#update_profile_info').text('Updating profile...');
        _CONNECT_.updateProfile(obj);
    });

    //Open window to create message or appointment
    $(document).on('click', '#create_message', function (e) {
        $this = $(e.currentTarget);
        _MSG_.getUserList();
        $parent = $('.standart_box').find('.message_input[name=recipient]').parent();
        if (!$parent.hasClass('active')) {
            $parent.addClass('active');
        }
        $('.standart_box').find('.message_input[name=recipient]').val($('#user_name').text());
        $('.standart_box').find('button.send_message').val($this.val());
        $('#regular_box').trigger('click');
        $('.message_box, #lightbox, .standart_box').fadeIn(200);
        $('#lightbox').addClass('prevented');
    });
    $(document).on('click', '#create_appointment', function (e) {
        $this = $(e.currentTarget);
        _MSG_.getUserList();
        $parent = $('.standart_box').find('.message_input[name=recipient]').parent();
        if (!$parent.hasClass('active')) {
            $parent.addClass('active');
        }
        $('.standart_box').find('.message_input[name=recipient]').val($('#user_name').text());
        $('.standart_box').find('button.send_message').val($this.val());
        $('#appointment_box').trigger('click');
        $('.message_box, #lightbox, .standart_box').fadeIn(200);
        $('#lightbox').addClass('prevented');
    });

    //Init dialog box when one of the accounts is clicked
    $(document).on('click', '#profile_info .social_field', function (e) {
        $this = $(e.currentTarget);
        var popup = "";
        if (!_PF_.accounts[$this.attr('value')].isSet) {
            var params_str = "";
            if ($this.attr('value') != "Dropbox") {
                $.each(_PF_.accounts[$this.attr('value')], function (ind, val) {
                    var keyStr = String(ind);
                    if (keyStr != "isSet") {
                        var type = "text";
                        if (keyStr == "password") {
                            type = "password";
                        }
                        params_str += '<div class="message_field">' +
				    	keyStr + ':<br/><input type="' + type + '" attr-param="' + keyStr + '" class="message_input popup_required" name="' + keyStr.toLowerCase() + '" placeholder="Please enter ' + keyStr.toLowerCase() + '" />' +
				  	'</div>';
                    }
                });
            }
            popup = "<div class='popup medium_size'>" +
			"<div class='close_box'></div><div id='popup_header' style='background-image: url(" + $this.find('img').attr('src') + ");'>Enter credentials for your <b>" + $this.attr('value') + "</b> profile</div>" +
			params_str + "<button id='setAccountCredentials' value='" + $this.attr('value') + "'>Set credentials</button></div>";
        }
        else {
            popup = "<div class='popup medium_size' style='padding-bottom: 25px;'>" +
			"<div class='close_box'></div><div id='popup_header' style='background-image: url(" + $this.find('img').attr('src') + "); margin-bottom: 0px;'>You've already authorized in <b>" + $this.attr('value') + "</b> service!<br/>Would you like to get data from there?" +
			_CONNECT_.showOptions($this.attr('value')) + "<br/><br/><span class='link_span' id='change_credentials' value='" + $this.index() + "'>Change credentials</span></div></div>";
        }
        $('body').prepend(popup);
        $('#lightbox, .popup').fadeIn(200);
    });

    $(document).on('click', '#profile_info .open_social_account', function (e) {
        $this = $(e.currentTarget);
        $('#profile_info .social_field').each(function (e) {
            var val = $(this).attr('value');
            if ($this.val() == val) {
                $(this).trigger('click');
            }
        });
    });

    //Change credentials form
    $(document).on('click', '.popup #change_credentials', function (e) {
        $elem = $(e.currentTarget);
        $('.popup').remove();
        $this = $('#profile_info .social_field:eq(' + ($elem.attr("value") - 1) + ')');
        var popup = "";
        var params_str = "";
        if ($this.attr('value') != "Dropbox") {
            $.each(_PF_.accounts[$this.attr('value')], function (ind, val) {
                var keyStr = String(ind);
                if (keyStr != "isSet") {
                    var type = "text";
                    if (keyStr == "password") {
                        type = "password";
                    }
                    params_str += '<div class="message_field">' +
			    	keyStr + ':<br/><input type="' + type + '" attr-param="' + keyStr + '" class="message_input popup_required" name="' + keyStr.toLowerCase() + '" placeholder="Please enter ' + keyStr.toLowerCase() + '" value="' + val + '" />' +
			  	'</div>';
                }
            });
        }
        popup = "<div class='popup medium_size'>" +
		"<div class='close_box'></div><div id='popup_header' style='background-image: url(" + $this.find('img').attr('src') + ");'>Enter credentials for your <b>" + $this.attr('value') + "</b> profile</div>" +
		params_str + "<button id='setAccountCredentials' value='" + $this.attr('value') + "'>Change credentials</button></div>";
        $('body').prepend(popup);
        $('.popup').fadeIn(200);
    });

    //Set credentials
    $(document).on('click', '#setAccountCredentials', function (e) {
        $this = $(e.currentTarget);
        var flag = false;
        var arr = {};
        $('.message_input.popup_required').each(function (e) {
            if ($(this).val().trim() == "") {
                $(this).addClass('error_input');
                flag = true;
            }
            else {
                var param = $(this).attr('attr-param');
                arr[param] = $(this).val();
            }
        });
        if (!flag) {
            _CONNECT_.setAccountCredentials($this.val(), arr);
        }
    });

    //Parse actual account
    $(document).on('click', '.connect_option', function (e) {
        $this = $(e.currentTarget);
        _CONNECT_.getDataFromAccount($this.attr('res'), $this.attr('value'));
    });

    //Remove warning border if start editing
    $(document).on('keyup', '.message_input.popup_required', function (e) {
        $this = $(e.currentTarget);
        $this.removeClass('error_input');
    });

    //Project page
    //Show or hide detailed description
    $(document).on('click', '#show_desc', function (e) {
        $this = $(e.currentTarget);
        if ($this.hasClass('active')) {
            $('#proj_desc').css({ 'max-height': '114px' });
            $this.text('Show more').removeClass('active');
        }
        else {
            $('#proj_desc').css({ 'max-height': 'none' });
            $this.text('Show less').addClass('active');
        }
    });

    //Recommendation slider
    $(document).on('click', '#bottom_user_cover .recommend_arr', function (e) {
        $this = $(e.currentTarget);
        var lng = $('.recommend_row').length;
        if (lng > 1) {
            if ($this.hasClass('prev_arr')) {
                if ($('.recommend_row.active').index() == 1) {
                    _PF_.processSlides($('.recommend_row.active'), $('.recommend_row:eq(' + (lng - 1) + ')'));
                }
                else {
                    _PF_.processSlides($('.recommend_row.active'), $('.recommend_row.active').prev());
                }
            }
            else if ($this.hasClass('next_arr')) {
                if ($('.recommend_row.active').index() == lng) {
                    _PF_.processSlides($('.recommend_row.active'), $('.recommend_row:eq(0)'));
                }
                else {
                    _PF_.processSlides($('.recommend_row.active'), $('.recommend_row.active').next());
                }
            }
        }
    });

    //Content nugget
    $(document).on('keyup', '#nugget_container #nugget_title, #nugget_container #wysiwyg_editor', function (e) {
        $this = $(e.currentTarget);
        if ($('#nugget_container #nugget_title').val().trim() != "" && $('#nugget_container #wysiwyg_editor').html().trim() != "") {
            $('#nugget_container .nugget_confirm_button').removeClass('disabled');
        }
        else {
            $('#nugget_container .nugget_confirm_button').addClass('disabled');
        }
    });

    //Upload file to nugget
    $(document).on('click', '#nugget_container #attach_file', function (e) {
        $this = $(e.currentTarget);
        if (!$this.hasClass('loading')) {
            $('#nugget_file_uploading').trigger('click');
        }
    });

    $(document).on('change', '#nugget_file_uploading', function (e) {
        $this = $(e.currentTarget);
        $('#nugget_container #attach_file').addClass('loading');
        _NUGGET_.nugget.attachFileToNugget($this.attr('id'), $('#nugget_container #attachment_section'));
    });

    $(document).on('click', '#nugget_container .local_tags .tag .delete_tag', function (e) {
        $this = $(e.currentTarget);
        if ($this.parent().hasClass('removed')) {
            $this.parent().removeClass('removed');
        }
        else {
            $this.parent().addClass('removed');
        }
    });

    $(document).on('click', '#nugget_container .file_item .delete', function (e) {
        $this = $(e.currentTarget);
        $this.parent().next().remove();
        $this.parent().remove();
    });

    //Show similar nuggets
    $(document).on('click', '#nugget_container #create_nugget.nugget_confirm_button', function (e) {
        $this = $(e.currentTarget);
        if ($('#nugget_container #nugget_title').val().trim() != "" && $('#nugget_container #wysiwyg_editor').html().trim() != "" && !$('#nugget_container #attach_file').hasClass('loading')) {
            $('#list_of_suggested_nuggets').html("");
            var tags = _NUGGET_.nugget.packTags($('#nugget_tags'), $('.tag'));
            var files = [];
            $('.file_item').each(function () {
                files.push($(this).attr('file-url'));
            });
            $('#nugget_container #create_nugget.nugget_confirm_button').text("Posting...");
            _NUGGET_.nugget.edit(_GB_.user_id, $('#nugget_container #nugget_title').val().trim(), $('#nugget_container #wysiwyg_editor').html().trim(), $('#nugget_type').val(), files, tags, function () {
                _NUGGET_.nugget.getSimilar($('suggested_nuggets_box'), function (content) {
                    if (content == "") {
                        //$('.suggested_nuggets_box #save_new_nugget').trigger('click');
                    }
                });
                $('#lightbox, .suggested_nuggets_box').fadeIn(200);
            });
        }
    });

    //Create new nugget
    $(document).on('click', '.suggested_nuggets_box #save_new_nugget', function (e) {
        $this = $(e.currentTarget);
        $('.suggested_nuggets_box .close_box').trigger('click');
        $('#nugget_container #create_nugget.nugget_confirm_button').text("Posting...");
    });

    //Edit nugget
    $(document).on('click', '#nugget_container #edit_nugget.nugget_confirm_button', function (e) {
        $this = $(e.currentTarget);
        if ($('#nugget_container #nugget_title').val().trim() != "" && $('#nugget_container #wysiwyg_editor').html().trim() != "" && !$('#nugget_container #attach_file').hasClass('loading')) {
            var tags = _NUGGET_.nugget.packTags($('#nugget_tags'), $('.tag'));
            var files = [];
            $('.file_item').each(function () {
                files.push($(this).attr('file-url'));
            });
            $this.text("Saving...");
            _NUGGET_.nugget.edit(_GB_.user_id, $('#nugget_container #nugget_title').val().trim(), $('#nugget_container #wysiwyg_editor').html().trim(), $('#nugget_type').val(), files, tags);
        }
    });

    //Create empty post
    $(document).on('click', '.nuggetPage', function (e) {
        $this = $(e.currentTarget);
        _NUGGET_.nugget = new _NUGGET_.ContentNugget();
        _NUGGET_.nugget.create(_GB_.user_id);
    });

});
