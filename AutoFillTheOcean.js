// ==UserScript==
// @name         AutoOceanFiller
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto clicker for Fill the Oceans
// @author       Crownie88
// @match        http://www.filltheoceans.com/
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    var ScriptSettings = {
        AutoDropClick: false,
        AutoClickSpeed: 500,
        AutoClouds: false,
        AutoAlienClick: true,
        AutoBuyUpgrades: false,
        CloudAlienSpeed: 100,
        AutoBuy: false,
        DropClickTimer: null,
        CloudClickTimer: null,
        AlienClickTimer: null,
        UpgradeBuyTimer: null
    };
    //Button to change script settings
    var btnSettings = document.createElement('button');
    btnSettings.setAttribute('id','aofSettings');
    btnSettings.setAttribute('class', 'tabs');
    btnSettings.setAttribute('width', '100px');
    btnSettings.innerHTML = "AoF";
    document.getElementById("pagenav").appendChild(btnSettings);
    document.getElementById("aofSettings").addEventListener("click", SettingsClicked, false);

    //Setting content
    var divSettings = document.createElement('div');
    divSettings.setAttribute('id','pageScript');
    document.getElementById("pagecontainer").appendChild(divSettings);
    SetStyles();
    AddComponents();

    function AddStyle(style){
        GM_addStyle(style);
    }

    function CreateToggleButton(id){
        var toggle = document.createElement('div');
        toggle.setAttribute('class','switch');
        toggle.innerHTML = '<input id="'+id+'" class="cmn-toggle cmn-toggle-round" type="checkbox"><label for="'+id+'"></label>';
        return toggle;
    }

    function CreateSlider(id){
        var slider = document.createElement('div');
        slider.innerHTML = '<input type="range" name="yes" id="'+id+'" value="500" min="10" max="1000" step="10" data-show-value="true"><p id="'+id+'val">500</p>';
        return slider;
    }

    function CreateRow(text, component){

        var row = document.createElement('div');
        row.setAttribute('class', 'row');
        var leftcol = document.createElement('div');
        leftcol.setAttribute('class', 'leftCol');
        leftcol.innerHTML = '<p>' + text + '</p>';
        row.appendChild(leftcol);
        var rightcol = document.createElement('div');
        rightcol.setAttribute('class', 'rightCol');
        rightcol.appendChild(component);
        row.appendChild(rightcol);
        return row;
    }

    function SetStyles(){
        AddStyle("#pageScript { position:absolute; top:50px; right:0; width:95%; display:none; color:#bbbbbb;}");
        AddStyle(".row {height: 30px; width: 100%; float: left; margin-bottom: 15px;}");
        AddStyle(".row .leftCol {height: 30px; width: 30%; float: left;}");
        AddStyle(".row .rightCol {height: 30px; width: 70%; float: left;}");
        AddStyle(".row .leftCol p {margin:10px 0 0 0; font-weight: bold; padding: 0 0 0 20px; font-size: 0.8em;}");
        var styles = [
            '.cmn-toggle {position: absolute; margin-left: -9999px;}',//' visibility: hidden;}',
            '.cmn-toggle + label { display: block; position: relative; cursor: pointer; outline: none; user-select: none;}',
            'input.cmn-toggle-round + label {padding: 2px; width: 52px; height: 26px; background-color: #dddddd; border-radius: 60px;}',
            'input.cmn-toggle-round + label:before, input.cmn-toggle-round + label:after { display: block; position: absolute; top: 1px; left: 1px; bottom: 1px; content: ""; }',
            'input.cmn-toggle-round + label:before {right: 1px; background-color: #f1f1f1; border-radius: 60px; transition: background 0.4s;}',
            'input.cmn-toggle-round + label:after {width: 30px; background-color: #fff; border-radius: 100%; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); transition: margin 0.4s;}',
            'input.cmn-toggle-round:checked + label:before {background-color: #2196F3;}',
            'input.cmn-toggle-round:checked + label:after { margin-left: 24px;}'
        ];
        for (var i = styles.length - 1; i >= 0; i--) {
            AddStyle(styles[i]);
        }
    }

    //Settings components
    function AddComponents(){
        document.getElementById('pageScript').appendChild(CreateRow('Auto click drop', CreateToggleButton("AutoDropClick")));
        document.getElementById('pageScript').appendChild(CreateRow('Speed', CreateSlider("spdslider")));
        document.getElementById('pageScript').appendChild(CreateRow('Auto click clouds', CreateToggleButton("AutoClickClouds")));
        document.getElementById('pageScript').appendChild(CreateRow('Auto click aliens', CreateToggleButton("AutoClickUfo")));
        document.getElementById('pageScript').appendChild(CreateRow('Auto buy upgrades', CreateToggleButton("AutoBuyUpgrades")));

    }
    $('#pagenav .tabs').click(function(){
        if ($(this).attr('id') != "aofSettings"){
            $('#pageScript').fadeOut("fast");
        }
    });

    function ClickCloud(){
        if ($('#cloud').css('display') == "block") { 
            $('#cloud').click(); 
        }
    }

    function ClickAlien(){
        for (var i=0; i<Game.aliensList.length; i++){
            if (Game.aliensList[i].active == 1){
                Game.aliensList[i].click();
                Game.aliensList[i].click();
                Game.aliensList[i].click();
            }
        }
    }

    function BuyUpgrades(){
        //Find active upgrades we didnt buy yet.
        if (ScriptSettings.AutoBuyUpgrades){
            var tmpupgr = Game.upgrades_sorted.filter(function( obj ) { return (obj.active == 1) && (obj.bought != 1); });
            if (tmpupgr.length > 0){
                if (Game.drops_in_bank > tmpupgr[0].cost){
                    tmpupgr[0].buy();
                }
            }
        }
    }

    function SettingsChanged(){
        //Clear and set intervals
        if (ScriptSettings.AutoDropClick){
            if (ScriptSettings.DropClickTimer !== null){
                clearInterval(ScriptSettings.DropClickTimer);
            }
            ScriptSettings.DropClickTimer = setInterval(function(){$('#produce-drop').click();}, ScriptSettings.AutoClickSpeed);
        }else{
            if (ScriptSettings.DropClickTimer !== null){
                clearInterval(ScriptSettings.DropClickTimer);
            }
        }
        if (ScriptSettings.AutoClickClouds){
            ScriptSettings.CloudClickTimer = setInterval(ClickCloud, ScriptSettings.CloudAlienSpeed);
        }else{
            if (ScriptSettings.CloudClickTimer !== null){
                clearInterval(ScriptSettings.CloudClickTimer);
            }
        }
        if (ScriptSettings.AutoAlienClick){
            ScriptSettings.AlienClickTimer = setInterval(ClickAlien, ScriptSettings.CloudAlienSpeed);
        }else{
            if (ScriptSettings.AlienClickTimer !== null){
                clearInterval(ScriptSettings.AlienClickTimer);
            }
        }
        if (ScriptSettings.AutoBuyUpgrades){
            ScriptSettings.UpgradeBuyTimer = setInterval(BuyUpgrades, ScriptSettings.CloudAlienSpeed);
        }
    }

    function SaveSettings(){
        //Might use save/load settings in a later version
    }
    function LoadSettings(){
        //Might use save/load settings in a later version
    }

    $(document).on('input change', '#spdslider', function() {
        $('#spdsliderval').text( $(this).val() );
        ScriptSettings.AutoClickSpeed = $(this).val();
    });

    $('#AutoDropClick').change(function(){
        ScriptSettings.AutoDropClick = $('#AutoDropClick')[0].checked;
        SettingsChanged();
    });

    $('#AutoClickClouds').change(function(){
        ScriptSettings.AutoClickClouds = $('#AutoClickClouds')[0].checked;
        SettingsChanged();
    });

    

    $('#AutoBuyUpgrades').change(function(){
        ScriptSettings.AutoBuyUpgrades = $('#AutoBuyUpgrades')[0].checked;
        SettingsChanged();
    });

    $('#spdslider').change(function(){
        SettingsChanged();
    });

    function SettingsClicked(cEvent){
        //Hiding old panels
        $('#pagestats').fadeOut("fast");
        $('#pageoptions').fadeOut("fast");
        $('#pageScript').fadeOut("fast");
        //Remove active class
        $('#pagenav .tabs').removeClass('active');
        //Set active class
        $('#aofSettings').addClass('active');
        //Show script settings
        $('#pageScript').fadeIn("fast");
    }


})();
