$(document).ready( function() {
    $("#formulario").submit(function(e) {
        e.preventDefault();

        $("#enviar").text("Enviando formulario...")

        let fecha = new Date();
        datos_formulario = new FormData(e.target);
        datos_formulario.set("hora", fecha);

        $.ajax({
            method: "POST",
            url: "https://formsubmit.co/ajax/mi.email.para.testing@gmail.com",
            dataType: "json",
            data: datos_formulario,
            processData: false,
            contentType: false,        
        }).done(function(respuesta) {
            console.log(respuesta.message);
            $("#enviar").text("Enviar")
            $("#formulario").trigger("reset");
            $("#enviar").show();
            $("#mensaje-enviado").css("display", "inline")
            setTimeout(() => {
                $("#mensaje-enviado").hide();
            }, 2000);
        })
        
    });
})

