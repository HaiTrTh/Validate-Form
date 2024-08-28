// const { contains } = require("validator");

// Object `Validaor`
function Validator(options){

  function getParent(element,selector){
    while(element.parentElement){
      if(element.parentElement.matches(selector)){
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  //  var selectorRules = {};
  // validate function
  var selectorRules = {};
  function validate(inputElement,rule){
      var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage
      
         var rules = selectorRules[rule.selector];
          for(var i = 0; i < rules.length ; ++i){
          switch(inputElement.type){
            case 'checkbox':
            case 'radio':
              errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
              break;
            default:
              errorMessage = rules[i](inputElement.value);
          }
          if(errorMessage)
            break;
          // console.log(errorMessage);
          }

      if(errorMessage){
        errorElement.innerText = errorMessage;
        getParent(inputElement,options.formGroupSelector).classList.add("invalid")
      }
      else{ 
        errorElement.innerText = ""
        getParent(inputElement,options.formGroupSelector).classList.remove("invalid")
      }
      return !errorMessage;
      
  }

  //getElement of Form
  var formElement = document.querySelector(options.form);
  if(formElement){
    formElement.onsubmit = function(e){
      e.preventDefault();

      var isFormValid = true;
      // Loop via rule and validate
      options.rules.forEach((rule) =>{
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement,rule);
        if(!isValid) 
          isFormValid = false;
      });
      if(isFormValid){
        if(typeof options.onSubmit === 'function'){
            var enableInputs = formElement.querySelectorAll('[name]:not([diable])')
            var formValues = Array.from(enableInputs).reduce(function(values, input){
                  values[input.name] = input.value
                  return  values
           }, {})
           options.onSubmit(formValues);
        }
      }
    }
    options.rules.forEach((rule) =>{
        console.log(rule.selector)
        // Lưu lại các rule cho mỗi input
        if(Array.isArray(selectorRules[rule.selector])){
          selectorRules[rule.selector].push(rule.test);
        }
        else{
          selectorRules[rule.selector] = [rule.test];
        }
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
       
        var inputElement = formElement.querySelector(rule.selector);
        if(inputElement){
          // xử lý trường hợp blur khỏi input
            inputElement.onblur = function(){
            validate(inputElement,rule) 
            }
          // xử lý mỗi khi người dùng nhập vào input            
            inputElement.oninput =function(){
              errorElement.innerText = ""
              getParent(inputElement,options.formGroupSelector).classList.remove("invalid")
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
          return value ? undefined : message|| "Vui lòng nhập trường này"
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


Validator.isConfirmed = function (selector, getConfirmValue , message){
  return {
      selector: selector,
      test: function(value){
          return value === getConfirmValue() ? undefined : (message || "Giá trị nhập vào không hợp lệ")
      } 
  };
}