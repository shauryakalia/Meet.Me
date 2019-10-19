
function openTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }
 var set=0
  document.querySelector('.arrow').addEventListener('click', () => {
    if (set==0){
      document.querySelector('.accountSettings').style.display= 'block'
      set=1
    }
    else {
      document.querySelector('.accountSettings').style.display= 'none'
      set=0
    }

  })