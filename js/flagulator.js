// js for default action.
var countryIndex=-1;
var flagCount=0;
var code="uk";
var user_code="";
var user_score=0;
var countries=[];
var countryObj={};
countryObj.hint=0;

$(document).ready(function() {

    load_countries();

    if (window.localStorage.getItem("best-score") === null) {
        window.localStorage.setItem("best-score", 0);
    }

    bloodhound = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('countryName'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          prefetch: 'data/country_data.json'
      });

      bloodhound.initialize();

      $('#fl-typeahead').typeahead(
                  {
          hint: true,
          highlight: true,
          minLength: 1
        } , {
          name: 'bloodhound',
          displayKey: 'countryName',
          source: bloodhound.ttAdapter()
      }).on('typeahead:selected', function(event, data){

        //user_code=(data["ISO3166-1-Alpha-2"]);
        console.log(data);
        user_code = (data.countryCode);
        user_code = user_code.toLowerCase();

        if(user_code==code){

              show_country_info(1);

          }else {
              user_score=0;
              show_country_hint('Not quite... here\'s a hint:');
              clear_input();
          }

      });


  $("#new-country").on("click", function(){
    pick_a_country();
    return false;
  });


  $(".fl-show-info").on("click", function(){

    user_score=0;
    update_user_score(user_score);
    show_country_info(0);
    return false;
  });

  $(".fl-show-hint").on("click", function(){
    show_country_hint('Hint...');
    return false;
  });

  $(".fl-skip").on("click", function(){
      pick_a_country();
      return false;
    });


  $(".fl-show-page").on("click", function(){
    show_page($(this).attr('data-pagetoshow'));
    return false;
  });
});

function load_countries(){

  $.getJSON( "data/country_data.json", function( data ) {

    var list='';

    $.each(data, function() {

      countries.push(this);

    });

    $("#flag-total").html(countries.length);
    flagCount=0;
    pick_a_country();

    });

}

function pick_a_country(){

  if(countries.length<1){
    load_countries();
  }

  if(countryIndex>-1){
    countries.remove(countryIndex);
  }

  if(countries.length===0){
    countryIndex=0;
  }else{
    countryIndex=Math.floor(Math.random()*countries.length);
  }
  code=countries[countryIndex].countryCode;
  code = code.toLowerCase();

  countryObj.selectedCountry=countries[countryIndex];

  console.log(countries[countryIndex].countryName);

  var flag="flags/"+code+".svg";
  $("#flag-pic").attr("src", flag);

  $(".mdl-spinner").hide();
  $("#flag-pic").show();

  clear_input();

  countryObj.hint=0;
  flagCount++;
  $("#flag-count").html(flagCount);

}

function show_country_info(correct){

  clear_input();
  var title="Answer";

  var country_info='<strong>Name : </strong> ' + countryObj.selectedCountry.countryName;
  country_info+='<br><strong>Continent : </strong> ' + countryObj.selectedCountry.continentName;
  country_info+='<br><strong>Capital : </strong> ' + countryObj.selectedCountry.capital;
  country_info+='<br><strong>Population : </strong> ' + countryObj.selectedCountry.population;

  if(correct){

    title="Correct";

    showDialog({
              title: title,
              text: country_info,
              positive: {
                  id: 'ok-button',
                  title: 'OK',
                  onClick: function() {

                    if(countryObj.hint===0){
                      user_score++;
                    }
                    update_user_score(user_score);
                    pick_a_country();
                   }
              },
      });

  }else{

    showDialog({
              title: title,
              text: country_info,
              positive: {
                  id: 'ok-button',
                  title: 'OK',
                  onClick: function() {
                    update_user_score(user_score);
                    pick_a_country();
                   }
              },
      });

  }

}


function show_country_hint(title){

  clear_input();

  // track how many times the same hint has appeared and
  // show more of the name.

  var hint='';

  for (var i = 0; i < countryObj.selectedCountry.countryName.length; i++) {
    if(i<=countryObj.hint){
      hint+=countryObj.selectedCountry.countryName[i];
    }else{
      hint+=' _';
    }
  }


  countryObj.hint++;

  var hint_text='<strong>Name : </strong> ' + hint; //countryObj.selectedCountry.countryName[0];
  //  hint_text+='<br><strong>Continent : </strong> ' + countryObj.selectedCountry.continentName;
  hint_text+='<br><strong>Capital : </strong> ' + countryObj.selectedCountry.capital;

  showDialog({
            title: title,
            text: hint_text,
            positive: {
                id: 'ok-button',
                title: 'OK',
                onClick: function() { }
            },
    });
}

function show_page(page){

var content='';
var title='';

if(page == "about"){
  content=$("#page-about").html();
  title="About";
}else if (page=="howto") {
  content=$("#page-howto").html();
  title="How to play";

}
  showDialog({
          title: title,
          text: content,
          positive: {
              id: 'ok-button',
              title: 'OK',
              onClick: function() { }
          },
  });
}

function clear_input(){
  $("#fl-typeahead").typeahead('val', '');
  $("#fl-typeahead").blur();
}

function update_user_score(score){

  $("#user-score").html("Current score : " + score);

  var best = window.localStorage.getItem("best-score");

  if(score > best){
    best=score;
    window.localStorage.setItem("best-score", best);
  }

  $("#user-best").html("Your best score : " + best);


}


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
