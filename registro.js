$(document).ready( function() {
    let paso = 0;
    let provincia = $("#provincia");
    let ciudad = $("#ciudad");

    function validarCamposNombre() {
        let nombre = $("#nombre").val();
        let apellido = $("#apellido").val();
        
        if(nombre === "" || apellido === "") {            
            return false
        } else {
            let patron = new RegExp("^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\\s]+$");
            if (!patron.test(nombre) || !patron.test(apellido)) {                
                return false
            }
        }

        let fechaNacimiento = new Date($("#fechanac").val());
        let añoNacimiento = fechaNacimiento.getFullYear()
        
        let fechaActual = new Date();
        let añoActual = fechaActual.getFullYear();

        if(añoActual - añoNacimiento < 18 || añoNacimiento > añoActual || fechaNacimiento == "Invalid Date") {
            return false
        }

        let sexo = $("#sexo").val();
        if(sexo == "Seleccione") {
            return false
        }

        return true        
    }

    (function cargarProvincias() {
        $.ajax({
            url: "https://apis.datos.gob.ar/georef/api/provincias"
        }).done(function(json) {
            let opciones = `<option value="">Elige una Provincia</option>`;
            json.provincias.forEach(el => opciones += `<option value="${el.id}" data-name="${el.nombre}">${el.nombre}</option>`);
            provincia.html(opciones);
        })
    
        provincia.on('change', function() {
            cargarCiudades($(this).val());
        });
    })()

    function cargarCiudades(provincia) {
        if (!provincia) return;
        $.ajax({
            url:`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provincia}&campos=id,nombre&max=200`            
        }).done(function(json) { 
            if(json.municipios.length === 0) {
                $.ajax({
                    url:`https://apis.datos.gob.ar/georef/api/departamentos?provincia=${provincia}&max=200`                
                }).done(function(json) {
                    let opciones = `<option value="">Elige una Ciudad</option>`;
                    json.departamentos.forEach(el => opciones += `<option value="${el.id}" data-name="${el.nombre}">${el.nombre}</option>`);
                    ciudad.html(opciones);
                })                            
            } else {                    
                let opciones = `<option value="">Elige una Ciudad</option>`;
                json.municipios.forEach(el => opciones += `<option value="${el.id}" data-name="${el.nombre}">${el.nombre}</option>`);
                ciudad.html(opciones);
            }
        })
    }

    function validarCamposDatos() {
        valorProvincia = provincia.val();
        valorCiudad = ciudad.val();
        if(valorProvincia == "" || valorProvincia == "Elige una Provincia" || valorCiudad == "" || valorCiudad == "Elige una Ciudad") {
            return false
        }

        let telefono = $("#telefono").val()
        
        if(telefono === "") {            
            return false
        } else {
            let patron = /^\d{6,12}$/;
            if(!patron.test(telefono)){             
                return false
            }      
            
            return true
        }
        
    }

    function validarCamposPass() {
        let nombreUsuario = $("#id-usuario").val();
        let email = $("#email").val();
        let contraseña = $("#contraseña").val();
        let confirmacion = $("#confirmContraseña").val();   
        
        if(nombreUsuario === "") {
            return false
        } else {
            let patron = /[a-zA-Z0-9_]{5,15}/;
            if(!patron.test(nombreUsuario)){
                return false
            }
        }

        if(email === "") {
            return false
        } else {
            let patron = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;
            if(!patron.test(email)) {
                return false
            }
        }

        if(contraseña === "") {
            return false 
        } else {
            let patron = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
            if(!patron.test(contraseña)) {
                return false
            }
        }

        if(contraseña !== confirmacion) {            
            return false
        }

        return true
    }

    function siguientePaso(e) {
        let pasoActual = $(e.target).closest(".form-step");
        let proximoPaso = pasoActual.next(".form-step");

        pasoActual.removeClass("active");
        proximoPaso.addClass("active");
        $(".progress-step.active").next(".progress-step").addClass("active");
        $(".mensaje-error").hide()
        paso ++;
    }

    $(".btn-siguiente").on("click", function(e) {
        switch (paso){
            case 0:
                if(validarCamposNombre()) {
                    siguientePaso(e);
                } else {
                    $(".mensaje-error").show();                    
                }
                break;

            case 1:
                if(validarCamposDatos()) {
                    siguientePaso(e);
                } else {
                    $(".mensaje-error").show();                   
                }
                break;

            case 2 :
                if(validarCamposPass()) {
                    console.log("FORMULARIO ENVIADO!");
                    mostrarResumen()
                    $(".mensaje-error").hide();
                    $("#registro-enviado").show();
                    setTimeout(() => {
                        $("#registro-enviado").hide();
                    }, 2000);

                } else {
                    $(".mensaje-error").show();
                }
        }    
    })

    function mostrarResumen() {
        /* RESUMEN */
        let nombre = $("#nombre").val()
        let apellido = $("#apellido").val()
        let fechaNacimiento = new Date($("#fechanac").val());
        let fechaLocal = new Date(fechaNacimiento.getUTCFullYear(), fechaNacimiento.getUTCMonth(), fechaNacimiento.getUTCDate());
        let sexo = $("#sexo").val();        
        let telefono = $("#telefono").val();
        let provincia = $("#provincia").find("option:selected").data("name");
        let ciudad = $("#ciudad").find("option:selected").data("name");
        let nombreUsuario = $("#id-usuario").val();
        let email = $("#email").val();
        let contraseña = $("#contraseña").val();        

        alert("Los datos ingresados son: Nombre: " + nombre + ', Apellido: '  + apellido + ', Fecha de nacimiento: ' + fechaLocal + ', Sexo: ' + sexo + ', Teléfono: ' + telefono + ', Provincia: '+ provincia + ', Ciudad: ' + ciudad + ', Nombre de usuario: ' + nombreUsuario + ', Email: ' + email + ', Contraseña: ' + contraseña);
            
    }

    $(".btn-anterior").on("click", function() {
        let pasoActual = $(this).closest(".form-step");
        let pasoAnterior = pasoActual.prev(".form-step");

        pasoActual.removeClass("active");
        pasoAnterior.addClass("active");
        $(".progress-step.active").removeClass("active").prev(".progress-step").addClass("active");
        $(".mensaje-error").hide()
        paso --;
    })
})

