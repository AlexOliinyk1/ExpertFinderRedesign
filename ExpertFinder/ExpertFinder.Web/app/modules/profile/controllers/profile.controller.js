(function () {
    "use strict";

    function ProfileController($scope, $stateParams, profileService) {
        var vm = this;
        var currentId = global.consts.testUser;

        vm.loading = false;
        vm.loadingSimilar = false;
        vm.user = {};
        vm.userTags = [];
        vm.similarProfiles = [];
        vm.init = init;
        vm.loadProfile = loadProfile;

        function loadProfile() {
            vm.loading = true;
            profileService.getProfile(currentId)
                .then(function (result) {
                    vm.user = result;
                    vm.loading = false;
                    loadSimilarProfiles();
                });
        }

        function loadSimilarProfiles() {
            vm.loadingSimilar = true;
            profileService.getSimilarProfiles(currentId)
                .then(function (result) {
                    vm.similarProfiles = result;
                    vm.loadingSimilar = false;
                });
        }

        function init() {
            //  TODO: need to change css to avoid this
            $('.container.clearfix').addClass('wideBlock');
            currentId = $stateParams.profileId;
            loadProfile();
        }

        function destroy() {
            $('.container.clearfix').removeClass('wideBlock');
        }

        //  TODO: need to change css to avoid this
        $scope.$on("$destroy", destroy);
    }

    ProfileController.$inject = ['$scope', '$stateParams', 'ProfileService'];

    angular.module('expert.profile')
        .controller('ProfileCtrl', ProfileController);
})();

var _PF_ = {

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