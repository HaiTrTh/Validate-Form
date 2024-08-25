// const { contains } = require("validator");

// Object `Validaor`
function Validator(options){

  var selectorRules = {};
  // validate function
  function validate(inputElement,rule){
      var errorMessage = rule.test(inputElement.value)
      var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
      
      if(errorMessage){
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid")
      }
      else{ 
      errorElement.innerText = ""
      inputElement.parentElement.classList.remove("invalid")
      }
  }

  //getElement of Form
  var formElement = document.querySelector(options.form);
  if(formElement){
    options.rules.forEach((rule) =>{
      
        // Lưu lại các rule cho mỗi input
        if(Array.isArray(selectorRules[rule.selector])){
          selectorRules[rule.selector].push(rule.test);
        }else{
         selectorRules[rule.selector] = [rule.test];
        }
        var inputElement = formElement.querySelector(rule.selector);
        console.log(inputElement);
        
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        if(inputElement){
          // xử lý trường hợp blur khỏi input
            inputElement.onblur = function(){
            validate(inputElement,rule) 
            }
          // xử lý mỗi khi người dùng nhập vào input            
            inputElement.oninput =function(){
              errorElement.innerText = ""
              inputElement.parentElement.classList.remove("invalid")
            }
        }
    });
    console.log(selectorRules)
  }
}

//Defination
//Priority of rules
//1. When have error => Return message error
//2. When valid   => No return (unde)
Validator.isRequired = function (selector,message){
    return {
        selector: selector,
        test: function(value){
          return value.trim() ? undefined : message|| "Vui lòng nhập trường này"
        }
    };
}

Validator.isEmail = function (selector, message){
  return {
      selector: selector,
      test: function(value){
        const regex =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return regex.test(value) ? undefined : message || "Email không hợp lệ"
      } 
  };
}

Validator.minLength = function (selector,min, message){
  return {
      selector: selector,
      test: function(value){
        return value.length >=min ? undefined : message || `Password không được ít hơn ${min} ký tự`
      } 
  };
}


Validator.isConfirmed = function (selector, getCofirmValue , message){
  return {
      selector: selector,
      test: function(value){
          return value === getCofirmValue() ? undefined : (message || "Password không hợp lệ")
      } 
  };
}