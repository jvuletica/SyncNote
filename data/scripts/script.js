$(function() {

    //sets defaults for custom confirm dialog
    alertify.defaults.transition = "fade";
    alertify.defaults.closable = false;
    alertify.defaults.movable = false;

    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April",
    "May", "June", "July", "August", "September", "October",
    "November", "December"];
    //wraps execCommand and accepts commands from editor buttons
    function editorCommand(command) {
        document.execCommand(command, false, null);
    }

    //prepends note html into note container
    function addNote() {
        $("#note-container").prepend($(''
        + '<div class="note">'
        + '<div class="note-controls-wrapper">'
        + '<div title="Calendar" id="calendar-btn" class="note-controls"></div>'
        + '<div title="Close" id="remove-note-btn" class="note-controls"></div>'
        + '</div>'
        + '<div class="note-content"></div>'
        + '</div>').fadeIn(200));
    }

    //activates note and transfers content into editor
    function activateNote(selected_note) {
        $(".active").removeClass("active");
        selected_note.addClass("active");
        var note_content = selected_note.find(".note-content").html();
        $("#editor_box").html(note_content);
        $("#editor_box").focus();
    }

    //checks if activated note exists, if not, creates a new one
    function ifNotActiveCreate() {
        if(!$(".note").hasClass("active")) {
            addNote();
            activateNote($(".note").first());
        }
    }

    //returns number of days in a certain month and the name of first day
    function daysInMonth(month,year) {
        var first_day = new Date(year, month, 1).getDay();
        var days_count = new Date(year, month + 1, 0).getDate();
        var day_name = weekdays[first_day];
        return [days_count, first_day];
    }

    function createCalendar() {
        var date = new Date();
        var day = date.getDate();
        var month_num = date.getMonth();
        var year = date.getFullYear();
        $("#month").text(months[month_num] + " " + year);
        var cells = $("td:not(.days)");
        cells.each(function() {
            $(this).text("");
        });
        var day_stats = daysInMonth(month_num, year);
        var i = day_stats[1];
        var end = day_stats[0] + i - 1;
        var j = 1;
        for (i; i <= end; i++) {
            $(cells[i]).text(j);
            j++;
        }
        $("td:contains('"+day+"')").addClass("present_day");
    }

    function fillCalendar(direction) {
        $("footer, #date_apply").css("display", "none");
        var date = $("#month").text().split(" ");//month, year
        var month_num = months.indexOf(date[0]);
        var year = parseInt(date[1]);
        var present_date = new Date();
        var present_day = present_date.getDate();
        var present_month = present_date.getMonth();
        var present_year = present_date.getFullYear();
        //increments/decrements months and checks for start/end of year
        if(direction == "next"){
            month_num == 11 ? (month_num = 0, year++) : month_num++;
        }
        else if(direction == "previous"){
            month_num == 0 ? (month_num = 11, year--) : month_num--;            
        }
        //fades out, fills calendar table, month and year, fades in
        $("#calendar").fadeToggle(160, function() {
            $(this).fadeToggle(160);
            $(".present_day").removeClass("present_day");
            $("#month").text(months[month_num] + " " + year);
            var cells = $("td:not(.days)");
            cells.each(function() {
                $(this).text("");
            });
            var day_stats = daysInMonth(month_num, year);
            var i = day_stats[1];
            var end = day_stats[0] + i - 1;
            var j = 1;
            for (i; i <= end; i++) {
                $(cells[i]).text(j);
                j++;
            }
            //marks present day
            if(month_num == present_month && year == present_year) {
                $("td:contains('"+present_day+"')").addClass("present_day");
            }
        });
    }
    //returns true for clicked date in past
    function checkIfInPast() {
        var date = $("#month").text().split(" ");//month, year
        var month_num = months.indexOf(date[0]);
        var year = parseInt(date[1]);
        var day = parseInt($(".selected").text());
        var present_date = new Date();
        var present_day = present_date.getDate();
        var present_month = present_date.getMonth();
        var present_year = present_date.getFullYear();
        if((day < present_day) && (month_num == present_month) && (year == present_year)) {
            return true;
        }
        if((month_num < present_month) && (year == present_year)) {
            return true;
        }
        if(year < present_year) return true;

        return false;
    }

    function warnPastDate() {
        $("#date_apply").fadeOut(200);
        var footer = $("#calendar footer");
        footer.find("#clock_wrapper").css("display", "none");
        footer.finish();
        footer.fadeIn();
        footer.find("#warning_wrapper").fadeIn();
        footer.fadeOut(2000);
        $(".selected").removeClass("selected");
    }

    function activateDate() {
        var footer = $("#calendar footer");
        footer.find("#warning_wrapper").css("display", "none");
        footer.finish();
        footer.fadeIn();
        footer.find("#clock_wrapper").fadeIn();
        $("#date_apply").fadeIn();
    }
    function setClock(selected) {
        var hour = parseInt($("#hour").text().replace("h", ""));
        var minutes = parseInt($("#minutes").text().replace("m", ""));
        if(selected == "up") {
            if($("#minutes").hasClass("chosen")){
                minutes == 59 ? (minutes = 0, hour++) : minutes++;
                if(hour == 24) hour = 0;
            }
            if($("#hour").hasClass("chosen")){
                hour == 23 ? hour = 0 : hour++;
            }
        }
        if(selected == "down") {
            if($("#minutes").hasClass("chosen")){
                minutes == 0 ? (minutes = 59, hour--) : minutes--;
                if(hour == -1) hour = 23;
            }
            if($("#hour").hasClass("chosen")){
                hour == 0 ? hour = 23 : hour--;
            }
        }
        hour = String(hour);
        minutes = String(minutes);
        if(hour.length == 1) hour = "0" + hour;
        if(minutes.length == 1) minutes = "0" + minutes;
        $("#hour").text(hour+"h");
        $("#minutes").text(minutes+"m");
    }
    function applyNotification() {
        var date = $("#month").text().split(" ");//month, year
        var month = date[0];
        var year = date[1];
        var day = $(".selected").text();
        var hour = $("#hour").text();
        var minutes = $("#minutes").text();
        var date_string = day + " " + month + " " + year;
        var time_string = hour + " : " + minutes;
        $(".note.active").attr("data-date", date_string);
        $(".note.active").attr("data-time", time_string);
        $("#date").text(date_string);
        $("#time").text(time_string);
        $("#calendar").css("display", "none");
        $("#notification_wrapper").fadeIn();
    }
    function cancelNotification() {
        $(".note.active").removeAttr("data-date");
        $(".note.active").removeAttr("data-time");
        $("#notification_wrapper").css("display", "none");
        createCalendar();
        $("#calendar").fadeIn(function() {
            $("#calendar header").fadeIn();
        });
    }
    function showNotification(note_selector) {
        var date_string = note_selector.attr("data-date");
        var time_string = note_selector.attr("data-time");
        $("#date").text(date_string);
        $("#time").text(time_string);
        $("#editor_box").css("display", "none");
        $(".tb-button").css("display", "none");
        $("#calendar").css("display", "none");
        $("#notification_wrapper").fadeIn();
    }

    //WYSIWYG editor buttons
    $("#bold").on("click", function() {
        editorCommand("bold");
    });
    $("#italic").on("click", function() {
        editorCommand("italic");
    });
    $("#underline").on("click", function() {
        editorCommand("underline");
    });
    $("#strikethrough").on("click", function() {
        editorCommand("strikethrough");
    });
    $("#outdent").on("click", function() {
        editorCommand("outdent");
    });
    $("#indent").on("click", function() {
        editorCommand("indent");
    });
    $("#subscript").on("click", function() {
        editorCommand("subscript");
    });
    $("#superscript").on("click", function() {
        editorCommand("superscript");
    });
    $("#removeformat").on("click", function() {
        editorCommand("removeFormat");
    });
    $("#align_left").on("click", function() {
        editorCommand("justifyLeft");
    });
    $("#align_center").on("click", function() {
        editorCommand("justifyCenter");
    });
    $("#align_right").on("click", function() {
        editorCommand("justifyRight");
    });
    $("#align_justify").on("click", function() {
        editorCommand("justifyFull");
    });
    $("#undo").on("click", function() {
        editorCommand("undo");
    });
    $("#redo").on("click", function() {
        editorCommand("redo");
    });

    //click effect on buttons
    $("button").on("click",function() {
        $(this).fadeOut(160, function() {
            $(this).fadeIn(160);
        });
    });

    //adds new empty note and activates it, displays appropriate wrapper
    $("#add").on("click", function() {
        var display_state = $("#note_preview_wrapper").css("display");
        if(display_state == "none") {
            $("body > :not(#controls_wrapper)").fadeOut();
            $("#note_preview_wrapper").fadeIn();
            $("#editor_wrapper").fadeIn();
        }
        else {
            addNote();
            activateNote($(".note").first());
            if($("#editor_box").css("display") == "none") {
                $("#notification_wrapper").css("display", "none");
                $("#editor_box").fadeIn();
                $(".tb-button").fadeIn();
            }
        }      
    });
    $("#login").on("click", function() {
        $("body > :not(#controls_wrapper)").fadeOut();
        $("#login_wrapper").fadeIn();
    });
    $("#options").on("click", function() {
        $("body > :not(#controls_wrapper)").fadeOut();
        $("#options_wrapper").fadeIn();
    });

    // caching the note-container selector
    var container = $("#note-container");

    //shows confirm dialog and removes note if confirmed
    container.on("click", "#remove-note-btn", function() {
        $(this).parent().parent().attr("id", "remove");
        alertify.dialog('confirm').set({
            "labels":{ok:"Confirm", cancel:"Cancel"},
            "title": "Warning!",
            "message": "Do you want to delete this note?",
            "onok": function(){
                $("#remove").remove();
                $("#editor_box").empty();
            },
            "oncancel": function(){$("#remove").removeAttr("id");}
        }).show();
    });

    container.on("click", "#calendar-btn", function() {
        var this_note = $(this).parent().parent();
        var this_attr = this_note.attr("data-date");
        if(typeof this_attr == typeof "string") showNotification(this_note);
        else {
            createCalendar();
            $("#editor_box").css("display","none");
            $(".tb-button").css("display","none");
            $("#notification_wrapper").css("display","none");
            $("#calendar").fadeIn(function() {
                $("#calendar header").fadeIn();
            });
        }
        $(".selected").removeClass("selected");
        $("footer, #date_apply").css("display", "none");
        activateNote(this_note);
        return false;//prevent propagation of click to parent
    });

    $("#cal-left").on("click", function() {
        fillCalendar("previous");
        $(".selected").removeClass("selected");
    });
    $("#cal-right").on("click", function() {
        fillCalendar("next");
        $(".selected").removeClass("selected");
    });

    //monitors click on note previews and transfers content to editor
    container.on("click", ".note", function() {
        if($("#calendar").css("display")=="block") {
            $("#calendar").css("display", "none");
            $("#calendar header").css("display", "none");
            $("#editor_box").fadeIn();
            $(".tb-button").fadeIn();
        }
        else if($("#notification_wrapper").css("display")=="block") {
            $("#notification_wrapper").css("display", "none");
            $("#editor_box").fadeIn();
            $(".tb-button").fadeIn();
        }
        activateNote($(this));
    });

    //transfer contents of editor into active note on input
    $("#editor_box").on("input", function() {
        ifNotActiveCreate();
        $(".active .note-content").html($(this).html());
    });

    $("td").on("click", function() {
        $(".selected").removeClass("selected");
        $(this).addClass("selected");
        checkIfInPast() ? warnPastDate() : activateDate();
    });

    $("#clock_wrapper button").on("click", function() {
        setClock($(this).attr("id"));
    });

    $(".clock").on("click", function() {
        $(".clock").removeClass("chosen");
        $(this).addClass("chosen");
    });

    $("#date_apply").on("click", function() {
        applyNotification();
    });
    $("#date_cancel").on("click", function() {
        cancelNotification();
    });

    //autosave on note container change
    var timeout;
    container.bind("DOMSubtreeModified",function(){
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $(".loader").show();
            //remove active class and save html
            var $notes = container.html().replace(" active","");
            pyqtConnect.saveNotes($notes); 
            setTimeout("$('.loader').hide();", 1200);
        }, 2500);
    });

    //tekst = qtConnector.showMessage("SuuuperRadi");

});
