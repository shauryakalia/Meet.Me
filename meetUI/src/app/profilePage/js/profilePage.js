
document.querySelector('.div1').addEventListener("click", function(){
	document.querySelector('.div1_modal').style.display = "flex";
});

document.querySelector('.div2').addEventListener("click", function(){
	document.querySelector('.div2_modal').style.display = "flex";
});

document.querySelector('.div3').addEventListener("click", function(){
	document.querySelector('.div3_modal').style.display = "flex";
});

document.querySelector('.div4').addEventListener("click", function(){
	document.querySelector('.div4_modal').style.display = "flex";
});

document.querySelector('.close').addEventListener("click", function() {
    document.querySelector('.div1_modal').style.display = "none";
});

document.querySelector('.close2').addEventListener("click", function() {
    document.querySelector('.div2_modal').style.display = "none";
});
document.querySelector('.close3').addEventListener("click", function() {
    document.querySelector('.div3_modal').style.display = "none";
});
document.querySelector('.close4').addEventListener("click", function() {
    document.querySelector('.div4_modal').style.display = "none";
});



function add(){
    let service=document.querySelector('#service');
    if(service.value!=''){
        $('.service_list').append("<li> <div class='list_content'> <div class='text_content' > " + service.value +  "</div> <div class='edit_remove'> <button class='btn btn-default edit ' > edit </button> <span><i class='fa fa-trash'></i></span> </div> </div> </li>" );
        service.value='';
    }
}


function add_price(){
    let service2=document.querySelector('#service2');
    let price=document.querySelector('#price');
    if(service2.value!='' && price.value!=''){
        $('.price_list').append("<li> <div class='list_content' > <div class='text_content grid_container' >" + service2.value + " " + price.value + "</div> <div class='edit_remove'> <button class='btn btn-default edit' > edit </button> <span><i class='fa fa-trash'></i></span> </div> </div> </li>" );
        service2.value='';
        price.value='';
    }
}



service.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      document.getElementById("add").click();
    }
  });

price.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      document.getElementById("add_price").click();
    }
  });

  $("ol").on("click", "span", function(event){
	$(this).parent().parent().parent().fadeOut(300,function(){
		$(this).remove();
	});
	event.stopPropagation();
});



$("ol").on("click", "button:first-child", function(event){
    console.log($(this).parent().parent())
    $(this).parent().parent().append(
        "<div class='edit_content'> <input type='text' name='editted' class='editted form-control1' placeholder='Enter Service' ><button class='btn btn-secondary editted_save_button' > Save </button> <button class='btn btn-default editted_cancel_button' onclick='cancel()' > Cancel </button> </div>"
    )
    let editted= document.querySelector('.editted')
    editted.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        a= document.querySelector('.editted').value
        console.log(a)
        $(this).parent().parent()[0].children[0].innerText = a;
        $(this).parent().fadeOut(100,function(){
        $(this).remove()
    })
    }
  });
    console.log($(this).parent().parent()[0].children[0])
event.stopPropagation();
});



$("ol").on("click", "button:nth-child(2)", function(event){
    a= document.querySelector('.editted').value
    console.log(a)
    $(this).parent().parent()[0].children[0].innerText = a;
    $(this).parent().fadeOut(100,function(){
        $(this).remove()
    })
event.stopPropagation();
});



$("ol").on("click", "button:nth-child(3)", function(event){
    $(this).parent().fadeOut(100,function(){
        $(this).remove()
    })
event.stopPropagation();
});