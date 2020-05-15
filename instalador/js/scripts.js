window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}



var urlApi         = "https://baltimoreeducation.com.br/api/";
var urlCnd         = "arquivos/";
var urlDom         = "https://baltimoreeducation.com.br/";

//var urlApi         = "http://127.0.0.1/baltimore/public_html/site/api/";
//var urlCnd         = "https://baltimore.mangu.com.br/admin/arquivos/";
//var urlDom         = "https://baltimore.mangu.com.br/";

// PERMITIR QUE O CARROUSEL PRINCIPAL POSSA SER MOVIMENTADO USANDO O TOUCH
$(".carousel").swipe({
  swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
    if (direction == 'left') $(this).carousel('next');
    if (direction == 'right') $(this).carousel('prev');
  },
  allowPageScroll:"vertical"
});

$(".areaPdf").swipe({
  swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
    if (direction == 'left') $(this).carousel('next');
    if (direction == 'right') $(this).carousel('prev');
  },
  allowPageScroll:"vertical"
});

$(".signature-pad").swipe({
  swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
    if (direction == 'left') $(this).carousel('next');
    if (direction == 'right') $(this).carousel('prev');
  },
  allowPageScroll:"vertical"
});






// VERIFICAR SE O USUÁRIO ESTÁ LOGADO OU NÃO
function verificarSessao(){
    var usuarioLogado = localStorage.getItem("logadoMagicTree");
    // VERIFICAR SE O USUÁRIO ESTÁ LOGADO
    if(usuarioLogado=="sim"){
       console.log("Usuário logado");
    }else{
      // VAMOS DIRECIONAR O USUÁRIO
      console.log("Usuário não está logado");
      location.href="index.html";
    }
  }

// FUNÇÃO PARA LOGIN
function procLogin(){

    // MUDAR O TEXTO DO BOTÃO PARA O USUÁRIO SABER O QUE ESTÁ ACONTECENDO
    $("#btnLogin").html("CARREGANDO");

    var login = $("#loginEmail").val();
    var senha = $("#loginSenha").val();

    if(login!=""&&senha!=""){

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"login.php",
                  data:{login:login,senha:senha}
              
              })
              request.done(function (dados) {            

                  if (dados["sucesso"]=="200") {

                       // AQUI A RECUPERAÇÃO DOS DADOS
                       console.log("LOGIN E SENHA ENCONTRADOS");
                       console.log("RETORNO DOS DADOS:");
                       console.log(dados);

                       // SETAR A SESSAO                      
                       localStorage.setItem("idUsuario",dados["idUsuario"]);
                       localStorage.setItem("emailUsuario",dados["email"]);
                       localStorage.setItem("nomeUsuario",dados["nome"]);
                       localStorage.setItem("pontosUsuario",dados["pontos"]);

                       console.log("STATUS SERIAL: ");
                       console.log(dados["serial_"]);

                       // MUDAR A VIEW DO PERFIL PARA O USUÁRIO LOGADO
                       if(dados["serial_"]!=null){
                         localStorage.setItem("logadoMagicTree","sim");

                         // ALUNO OU PROFESSOR?
                         // ALUNO OU PROFESSOR?
                         if(dados["aluno"]=="aluno"){
                             localStorage.setItem("professor","nao");
                             location.href="welcome.html";
                         }

                         if(dados["professor"]=="professor"){
                             localStorage.setItem("professor","sim");
                             location.href="welcome-professor.html";
                         }
 

                         localStorage.setItem("serialUsuario",dados["serial_"]);
                      }else{
                        location.href="serial.html";
                        
                      }                       

                  }else{

                       console.log("PROBLEMAS NO LOGIN");

                       // SETAR A SESSAO
                       localStorage.setItem("logadoMagicTree","nao");

                       // LIMPANDO OS CAMPOS DE LOGIN E SENHA
                       $("#loginEmail").val("");
                       $("#loginSenha").val("");
                       $("#btnLogin").html("OK");

                       mensagem("Login ou Senha incorretos");

                  } 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS NO LOGIN (procLogin)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                   $("#btnLogin").html("OK");


              });
              // FINAL CHAMADA AJAX

    }else{
      mensagem('Todos os campos com "*" são necessários');
      $("#btnLogin").html("OK");
    }

  }


// FUNÇÃO PARA RESET DE SENHA
function resetSenha(){

   // MUDAR O TEXTO DO BOTÃO PARA O USUÁRIO SABER O QUE ESTÁ ACONTECENDO
    $("#btnReset").html("CARREGANDO");

    var login = $("#resetEmail").val();

    console.log("INICIANDO FUNÇÃO PARA RESET DE SENHA: "+login);

    if(login!=""){

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"resetar-senha.php",
                  data:{login:login}
              
              })
              request.done(function (dados) {            

                  console.log("RETORNO DOS DADOS DO RESET:");
                  console.log(dados)

                  if (dados["sucesso"]!="500") {

                       // AQUI A RECUPERAÇÃO DOS DADOS
                       console.log("LOGIN E SENHA ENCONTRADOS");
                        mensagem("Senha resetada com sucesso! Veja instruções enviadas para o seu e-mail");
                       $("#btnReset").html("Resetar senha");

                  }else{

                       console.log("PROBLEMAS NO RESET");                       
                       mensagem("Esse e-mail não está cadastrado na plataforma");

                  } 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS NO RESET DE SENHA (resetSenha)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                   $("#btnReset").html("Resetar senha");


              });
              // FINAL CHAMADA AJAX

    }else{
      mensagem('Todos os campos com "*" são necessários');
      $("#btnReset").html("Resetar senha");
    }

}


// FUNÇÃO PARA PROCESSAR O CADASTRO
function procCadastro(){
  
  console.log("INICIANDO O CADASTRO DO USUÁRIO");

  // MUDAR O TEXTO DO BOTÃO PARA O USUÁRIO SABER O QUE ESTÁ ACONTECENDO
    $("#btnCadastrar").html("CARREGANDO");


    var cadastroNome                  = $("#cadastroNome").val();
    //var cadastroSobrenome             = $("#cadastroSobrenome").val();
    var cadastroNomeResponsavel       = $("#cadastroNomeResponsavel").val();
    var cadastroTelefone              = $("#cadastroTelefone").val();
    var cadastroEndereco              = $("#cadastroEndereco").val();
    var cadastroEscola                = $("#cadastroEscola").val();
    var cadastroEmail                 = $("#cadastroEmail").val();
    var cadastroSenha                 = $("#cadastroSenha").val();
    var cadastroConfirmarSenha        = $("#cadastroConfirmarSenha").val();
    var souProfessor                  = $("#souProfessor:checked").val();
    var souAluno                      = $("#souAluno:checked").val();


    if(cadastroNome!=""&&cadastroNomeResponsavel!=""&&cadastroEscola!=""&&cadastroEmail!=""&&cadastroSenha!=""){

              if(cadastroSenha==cadastroConfirmarSenha){

                              // INICIO CHAMADA AJAX
                              var request = $.ajax({

                                  method: "POST",
                                  url: urlApi+"cadastro.php",
                                  data:{cadastroNome:cadastroNome,cadastroNomeResponsavel:cadastroNomeResponsavel,cadastroTelefone:cadastroTelefone,cadastroEndereco:cadastroEndereco,cadastroEscola:cadastroEscola,cadastroEmail:cadastroEmail,cadastroSenha:cadastroSenha,souProfessor:souProfessor,souAluno:souAluno}
                              
                              })
                              request.done(function (dados) {            

                                  if (dados["sucesso"]=="200") {

                                       // AQUI A RECUPERAÇÃO DOS DADOS
                                       console.log("CADASTRO REALIZADO COM SUCESSO");
                                       console.log("RETORNO DOS DADOS:");
                                       console.log(dados);

                                       // SETAR A SESSAO
                                       localStorage.setItem("logadoMagicTree","sim");
                                       localStorage.setItem("idUsuario",dados["idUsuario"]);
                                       localStorage.setItem("emailUsuario",dados["email"]);
                                       localStorage.setItem("nomeUsuario",dados["nome"]);

                                       // MUDAR A VIEW DO PERFIL PARA O USUÁRIO LOGADO
                                       location.href="serial.html";

                                  }else{

                                      if(dados["sucesso"]!="400"){

                                        console.log("PROBLEMAS NO CADASTRO");
                                        // SETAR A SESSAO
                                        localStorage.setItem("logadoMagicTree","nao");
                                        $("#btnCadastrar").html("OK");
                                        mensagem("Não foi possível concluir a operação, tente novamente em alguns instantes.");

                                      }else{
                                         
                                         console.log("E-MAIL JÁ CADASTRADO");
                                        // SETAR A SESSAO
                                        localStorage.setItem("logadoMagicTree","nao");
                                        $("#btnCadastrar").html("OK");
                                        mensagem("Esse e-mail já está cadastrado na plataforma.");

                                      }

                                       

                                  } 

                              });
                              request.fail(function (dados) {
                                     
                                   console.log("PROBLEMAS NO LOGIN (procCadastro)");
                                   mensagem("Não foi possível concluir a operação, tente novamente em alguns instantes.");
                                   $("#btnCadastrar").html("OK");

                              });
                              // FINAL CHAMADA AJAX

              }else{

                mensagem("As senhas precisam ser iguais!");
                $("#btnCadastrar").html("OK");

              }
              

    }else{
      mensagem('Todos os campos com "*" são necessários');
      $("#btnCadastrar").html("OK");
    }

}

// FUNÇÃO PARA RESGATE DE SERIAL
function procSerial(){
    
    console.log("INICIANDO FUNÇÃO PARA RESGATE DE SERIAL");

    var idUsuario = localStorage.getItem("idUsuario");

    console.log("USUÁRIO FAZENDO O RESGATE: "+idUsuario);

    var codigoSerial = $("#codigoSerial").val();

    console.log("SERIAL SENDO RESGATADO: "+codigoSerial);

    if(codigoSerial!=""){


              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"serial.php",
                  data:{idUsuario:idUsuario,codigoSerial:codigoSerial}
              
              })
              request.done(function (dados) {            

                  if (dados["sucesso"]=="200") {

                       // AQUI A RECUPERAÇÃO DOS DADOS
                       console.log("SERIAL RESGATADO COM SUCESSO");
                       console.log("RETORNO DOS DADOS:");
                       console.log(dados);

                       // SETAR A SESSAO                       
                       localStorage.setItem("idUsuario",dados["idUsuario"]);
                       localStorage.setItem("emailUsuario",dados["email"]);
                       localStorage.setItem("nomeUsuario",dados["nome"]);
                       localStorage.setItem("serialUsuario",dados["serial_"]);

                       localStorage.setItem("logadoMagicTree","sim");

                       // ALUNO OU PROFESSOR?
                       if(dados["aluno"]=="aluno"){
                           localStorage.setItem("professor","nao");
                           location.href="welcome.html";
                       }

                       if(dados["professor"]=="professor"){
                           localStorage.setItem("professor","sim");
                           location.href="welcome-professor.html";
                       }

                  }else{

                       console.log("PROBLEMAS NO RESGATE DO SERIAL");

                       // SETAR A SESSAO
                       localStorage.setItem("logadoMagicTree","nao");

                       // LIMPANDO OS CAMPOS DE LOGIN E SENHA
                       mensagem("Desculpe, essa chave de acesso não pode ser validada.");

                  } 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS NO RESGATE (procSerial)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX

    }else{
       mensagem("Por favor informe um código de chave de acesso!");
    }
}


// FUNÇÃO PARA FAZER LOGOFF DA PLATAFORMA
function logoff(){

  console.log("INICIANDO FUNÇÃO PARA LOGOFF DA PLATAFORMA");

  localStorage.clear(); 

  console.log("DIRECIONAR O USUÁRIO PARA A TELA PRINCIPAL");

  location.href="index.html";

}


// ATUALIZAR DADOS MANGE ACCOUNT
function procManage(){

  $("#btnManageAccount").html("Enviando...");
  
  console.log("INICIANDO FUNÇÃO PARA ATUALIZAR DADOS 'MANAGE ACCOUNT'");
  
  var idUsuario = localStorage.getItem("idUsuario"); 

  // RECUPERAR DADOS DO FORMULÁRIO MANAGE ACCOUNT
  var manageNome              = $("#manageNome").val();
  var manageNomeResponsavel   = $("#manageNomeResponsavel").val();
  var manageTelefone          = $("#manageTelefone").val();
  var manageEndereco          = $("#manageEndereco").val();
  var manageEscola            = $("#manageEscola").val();
  var manageEmail             = $("#manageEmail").val();
  var manageSenha             = $("#manageSenha").val();


  if(manageNome!="" && manageNomeResponsavel!="" && manageTelefone!="" && manageEndereco!="" && manageEscola!="" && manageEmail!="" && manageSenha!=""){

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"atualizar-manage-account.php",
                  data:{idUsuario:idUsuario,manageNome:manageNome,manageNomeResponsavel:manageNomeResponsavel,manageTelefone:manageTelefone,manageEndereco:manageEndereco,manageEscola:manageEscola,manageEmail:manageEmail,manageSenha:manageSenha}
              
              })
              request.done(function (dados) {            

                  if (dados["sucesso"]=="200") {                     
                        
                        $("#btnManageAccount").html("Edit");
                        mensagem("Dados atualizados com sucesso");
 
                  }else{

                       console.log("PROBLEMAS PARA SALVAR DADOS (procManage)");
                       console.log(dados);

                       // LIMPANDO OS CAMPOS DE LOGIN E SENHA
                       mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");

                  } 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS NO ENVIO DA MENSAGEM (procManage)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX


  }else{
    
    mensagem("Todos os campos são necessários");

  }
  
  console.log("FUNÇÃO PARA ATUALIZAR DADOS 'MANAGE ACCOUNT FINALIZADA COM SUCESSO'");

}


// FUNÇÃO PARA PROCESSAR GET HELP
function procHelp(){

    $("#btnGetHelp").html("PROCESSANDO...");
  
    console.log("INICIANDO FUNÇÃO PARA ATUALIZAR DADOS 'GET HELP'");
  
    var idUsuario = localStorage.getItem("idUsuario"); 

    // RECUPERAR DADOS DO FORMULÁRIO GET HELP
    var helpName           = $("#helpName").val();
    var helpEmail          = $("#helpEmail").val();
    var helpAssunto        = $("#helpAssunto").val();
    var helpDepartamento   = $("#helpDepartamento").val(); 
    var helpDescricao      = $("#helpDescricao").val();


    if(helpName!="" && helpEmail!="" && helpAssunto!="" && helpDepartamento!="" && helpDescricao!=""){

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"get-help.php",
                  data:{idUsuario:idUsuario,helpName:helpName,helpEmail:helpEmail,helpAssunto:helpAssunto,helpDepartamento:helpDepartamento,helpDescricao:helpDescricao}
              
              })
              request.done(function (dados) {            

                  if (dados["sucesso"]=="200") {                     
                        
                        $("#btnGetHelp").html("Send");
                        mensagem("Mensagem enviada com sucesso! Em breve retornaremos o seu contato.");
 
                  }else{

                       console.log("PROBLEMAS NO ENVIO DA MENSAGEM (procHelp)");
                       console.log(dados);

                       // LIMPANDO OS CAMPOS DE LOGIN E SENHA
                       mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");

                  } 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS NO ENVIO DA MENSAGEM (procHelp)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX


    }else{
      
      mensagem("Todos os campos são necessários");

    }
    
    console.log("FUNÇÃO PARA ATUALIZAR DADOS 'GET HELP' FINALIZADA COM SUCESSO'");

}





// FUNÇÃO PARA ADICIONAR OU PROCESSAR NOVOS SERIAIS (APENAS CHAMAR A TELA)
function procAddSerial(){
   
   console.log("INICIANDO FUNÇÃO PARA INICIAR PROCESSOS PARA ADICIONAR SERIAIS 'ACCESS KEY'");
  
   var idUsuario = localStorage.getItem("idUsuario"); 

   // DIRECIONAR O USUÁRIO PARA VIEW DE ADESÃO DE ACCESS KEY
   $JSView.goToView('viewAddAccessKey');
   
   // CARREGAR MASCARA
   $("#addAK").inputmask("**-****-***-******");

   console.log("FUNÇÃO PARA INICIAR PROCESSOS PARA ADICIONAR SERIAIS 'ACCESS KEY' FINALIZADA COM SUCESSO");

}





// FUNÇÃO QUE PROCESSA UM NOVO SERIAL DO USUÁRIO
function logadoAddAccessKey(){
   
   console.log("INICIANDO FUNÇÃO PARA INICIAR PROCESSOS PARA ADICIONAR SERIAIS 'ADD ACCESS KEY'");
  
    var idUsuario     = localStorage.getItem("idUsuario"); 
    var codigoSerial  = $("#addAK").val();

    if(addAK!=""){

      $("#btnAddSerial").html("carregando...");
      
      // FAZER AQUI A CHAMADA AJAX     
      // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"logado-add-serial.php",
                  data:{idUsuario:idUsuario,codigoSerial:codigoSerial}
              
              })
              request.done(function (dados) {            

                  if (dados["sucesso"]=="200") {

                       // AQUI A RECUPERAÇÃO DOS DADOS
                       console.log("SERIAL RESGATADO COM SUCESSO");
                       console.log("RETORNO DOS DADOS:");
                       console.log(dados);
                       
                       // DIRECIONAR O USUÁRIO PARA A VIEW DOS LIVROS
                       $JSView.goToView('viewBooks');
                       loadBooks();

                       mensagem("Chave de acesso resgatada com sucesso! Os novos livros foram liberados na sua conta!");

                  }else{

                       // AVISAR O USUÁRIO QUE ALGO DEU ERRADO
                       $("#btnAddSerial").html("Ok");
                       mensagem("Desculpe, essa chave de acesso não pode ser validada.");

                  } 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS NO RESGATE (logadoAddAccessKey)");
                   console.log(dados);
                   $("#btnAddSerial").html("Ok");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX

    
    }else{

      mensagem("Todos os campos são necessários");
    
    }

    console.log("FUNÇÃO PARA INICIAR PROCESSOS PARA ADICIONAR SERIAIS 'ADD ACCESS KEY' FINALIZADA COM SUCESSO");

}





// VERIFICAR OS SERIAIS DO USUÁRIO
var listaSeriais;
function verificarSeriaisAcesso(){
  
  var idUsuario = localStorage.getItem("idUsuario");

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"consultar-serial.php",
                  data:{idUsuario:idUsuario}
              
              })
              request.done(function (dados) {            

                  if (dados["sucesso"]=="200") {

                       // AQUI A RECUPERAÇÃO DOS DADOS
                       console.log("%c SERIAIS DO USUÁRIO","background:#fff000;color:#000;");
                       console.log(dados);

                       listaSeriais = dados;        

                       localStorage.setItem("imagemPerfil",dados.foto_perfil);
                       $("#containerFotoPerfil").css("background","url('"+urlCnd+dados.foto_perfil+"') #f2f2f2 no-repeat");
                       $("#containerFotoPerfil").css("background-size","cover");
                       $("#containerFotoPerfil").css("background-position","center center"); 

                       $("#containerFotoPerfilMobile").css("background","url('"+urlCnd+dados.foto_perfil+"')");
                       $("#containerFotoPerfilMobile").css("background-size","cover");
                       $("#containerFotoPerfilMobile").css("background-position","center center"); 


                       // DE ACORDO COM OS RESULTADOS (DO SERIAL)
                       // VAMOS BLOQUEAR OU NÃO OS LIVROS E MENUS
                       for(var i = 0;i<dados.tot_seriais;i++){
                             
                            // SE O SERIAL NÃO FOR UNIVERSAL 
                            if(dados.seriais[i].serial_ != "XX-XXXX-XXX-XXXXXX"){
                               
                               // REMOVER BLOQUEIO DA UNIDADE
                               if(dados.seriais[i].status!="EXPIRADA X"){
                               
                                   console.log("%c DESBLOQUEANDO LIVRO: ","background:#fff;color:#000;");
                                   console.log(dados.seriais[i].livro);
                                   $("."+dados.seriais[i].livro+" .caixa-livro > .bloqueio-livro").css("display","none");

                                   // HABILITAR O MENU DE GAMES DE ACORDO COM O QUE ESTÁ DESBLOQUEADO
                                   $("#games"+dados.seriais[i].serial_).css("display","block");
                                   $("#games"+dados.seriais[i].serial_+" a").attr("codigo-livro",dados.seriais[i].serial_);

                                   $("#games"+dados.seriais[i].serial_+"Mobile").css("display","block");
                                   $("#games"+dados.seriais[i].serial_+"Mobile"+" a").attr("codigo-livro",dados.seriais[i].serial_);

                               }

                               if(dados.seriais[i].dias<=15&&dados.seriais[i].dias>=0){
                                  mensagem("Fique atento! Algumas das suas AccessKey's expiram em menos de 15 dias! Você pode verifica-las no menu \"AccessKey\"");
                                 //enviarEmailExpiracao(dados.email_cliente,dados.nome_cliente);
                               }



                            } 

                       }


                  }else{

                       console.log("PROBLEMAS NA CONSULTA SERIAL");
                       
                  } 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS NO RESGATE (verificarSeriaisAcesso)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX

}

// FUNÇÃO PARA CARREGAR AS CHAVES DE ACESSO DO USUÁRIO
function carregarUsuarioAccessKey(){
   
   console.log("INCIANDO FUNÇÃO PARA CARREGAR AS CHAVES DE ACESSO DO USUÁRIO E EXIBI-LAS NA TELA");

   var idUsuario = localStorage.getItem("idUsuario");

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"usuario-serial.php",
                  data:{idUsuario:idUsuario}
              
              })
              request.done(function (dados) {            

                  if (dados["sucesso"]=="200") {

                       // AQUI A RECUPERAÇÃO DOS DADOS
                       console.log("%c SERIAIS DO USUÁRIO: ","background: #fff000;color:#000;");
                       console.log(dados);                   

                       // ALIMENTAR O HTML
                       var nomeLivro = "";
                       for(var i = 0;i<dados.tot_seriais;i++){
                        
                        if(dados.seriais[i].livro=="TODOS"){
                          nomeLivro = "All - Demo Account";
                        }else{
                          nomeLivro = "Magic Tree "+dados.seriais[i].livro;
                        }

                          $("#usuarioAccessKey").append('<tr><td>'+dados.seriais[i].serial_+'</td><td>'+nomeLivro+'</td><td>'+dados.seriais[i].data_resgate+'</td></tr>');

                       }    
                       
                           // CONTROLE DAS MENSAGENS DE EXPIRAÇÃO
                           if(dados.dias_diferenca<=15&&dados.dias_diferenca>=0){ 
                              mensagem("Fique atento! Algumas das suas AccessKey's expiram em menos de 15 dias!");
                              enviarEmailExpiracao(dados.email_cliente,dados.nome_cliente);
                           }else{
                               console.log("NENHUM SERIAL ESTÁ PARA EXPIRAR");
                           }
                           // CONTROLE DAS MENSAGENS DE EXPIRAÇÃO

                  }else{

                       console.log("PROBLEMAS NA CONSULTA SERIAL");
                       
                  } 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS NO RESGATE (carregarUsuarioAccessKey)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX

}


// ENVIAR E-MAIL PARA O USUÁRIO AVISANDO SOBRE O ACCESSKEY QUE ESTÁ PARA VENCER
function enviarEmailExpiracao(emailCliente,nomeCliente){

  console.log("%c INICIANDO FUNÇÃO PARA ENVIAR E-MAIL PARA O CLIENTE AVISANDO SOBRE O VENCIMENTO","background:#1b57e0;color:#fff;");

              // INICIO CHAMADA AJAX
              var request = $.ajax({
                  method: "POST",
                  url: urlApi+"enviar-email-serial.php",
                  data:{emailCliente:emailCliente,nomeCliente:nomeCliente}
              })
              request.done(function (dados) {            
                  if(dados=="200"){
                    console.log("E-MAIL ENVIADO COM SUCESSO AVISANDO SOBRE O EXPIRAÇÃO DO SERIAL");
                  }
              });
              request.fail(function (dados) {
                   // SE DER ERRO VAMOS DEIXAR PASSAR POR QUE NÃO É PRIORIDADE   
                   console.log("PROBLEMAS AO ENVIAR E-MAIL (enviarEmailExpiracao)");
              });
              // FINAL CHAMADA AJAX
}


// FUNÇÃO PARA CARREGAR CONTEÚDO
var conteudo;
var paginas;

function carregarConteudo(){

   console.log("INICIANDO FUNÇÃO PARA CARREGAR TODO DO CONTEÚDO");
   
              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"carregar-conteudo.php"
              
              })
              request.done(function (dados) {            

                 console.log("%c CONTEÚDO BAIXADO:","background:#ff0000;color:#fff;font-size:20px;");
                 //console.log(dados);

                 conteudo = dados;
                 console.log(conteudo);
                 //console.table(conteudo.livros);
                 //console.table(conteudo.unidades);
                 //console.table(conteudo.paginas);

                 // ALIMENTAR DADOS GAMEFICAÇÃO
                 console.log("%c ALIMENTANDO DADOS GAMEFICAÇÃO:","background:#AD1457;color:#fff;font-size:20px;");
                 $(".progress-bar").html("<small>"+localStorage.getItem("pontosUsuario")+" pontos</small>");

                 var nivel = 0;
                 if(localStorage.getItem("pontosUsuario")>0){
                    nivel = localStorage.getItem("pontosUsuario") / 10;
                    nivel = parseInt(nivel);
                    $("#nivelAtualUsuario").html(nivel);
                    $("#nivelAtualUsuarioMobile").html(nivel);
                 }

                 // VERIFICAR SE EXISTEM REDIRECTS SALVOS PARA SEREM FEITOS
                  var needRedirect = localStorage.getItem("resetWindow");
                  if(needRedirect=="sim"){
                    var resetWindowView = localStorage.getItem("resetWindowView");
                    //$JSView.goToView('viewComunidade');   
                    loadComunidade();
                    mensagem("Dados salvos com sucesso!");
                    // RESETAR A MEMÓRIA RESPONSAVEL PELOS REDIRECTS
                    localStorage.setItem("resetWindow","nao");
                  }

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS AO BAIXAR CONTEÚDO (carregarConteudo)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX

}



// PAGINA 00
var ajaxSubmit = function(form) {

     $(".carregando").fadeIn("500");
     //$('#sound1').get(0).play();

    setTimeout("location.href='welcome.html'", 3500);


   return false;

}



// CARREGAR OS LIVROS
function loadBooks(){

  $('#sound1').get(0).pause();
  $('#sound2').get(0).play();
  desligarAllMusicas();

  $(".pagina-01 .container.tada").hide();
  $(".pagina-01 .container.caixa-conteudo").fadeIn("1900000");

  $(".pagina-01 .caixa-conteudo").css("min-height","800px");

  // ATIVAR O MENU LIVROS
  $(".menu-pai").removeClass("menu-ativo");
  $("#menuBooks").addClass("menu-ativo");
  $("#menuBooksMobile").addClass("menu-ativo");

  $JSView.goToView('viewBooks');
  verificarSeriaisAcesso();

  var i = 0;
  
  // SB (VAMOS IMPRIMIR O S NA FRENTE DO CÓDIGO DO LIVRO)
  console.log("INICIANDO A IMPRESSÃO DOS LIVROS (PRIMEIRA LINHA)");
  for(i=0;i<conteudo.tot_livros;i++){
    
      if(conteudo.livros[i]["id"]!="5"){
         $("#listLivros").append('<div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 livro SB'+conteudo.livros[i]["cod_livro"]+'"><a href="javascript:void()" title="'+conteudo.livros[i]["nome"]+'">'+conteudo.livros[i]["nome"]+' STUDENT BOOK</a><div class="caixa-livro" style="background:url('+urlCnd+conteudo.livros[i]["capa"]+') no-repeat;background-size:cover;background-position:center center;"> <div class="bloqueio-livro" onclick="procAddSerial();">&nbsp;</div> <a href="javascript:void()" title="'+conteudo.livros[i]["nome"]+'" onclick="$JSView.goToView(\'viewBooksUnits\'); nomeLivro(\''+conteudo.livros[i]["nome"]+' STUDENT BOOK\'); loadUnidadesLivro('+conteudo.livros[i]["id"]+',\'SB\',\''+conteudo.livros[i]["cod_livro"]+'\');"> &nbsp; </a></div></div>');
      }
  }

  // AB (VAMOS IMPRIMIR O A NA FRENTE DO CÓDIGO DO LIVRO)
  console.log("INICIANDO A IMPRESSÃO DOS LIVROS (SEGUNDA LINHA)");
  for(i=0;i<conteudo.tot_livros;i++){
    
      if(conteudo.livros[i]["id"]!="5"){
         $("#listLivros").append('<div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 livro AB'+conteudo.livros[i]["cod_livro"]+'"><a href="javascript:void()" title="'+conteudo.livros[i]["nome"]+'" > '+conteudo.livros[i]["nome"]+' ACTIVITY BOOK</a><div class="caixa-livro" style="background:url('+urlCnd+conteudo.livros[i]["capa_ab"]+') no-repeat;background-size:cover;background-position:center center;"> <div class="bloqueio-livro" onclick="procAddSerial();">&nbsp;</div> <a href="javascript:void()" title="'+conteudo.livros[i]["nome"]+'" onclick="$JSView.goToView(\'viewBooksUnits\'); nomeLivro(\''+conteudo.livros[i]["nome"]+' ACTIVITY BOOK\'); loadUnidadesLivro('+conteudo.livros[i]["id"]+',\'AB\',\''+conteudo.livros[i]["cod_livro"]+'\');"> &nbsp; </a></div></div>');
      }
  }

  console.log("SERIAIS ATIVOS DO USUÁRIO");
  console.log(listaSeriais);


}


// CARREGAR AS UNIDADES
function loadUnidadesLivro(idLivro,tipoLivro,codigoLivro){

  localStorage.setItem("idLivro",idLivro);
  localStorage.setItem("tipoLivro",tipoLivro);
  
  console.log("%c INICIANDO FUNÇÃO PARA CARREGAR UNIDADES DO LIVRO: "+idLivro,"background:#3f16c4;color:#fff;");
  console.log("%c TIPO DO LIVRO: "+tipoLivro,"background:#3f16c4;color:#fff;");
  console.log("%c CODIGO DO LIVRO: "+codigoLivro,"background:#3f16c4;color:#fff;");
  
  // SETAR NA LOCALSTORAGE QUAL LIVRO FOI SELECIONADO PELO USUÁRIO
  localStorage.setItem("codigoLivroGameInterna",codigoLivro);

  var i = 0;

  var src = 1;
  
  for(i=0;i<conteudo.tot_unidades;i++){

    if(conteudo.unidades[i]["id_livro"]==idLivro){
      $("#listUnits").append('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-4 unidade"> <a href="javascript:void(0)" onclick="$JSView.goToView(\'viewBooksUnitsPdf\'); nomeUnidade(\''+conteudo.unidades[i]["nome"]+'\'); loadPaginasLivro('+idLivro+','+conteudo.unidades[i]["id"]+',\''+tipoLivro+'\');"> <img src="images/unit'+src+'.png" alt=""> </a></div>');
      src++;
    }

  }
         
         // BUSCAR O NOME DO LIVRO

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"nome-livro.php",
                  data:{idLivro:idLivro}
              
              })
              request.done(function (dados) {            
                 
                 // IMPRIMIR O NOME DO LIVRO NA PÁGINA DAS UNIDADES
                 if(tipoLivro=="SB"){
                   $("#nomeLivroUnidades").html(dados["nome_livro"]+" STUDENT BOOK - units");
                 }
                 if(tipoLivro=="AB"){
                   $("#nomeLivroUnidades").html(dados["nome_livro"]+" ACTIVITY BOOK - units");
                 }

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS AO BAIXAR CONTEÚDO ESPECIFICO PARA PÁGINAS (loadPaginasLivro)");                              

              });
              // FINAL CHAMADA AJAX

}


var controlePaginas = 0;


// CARREGAR AS PÁGINAS
function loadPaginasLivro(idLivro,idUnidade,tipoLivro){

  if(tipoLivro=="SB"){
    var setarLivroAberto = "student_book";
    $(".link-similar-book").html('<a href="javascript:void(0)" onclick="carregarActivityBook();">activity book</a>');    
  }

  if(tipoLivro=="AB"){
    var setarLivroAberto = "activity_book";
    $(".link-similar-book").html('<a href="javascript:void(0)" onclick="carregarStudentyBook();" style="background: #973158 !important;">student book</a>');
  }
  
  // ESSAS VARIAVEIS VÃO AJUDAR A TERMOS A TROCA DO BOTÃO DE FORMA MAIS EFETIVA 
  localStorage.setItem("BTNTROCA_idLivro",idLivro);
  localStorage.setItem("BTNTROCA_idUnidade",idUnidade);
  localStorage.setItem("BTNTROCA_tipoLivro",tipoLivro);

  var tutorialLivros = localStorage.getItem("tutorialLivros");
  if(tutorialLivros!="javisto"){
    mensagem("As tracks e videos numerados no seu livro podem ser ouvidos acessando os menus laterais “Tracks” e “Videos”");
    localStorage.setItem("tutorialLivros","javisto");
  }

   console.log("INICIANDO FUNÇÃO PARA CARREGAR AS PÁGINAS DO LIVRO: "+idLivro);
   console.log("INICIANDO FUNÇÃO PARA CARREGAR AS PÁGINAS DA UNIDADE: "+idUnidade);
   console.log("TIPO DO LIVRO: "+tipoLivro);

             // OCULTAR TOOLBAR PROFESSOR, CASO SEJA ALUNO
             var professor =localStorage.getItem("professor");
             if(professor!="sim"){
                $("#professorFavoritarToolbar").fadeOut(0);
                $("#professorAddNotaToolbar").fadeOut(0);

                $("#professorFavoritarToolbarMobile").fadeOut(0);
                $("#professorAddNotaToolbarMobile").fadeOut(0);
             }else{
                
                $("#gamesUnidadesMobile").fadeOut(0);

             }

             // DETERMINAR QUAL É O LIVRO CLICADO
             var codigoLivroGameInterna = localStorage.getItem("codigoLivroGameInterna");

             // SETAR O ATRIBUTO NO LINK "GAMES" DA TOOLBAR
             $("#gamesUnidades").attr("codigo-livro",codigoLivroGameInterna);
             $("#gamesUnidadesMobile").attr("codigo-livro",codigoLivroGameInterna);
   
              // CARREGAR AS PÁGINAS DO LIVRO SELECIONADO
              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"carregar-paginas.php",
                  data:{idLivro:idLivro,idUnidade:idUnidade,tipoLivro:tipoLivro}
              
              })
              request.done(function (dados) {            

                 console.log("CONTEÚDO BAIXADO (PÁGINAS):");

                 //console.log(dados);

                 paginas = dados;
                 console.log(paginas);
                 controlePaginas = 0;
                 var numVideo;
                 var temLivro = 9;
                 var numTrack;
                 var temTrack = 9;

                 //$(".link-similar-book").html("y");
                 // VAMOS SER O USUÁRIO TEM ACESSO A UM LIVRO DE TIPO DIFERENTE QUE SEJA DA MESMA UNIDADE
                 var temAB = false;
                 var temSB = false;
                 //var similarSalvo = localStorage.getItem("codigoLivroGameInterna");

                 for(var j = 0;j<listaSeriais.tot_seriais;j++){
                   
                    if(listaSeriais.seriais[j].livro=="ABMT1"){ temAB=true; }
                    if(listaSeriais.seriais[j].livro=="ABMT2"){ temAB=true; }
                    if(listaSeriais.seriais[j].livro=="ABMT3"){ temAB=true; }

                 }

                 if(temAB==true){
                  $(".link-similar-book").css("opacity","1");
                 }
                 
                     // SE ESTIVERMOS LIDANDO COM STUDENTY BOOK
                     if(tipoLivro=="SB"){
                       
                       for(var i = 0;i<dados.paginas.length;i++){
                          
                          if(dados.paginas[i]["tipo"]!="activity_book"){  
                            // CONTROLE PAGINA 1
                            if(controlePaginas==0){
                               $("#aquiCarregamosImagens").append('<div class="item active"><img imagem-livro="'+idLivro+'" imagem-unidade="'+idUnidade+'" imagem-ativa="'+dados.paginas[i]["id"]+'" imagem-ativa-url="'+urlCnd+dados.paginas[i]["link"]+'" src="'+urlCnd+dados.paginas[i]["link"]+'"></div>');
                               
                               // ###########  POPULAR VÍDEOS  ########### 

                                   $("#toolbarVideo").empty();
                                   $("#toolbarVideoMobile").empty();
                                   for(var r = 0;r<dados.videos.length;r++){

                                    numVideo = r + 1;
                                    temLivro = 1;

                                    $("#toolbarVideo").append('<li><a href="javascript:void(0)" title="Clique para ver o vídeo" onclick="carregarVideo(\''+r+'\');">Video '+numVideo+'</a></li>');
                                    $("#toolbarVideoMobile").append('<li><a href="javascript:void(0)" title="Clique para ver o vídeo" onclick="carregarVideo(\''+r+'\');">Video '+numVideo+'</a></li>');
                                    
                                    localStorage.setItem("video_bd"+r,dados.videos[r].iframe_video); 

                                   }

                                   if(temLivro==9){
                                     $("#toolbarVideo").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum vídeo nessa unidade'>Nenhum<br> vídeo<br> nessa<br> unidade</a><li>");
                                     $("#toolbarVideoMobile").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum vídeo nessa unidade'>Nenhum<br> vídeo<br> nessa<br> unidade</a><li>");
                                   
                                   }

                              // ###########   POPULAR VÍDEO FIM  ########### 





                              // ###########   POPULAR TRACKS  ########### 

                                 $("#toolbarTracks").empty();
                                 $("#toolbarTracksMobile").empty();
                                 for(var s = 0;s<dados.sounds.length;s++){
                                    
                                    numTrack = s + 1;
                                    temTrack = 1;

                                    if(dados.sounds[s].pagina!="geral" && dados.sounds[s].tipo==setarLivroAberto){
                                    
                                        $("#toolbarTracks").append('<li><a href="javascript:void(0)" style="text-transform:lowercase;" title="Clique para ouvir o track" onclick="carregarTrack(\''+s+'\');">'+dados.sounds[s].nome+'</a></li>');
                                        $("#toolbarTracksMobile").append('<li><a href="javascript:void(0)" style="text-transform:lowercase;" title="Clique para ouvir o track" onclick="carregarTrackMobile(\''+s+'\');">'+dados.sounds[s].nome+'</a></li>');
                                        
                                        localStorage.setItem("track_bd"+s,dados.sounds[s].link);  

                                     }

                                 }  

                                  if(temTrack==9){
                                     $("#toolbarTracks").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum track nessa unidade'>Nenhum<br> track<br> nessa<br> unidade</a><li>");
                                     $("#toolbarTracksMobile").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum track nessa unidade'>Nenhum<br> track<br> nessa<br> unidade</a><li>");
                                   
                                   }

                              // ###########  POPULAR TRACKS FIM  ########### 
                                 



                            }else{
                              $("#aquiCarregamosImagens").append('<div class="item"><img imagem-livro="'+idLivro+'" imagem-unidade="'+idUnidade+'" imagem-ativa="'+dados.paginas[i]["id"]+'" imagem-ativa-url="'+urlCnd+dados.paginas[i]["link"]+'" src="'+urlCnd+dados.paginas[i]["link"]+'"></div>');
                            }
                            // CONTROLE PAGINA 1  
                            controlePaginas++;                          
                          }



                       } // FINAL DO FOR

                     }

                     
                     // SE ESTIVERMOS LIDANDO COM ACTIVITY BOOK
                     if(tipoLivro=="AB"){

                      for(var i = 0;i<dados.paginas.length;i++){
                          
                          if(dados.paginas[i]["tipo"]=="activity_book"){  
                              // CONTROLE PAGINA 1
                              if(controlePaginas==0){
                                 $("#aquiCarregamosImagens").append('<div class="item active"><img src="'+urlCnd+dados.paginas[i]["link"]+'"></div>');
                              }else{
                                $("#aquiCarregamosImagens").append('<div class="item"><img src="'+urlCnd+dados.paginas[i]["link"]+'"></div>');
                              }
                              // CONTROLE PAGINA 1 
                              controlePaginas++;
                          }

                       } // FINAL DO FOR


                       // ###########  POPULAR VÍDEOS  ########### 

                                   $("#toolbarVideo").empty();
                                   $("#toolbarVideoMobile").empty();
                                   for(var r = 0;r<dados.videos.length;r++){

                                    numVideo = r + 1;
                                    temLivro = 1;

                                    $("#toolbarVideo").append('<li><a href="javascript:void(0)" title="Clique para ver o vídeo" onclick="carregarVideo(\''+r+'\');">Video '+numVideo+'</a></li>');
                                    $("#toolbarVideoMobile").append('<li><a href="javascript:void(0)" title="Clique para ver o vídeo" onclick="carregarVideo(\''+r+'\');">Video '+numVideo+'</a></li>');
                                    
                                    localStorage.setItem("video_bd"+r,dados.videos[r].iframe_video); 

                                   }

                                   if(temLivro==9){
                                     $("#toolbarVideo").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum vídeo nessa unidade'>Nenhum<br> vídeo<br> nessa<br> unidade</a><li>");
                                     $("#toolbarVideoMobile").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum vídeo nessa unidade'>Nenhum<br> vídeo<br> nessa<br> unidade</a><li>");
                                   
                                   }

                              // ###########   POPULAR VÍDEO FIM  ########### 





                              // ###########   POPULAR TRACKS  ########### 

                                 $("#toolbarTracks").empty();
                                 $("#toolbarTracksMobile").empty();
                                 for(var s = 0;s<dados.sounds.length;s++){
                                    
                                    numTrack = s + 1;
                                    temTrack = 1;

                                    if(dados.sounds[s].pagina!="geral" && dados.sounds[s].tipo==setarLivroAberto){
                                    
                                        $("#toolbarTracks").append('<li><a href="javascript:void(0)" style="text-transform:lowercase;" title="Clique para ouvir o track" onclick="carregarTrack(\''+s+'\');">'+dados.sounds[s].nome+'</a></li>');
                                        $("#toolbarTracksMobile").append('<li><a href="javascript:void(0)" style="text-transform:lowercase;" title="Clique para ouvir o track" onclick="carregarTrack(\''+s+'\');">'+dados.sounds[s].nome+'</a></li>');
                                        
                                        localStorage.setItem("track_bd"+s,dados.sounds[s].link);  

                                     }

                                 }  

                                  if(temTrack==9){
                                     $("#toolbarTracks").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum track nessa unidade'>Nenhum<br> track<br> nessa<br> unidade</a><li>");
                                     $("#toolbarTracksMobile").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum track nessa unidade'>Nenhum<br> track<br> nessa<br> unidade</a><li>");
                                   
                                   }

                              // ###########  POPULAR TRACKS FIM  ########### 

                     }


              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS AO BAIXAR CONTEÚDO ESPECIFICO PARA PÁGINAS (loadPaginasLivro)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX


}


// CARREGAR, OU SEJA, TOCAR O TRACK SELECIONAOD
function carregarTrack(idTrack){
  
  // REMOVER ATRIBUTO MUDO ANTES DE EXECUTAR
  $("audio").attr("muted","false");

  console.log("TOCANDO O TRACK");

  var urlTrack = localStorage.getItem("track_bd"+idTrack);
  console.log("URL DO TRACK: "+urlTrack);

  $("#soundTracks").attr("src",urlCnd+urlTrack);
  
  // DANDO O PLAY
  $('#soundTracks').get(0).play();

  console.log("TRACK TOCADO");

}

function carregarTrackMobile(idTrack){
  
  // REMOVER ATRIBUTO MUDO ANTES DE EXECUTAR
  $("audio").attr("muted","false");

  console.log("TOCANDO O TRACK");

  var urlTrack = localStorage.getItem("track_bd"+idTrack);
  console.log("URL DO TRACK: "+urlTrack);

  $("#soundTracks").attr("src",urlCnd+urlTrack);
  
  // DANDO O PLAY
  $('#soundTracks').get(0).play();

  console.log("TRACK TOCADO");

}


// FUNÇÃO PARA TROCA DE SB PARA AB
function carregarActivityBook(){

  console.log("FUNÇÃO PARA CARREGAR ACTIVITY BOOK EM RELAÇÃO AO STUDENT BOOK");
  console.log("CONTEUDO DO ARRAY PAGINAS:");
  console.log(paginas);

  controlePaginas = 0;
  
  // DESLIGAR TODAS AS MÚSICAS AO TROCAR DE LIVRO
  desligarAllMusicas();
  
  // LIMPAR O HTML DA SESSÃO DAS IMAGENS SB, PARA QUE TENHAMOS ESPAÇO PARA O AB
  $("#aquiCarregamosImagens").html("");

                        // PREENCHER COM AS NOVAS PÁGINAS, TENTANDO MARCAR A PÁGINA ATIVA JÁ NO FOCUS 
                        for(var i = 0;i<paginas.tot_paginas;i++){
                          
                          if(paginas.paginas[i]["tipo"]=="activity_book"){  
                              // CONTROLE PAGINA 1
                              if(controlePaginas==0){
                                 $("#aquiCarregamosImagens").append('<div class="item active"><img src="'+urlCnd+paginas.paginas[i]["link"]+'"></div>');
                              }else{
                                $("#aquiCarregamosImagens").append('<div class="item"><img src="'+urlCnd+paginas.paginas[i]["link"]+'"></div>');
                              }
                              // CONTROLE PAGINA 1 
                              controlePaginas++;
                          }

                       } // FINAL DO FOR  

 // AJUSTE ACTIVITY BOOK
 var BTNTROCA_idLivro   = localStorage.getItem("BTNTROCA_idLivro");
 var BTNTROCA_idUnidade = localStorage.getItem("BTNTROCA_idUnidade");
 var BTNTROCA_tipoLivro = localStorage.getItem("BTNTROCA_tipoLivro");
 
 if(BTNTROCA_tipoLivro=="SB"){
   BTNTROCA_tipoLivro="AB";
 }

 if(BTNTROCA_tipoLivro=="AB"){
   BTNTROCA_tipoLivro="SB";
 }                       

                              var dados = paginas;

                              var numVideo;
                              var temLivro = 9;
                              var numTrack;
                              var temTrack = 9;

                              var setarLivroAberto = "activity_book";

                              // ###########  POPULAR VÍDEOS  ########### 
                                   $("#toolbarVideo").empty();
                                   $("#toolbarVideoMobile").empty();
                                   for(var r = 0;r<dados.videos.length;r++){
                                    numVideo = r + 1;
                                    temLivro = 1;
                                    $("#toolbarVideo").append('<li><a href="javascript:void(0)" title="Clique para ver o vídeo" onclick="carregarVideo(\''+r+'\');">Video '+numVideo+'</a></li>');
                                    $("#toolbarVideoMobile").append('<li><a href="javascript:void(0)" title="Clique para ver o vídeo" onclick="carregarVideo(\''+r+'\');">Video '+numVideo+'</a></li>');
                                    localStorage.setItem("video_bd"+r,dados.videos[r].iframe_video); 
                                   }
                                   if(temLivro==9){
                                     $("#toolbarVideo").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum vídeo nessa unidade'>Nenhum<br> vídeo<br> nessa<br> unidade</a><li>");
                                     $("#toolbarVideoMobile").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum vídeo nessa unidade'>Nenhum<br> vídeo<br> nessa<br> unidade</a><li>");
                                   }
                              // ###########   POPULAR VÍDEO FIM  ########### 
                             
                              // ###########   POPULAR TRACKS  ########### 
                                 $("#toolbarTracks").empty();
                                 $("#toolbarTracksMobile").empty();
                                 for(var s = 0;s<dados.sounds.length;s++){
                                    numTrack = s + 1;
                                    temTrack = 1;
                                    if(dados.sounds[s].pagina!="geral" && dados.sounds[s].tipo==setarLivroAberto){
                                        $("#toolbarTracks").append('<li><a href="javascript:void(0)" style="text-transform:lowercase;" title="Clique para ouvir o track" onclick="carregarTrack(\''+s+'\');">'+dados.sounds[s].nome+'</a></li>');
                                        $("#toolbarTracksMobile").append('<li><a href="javascript:void(0)" style="text-transform:lowercase;" title="Clique para ouvir o track" onclick="carregarTrackMobile(\''+s+'\');">'+dados.sounds[s].nome+'</a></li>');
                                        localStorage.setItem("track_bd"+s,dados.sounds[s].link);  
                                     }
                                 }  
                                  if(temTrack==9){
                                     $("#toolbarTracks").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum track nessa unidade'>Nenhum<br> track<br> nessa<br> unidade</a><li>");
                                     $("#toolbarTracksMobile").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum track nessa unidade'>Nenhum<br> track<br> nessa<br> unidade</a><li>");
                                   }
                              // ###########  POPULAR TRACKS FIM  ########### 
 
 // CARREGAR O CONTEÚDO DO LIVRO INVERSO
 //oadPaginasLivro(BTNTROCA_idLivro,BTNTROCA_idUnidade,BTNTROCA_tipoLivro);


  // ALTERAR O "link-similar-book" PARA FICAR REFERENCIADO PARA O SB
  $(".link-similar-book").html('<a href="javascript:void(0)" onclick="carregarStudentyBook();" style="background: #973158 !important;">student book</a>');

}



// FUNÇÃO PARA TROCA DE AB PARA SB
function carregarStudentyBook(){

      console.log("FUNÇÃO PARA CARREGAR STUDENT BOOK EM RELAÇÃO AO ACTIVITY BOOK");
      console.log("CONTEUDO DO ARRAY PAGINAS:");
      console.log(paginas);

      controlePaginas = 0;

      // DESLIGAR TODAS AS MÚSICAS AO TROCAR DE LIVRO
      desligarAllMusicas();
      
      // LIMPAR O HTML DA SESSÃO DAS IMAGENS AB, PARA QUE TENHAMOS ESPAÇO PARA O SB
      $("#aquiCarregamosImagens").html("");

                            // PREENCHER COM AS NOVAS PÁGINAS, TENTANDO MARCAR A PÁGINA ATIVA JÁ NO FOCUS 
                            for(var i = 0;i<paginas.tot_paginas;i++){
                              
                              if(paginas.paginas[i]["tipo"]!="activity_book"){  
                                  // CONTROLE PAGINA 1
                                  if(controlePaginas==0){
                                     $("#aquiCarregamosImagens").append('<div class="item active"><img src="'+urlCnd+paginas.paginas[i]["link"]+'"></div>');
                                  }else{
                                    $("#aquiCarregamosImagens").append('<div class="item"><img src="'+urlCnd+paginas.paginas[i]["link"]+'"></div>');
                                  }
                                  // CONTROLE PAGINA 1 
                                  controlePaginas++;
                              }

                           } // FINAL DO FOR  

                              var dados = paginas;

                              var numVideo;
                              var temLivro = 9;
                              var numTrack;
                              var temTrack = 9;

                              var setarLivroAberto = "student_book";

                              // ###########  POPULAR VÍDEOS  ########### 
                                   $("#toolbarVideo").empty();
                                   $("#toolbarVideoMobile").empty();
                                   for(var r = 0;r<dados.videos.length;r++){
                                    numVideo = r + 1;
                                    temLivro = 1;
                                    $("#toolbarVideo").append('<li><a href="javascript:void(0)" title="Clique para ver o vídeo" onclick="carregarVideo(\''+r+'\');">Video '+numVideo+'</a></li>');
                                    $("#toolbarVideoMobile").append('<li><a href="javascript:void(0)" title="Clique para ver o vídeo" onclick="carregarVideo(\''+r+'\');">Video '+numVideo+'</a></li>');
                                    localStorage.setItem("video_bd"+r,dados.videos[r].iframe_video); 
                                   }
                                   if(temLivro==9){
                                     $("#toolbarVideo").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum vídeo nessa unidade'>Nenhum<br> vídeo<br> nessa<br> unidade</a><li>");
                                     $("#toolbarVideoMobile").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum vídeo nessa unidade'>Nenhum<br> vídeo<br> nessa<br> unidade</a><li>");
                                   }
                              // ###########   POPULAR VÍDEO FIM  ########### 
                             
                              // ###########   POPULAR TRACKS  ########### 
                                 $("#toolbarTracks").empty();
                                 $("#toolbarTracksMobile").empty();
                                 for(var s = 0;s<dados.sounds.length;s++){
                                    numTrack = s + 1;
                                    temTrack = 1;
                                    if(dados.sounds[s].pagina!="geral" && dados.sounds[s].tipo==setarLivroAberto){
                                        $("#toolbarTracks").append('<li><a href="javascript:void(0)" style="text-transform:lowercase;" title="Clique para ouvir o track" onclick="carregarTrack(\''+s+'\');">'+dados.sounds[s].nome+'</a></li>');
                                        $("#toolbarTracksMobile").append('<li><a href="javascript:void(0)" style="text-transform:lowercase;" title="Clique para ouvir o track" onclick="carregarTrackMobile(\''+s+'\');">'+dados.sounds[s].nome+'</a></li>');
                                        localStorage.setItem("track_bd"+s,dados.sounds[s].link);  
                                     }
                                 }  
                                  if(temTrack==9){
                                     $("#toolbarTracks").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum track nessa unidade'>Nenhum<br> track<br> nessa<br> unidade</a><li>");
                                     $("#toolbarTracksMobile").html("<li style='text-align:center;'><a href='javascript:void(0)' title='Nenhum track nessa unidade'>Nenhum<br> track<br> nessa<br> unidade</a><li>");
                                   }
                              // ###########  POPULAR TRACKS FIM  ########### 








      // ALTERAR O "link-similar-book" PARA FICAR REFERENCIADO PARA O SB
      $(".link-similar-book").html('<a href="javascript:void(0)" onclick="carregarActivityBook();">activity book</a>');

}



// FUNÇÃO PARA CRIAÇÃO DO CANVAS DE EDIÇÃO DA FERRAMENTA DE DESENHO
var isDrawActive = 0;
var signaturePad;

function createDraw(){ 
    
    if(isDrawActive==0){
    
        console.log("INICIANDO FUNÇÃO PARA DESENHO NA TELA");
        $("#signature-pad").html('<div class="signature-pad--body"><canvas></canvas></div>');

        var wrapper = document.getElementById("signature-pad");
        var clearButton = wrapper.querySelector("[data-action=clear]");
        var changeColorButton = wrapper.querySelector("[data-action=change-color]");
        var undoButton = wrapper.querySelector("[data-action=undo]");
        var savePNGButton = wrapper.querySelector("[data-action=save-png]");
        var saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
        var saveSVGButton = wrapper.querySelector("[data-action=save-svg]");
        var canvas = wrapper.querySelector("canvas");
        signaturePad = new SignaturePad(canvas, {
          // It's Necessary to use an opaque color when saving image as JPEG;
          // this option can be omitted if only saving as PNG or SVG
          backgroundColor: 'rgba(255, 255, 255, 0.0)',

        });

        isDrawActive = 1;
        

    }



    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    function resizeCanvas() {
      // When zoomed out to less than 100%, for some very strange reason,
      // some browsers report devicePixelRatio as less than 1
      // and only part of the canvas is cleared then.
      var ratio =  Math.max(window.devicePixelRatio || 1, 1);

      // This part causes the canvas to be cleared
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);

      // This library does not listen for canvas changes, so after the canvas is automatically
      // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
      // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
      // that the state of this library is consistent with visual state of the canvas, you
      // have to clear it manually.
      signaturePad.clear();
    }

    // On mobile devices it might make more sense to listen to orientation change,
    // rather than window resize events.
    window.onresize = resizeCanvas;
    resizeCanvas();

    function download(dataURL, filename) {
      var blob = dataURLToBlob(dataURL);
      var url = window.URL.createObjectURL(blob);

      var a = document.createElement("a");
      a.style = "display: none";
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
    }

    // One could simply use Canvas#toBlob method instead, but it's just to show
    // that it can be done using result of SignaturePad#toDataURL.
    function dataURLToBlob(dataURL) {
      // Code taken from https://github.com/ebidel/filer.js
      var parts = dataURL.split(';base64,');
      var contentType = parts[0].split(":")[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;
      var uInt8Array = new Uint8Array(rawLength);

      for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
    }

    clearButton.addEventListener("click", function (event) {
      signaturePad.clear();
    });

    undoButton.addEventListener("click", function (event) {
      var data = signaturePad.toData();

      if (data) {
        data.pop(); // remove the last dot or line
        signaturePad.fromData(data);
      }
    });

    changeColorButton.addEventListener("click", function (event) {
      var r = Math.round(Math.random() * 255);
      var g = Math.round(Math.random() * 255);
      var b = Math.round(Math.random() * 255);
      var color = "rgb(" + r + "," + g + "," + b +")";

      signaturePad.penColor = "rgb(249,247,75)";
    });

    savePNGButton.addEventListener("click", function (event) {
      if (signaturePad.isEmpty()) {
        alert("Please provide a signature first.");
      } else {
        var dataURL = signaturePad.toDataURL();
        download(dataURL, "signature.png");
      }
    });

    saveJPGButton.addEventListener("click", function (event) {
      if (signaturePad.isEmpty()) {
        alert("Please provide a signature first.");
      } else {
        var dataURL = signaturePad.toDataURL("image/jpeg");
        download(dataURL, "signature.jpg");
      }
    });

    saveSVGButton.addEventListener("click", function (event) {
      if (signaturePad.isEmpty()) {
        alert("Please provide a signature first.");
      } else {
        var dataURL = signaturePad.toDataURL('image/svg+xml');
        download(dataURL, "signature.svg");
      }
    });

}


// FUNÇÃO PARA DESTRUIR O MÉTODO DO DESENHO NA TELA
function destroyDraw(){
   
   console.log("DESTRUINDO A FERRAMENTA DE DESENHO");
   $("#signature-pad").html(" ");

   // REMOVER O ÍCONE DE PÁGINA FAVORITADA DA PÁGINA
   $("#imgFavoritarPagina").attr("src","images/professor-favoritar.png");
   $("#imgFavoritarPagina2").attr("src","images/professor-favoritar.png");

   isDrawActive = 0;

}

// MUDAR COR DA FERRAMENTA DE DESENHO
function mudarCor(cor){

   console.log("DEFININDO A COR DA FERRAMENTA DE DESENHO: "+cor);

   signaturePad.penColor = cor;

   console.log("COR DA FERRAMENTA DE DESENHO ALTERADA");

}



// CARREGAR VIEW COMUNIDADE
function loadComunidade(){

      $('#sound1').get(0).pause();
      $('#sound2').get(0).play();
      desligarAllMusicas();

      $(".pagina-01 .container.tada").hide();
      $(".pagina-01 .container.caixa-conteudo").fadeIn("1900000");

      $(".pagina-01 .caixa-conteudo").css("min-height","800px");

      // ATIVAR O MENU LIVROS
      $(".menu-pai").removeClass("menu-ativo");
      $("#menuComunidade").addClass("menu-ativo");
      $("#menuComunidadeMobile").addClass("menu-ativo");
      
      // DIRECIONAR O USUÁRIO PARA A VIEW
      ativarJsView('1520');
      $JSView.goToView('viewComunidade');
      carregarAtividadesGeral();

}


// CARREGAR TODAS AS ATIVIDADES
function carregarAtividadesGeral(){
 
  console.log("%c INICIANDO FUNÇÃO PARA CARREGAR TODAS AS ATIVIDADES DA COMUNIDADE","background:#0d7112;color:#fff;");

  var idUsuario = localStorage.getItem("idUsuario");
  
              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"carregar-atividades-geral.php",
                  data:{idUsuario:idUsuario}                  
              
              })
              request.done(function (dados) {       

                  console.log("%c RETORNO DOS DADOS:","background:#0d7112;color:#fff;");  
                  console.log(dados);   

                 if(dados.sucesso=="200"){
                   
                   var usuarioJaImpresso = "";
                   var antigo = "NAO INICIADO";
                   var atual  = "";

                   // PREENCHER O COMBO COM OS NOMES DOS PROFESSORES
                   for(var g = 0;g<dados.tot_professores;g++){
                      
                      // ATIVIDADES DO PROFESSOR LOGADO
                      if(dados.professores[g].id==idUsuario && usuarioJaImpresso==""){
                          $("#listaProfessoresFiltro").append('<option value="'+dados.professores[g].nome+'">My activities</option>');
                          usuarioJaImpresso="JA";
                      }

                      // ATIVIDADE DOS DEMAIS PROFESSORES
                      atual = dados.professores[g].nome;
                      if(dados.professores[g].id!=idUsuario && antigo != atual){
                          $("#listaProfessoresFiltro").append('<option value="'+dados.professores[g].nome+'">'+dados.professores[g].nome+'</option>');
                          antigo = dados.professores[g].nome;
                      }

                   }

                   // LIMPAR POSSÍVEIS PROFESSORES DUPLICADOS
                   //$("#listaProfessoresFiltro option").val(function(idx, val) {

                     //if(val!="todos"){ $(this).siblings('[value="'+ val +'"]').remove(); }
                     
                   //});
                   
                   // IMPRIMIR AS ATIVIDADES NO HTML
                   var estrelas = "";
                   var classeFavorito = ""

                   for(var a = 0;a<dados.tot_atividades;a++){
                      
                      estrelas       = "";
                      classeFavorito = "";

                      // PROCESSAR SE A ATIVIDADE É FAVORITA DO USUÁRIO
                      for(var c = 0;c<dados.tot_favoritos;c++){
                         
                         if(idUsuario==dados.favoritos[c].id_professor && dados.atividades[a].id == dados.favoritos[c].id_atividade){

                           classeFavorito = "atividade-favoritada";
                         
                         }

                      }


                      // ALIMENTAR ESTRELAS
                      if(dados.atividades[a].rating=="0"){
                         estrelas='<i onclick="comboEstrela('+dados.atividades[a].id+',0);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',1)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',2)"; class="fa fa-star-o" aria-hidden="true"></i><i onclick="comboEstrela('+dados.atividades[a].id+',3)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',4)"; class="fa fa-star-o" aria-hidden="true"></i>';
                      }
                      if(dados.atividades[a].rating=="1"){
                         estrelas='<i onclick="comboEstrela('+dados.atividades[a].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',2)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',3)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',4)"; class="fa fa-star-o" aria-hidden="true"></i>';
                      }
                      if(dados.atividades[a].rating=="2"){
                         estrelas='<i onclick="comboEstrela('+dados.atividades[a].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',3)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',4)"; class="fa fa-star-o" aria-hidden="true"></i>';
                      }
                      if(dados.atividades[a].rating=="3"){
                         estrelas='<i onclick="comboEstrela('+dados.atividades[a].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',3)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',4)"; class="fa fa-star-o" aria-hidden="true"></i>';
                      }
                      if(dados.atividades[a].rating=="4"){
                         estrelas='<i onclick="comboEstrela('+dados.atividades[a].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',3)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',4)"; class="fa fa-star" aria-hidden="true"></i>';
                      }
                      if(dados.atividades[a].rating=="5"){
                         estrelas='<i onclick="comboEstrela('+dados.atividades[a].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',3)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividades[a].id+',4)"; class="fa fa-star" aria-hidden="true"></i>';
                      }
                      // ALIMENTAR ESTRELAS FIM
                   
                      $("#atividadesGeraisComunidade").append('<tr style="cursor:pointer;" busca-titulo="'+dados.atividades[a].titulo+'" busca-topico="'+dados.atividades[a].topic+'" busca-categoria="'+dados.atividades[a].category+'" busca-nivel="'+dados.atividades[a].level+'" busca-unidade="'+dados.atividades[a].unidade+'" busca-professor="'+dados.atividades[a].teatcher_name+'" id="atividadeLinha'+dados.atividades[a].id+'"> <td onclick="verDetalheAtividade('+dados.atividades[a].id+');" style="width: 140px;" busca-titulo="'+dados.atividades[a].titulo+'">'+dados.atividades[a].titulo+'</td><td onclick="verDetalheAtividade('+dados.atividades[a].id+');" busca-topico="'+dados.atividades[a].topic+'">'+dados.atividades[a].topic+'</td><td onclick="verDetalheAtividade('+dados.atividades[a].id+');" busca-categoria="'+dados.atividades[a].category+'">'+dados.atividades[a].category+'</td><td onclick="verDetalheAtividade('+dados.atividades[a].id+');" busca-nivel="'+dados.atividades[a].level+'">'+dados.atividades[a].level+'</td><td onclick="verDetalheAtividade('+dados.atividades[a].id+');" busca-unidade="'+dados.atividades[a].unidade+'">'+dados.atividades[a].unidade+'</td><td onclick="verDetalheAtividade('+dados.atividades[a].id+');" busca-professor="'+dados.atividades[a].teatcher_name+'">'+dados.atividades[a].teatcher_name+'</td><td class="estrelas" style="width:105px;">'+estrelas+'</td><td style="text-align: center;" class="favorito" onclick="favoritarAtividade('+dados.atividades[a].id+',\''+classeFavorito+'\');"> <i class="fa fa-heart '+classeFavorito+'" aria-hidden="true"></i> </td></tr>');
                   
                   }  

                 }else{

                      // NENHUMA ATIVIDADE CADASTRADA AINDA
                      $("#atividadesGeraisComunidade").html('<tr><td colspan="8" style="text-align:center;">Nenhuma atividade cadastrada ainda :(</td></tr>');
                 
                 }                  

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS AO BAIXAR TODAS AS ATIVIDADES (carregarAtividadesGeral)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX

}

// FUNÇÃO PARA FAVORITAR UMA DETERMINADA ATIVIDADE
function favoritarAtividade(idAtividade,classe){

  var idUsuario = localStorage.getItem("idUsuario");

  if(idAtividade==""){
    idAtividade = localStorage.getItem("favoritarAtividade");
  }
  
  console.log("INICIANDO FUNÇÃO PARA FAVORITAR UMA ATIVIDADE DA COMUNIDADE");
  console.log("%c ID DO PROFESSOR QUE FAVORITOU: "+idUsuario,"background:#fff000;color:#000");
  console.log("%c ID DA ATIVIDADE QUE FOI FAVORITADA: "+idAtividade,"background:#fff000;color:#000");
 
  if(classe!="atividade-favoritada"){

              console.log("FAVORITANDO UMA ATIVIDADE...............");

              // INICIO CHAMADA AJAX
              var request = $.ajax({
                  method: "POST",
                  url: urlApi+"favoritar-atividade-principal.php",
                  data:{idUsuario:idUsuario,idAtividade:idAtividade}
              })
              request.done(function (dados) {            
                 console.log("%c RESULTADO FAVORITO:","background:#ff0000;color:#fff;");
                 console.log(dados);
                 if(dados.sucesso=="200"){
                      $("#atividadeLinha"+idAtividade+" .favorito i").addClass("atividade-favoritada");
                      favortitarAtividadeInterna();
                 }else{
                   console.log("PROBLEMAS AO FAVORITAR UMA ATIVIDADE (favoritarAtividade)"); 
                 }
              });
              request.fail(function (dados) {
                   console.log("PROBLEMAS AO FAVORITAR UMA ATIVIDADE (favoritarAtividade)");                              
              });
              // FINAL CHAMADA AJAX

  }else{ 

               console.log("DESFAVORITANDO UMA ATIVIDADE...............");

              // INICIO CHAMADA AJAX
              var request = $.ajax({
                  method: "POST",
                  url: urlApi+"desfavoritar-atividade-principal.php",
                  data:{idUsuario:idUsuario,idAtividade:idAtividade}
              })
              request.done(function (dados) {            
                 console.log("%c RESULTADO FAVORITO:","background:#ff0000;color:#fff;");
                 console.log(dados);
                 if(dados.sucesso=="200"){
                      $("#atividadeLinha"+idAtividade+" .favorito i").removeClass("atividade-favoritada");
                 }else{
                   console.log("PROBLEMAS AO DESFAVORITAR UMA ATIVIDADE (favoritarAtividade)"); 
                 }
              });
              request.fail(function (dados) {
                   console.log("PROBLEMAS AO DESFAVORITAR UMA ATIVIDADE (favoritarAtividade)");                              
              });
              // FINAL CHAMADA AJAX

  }


             


  console.log("%c FINAL FAVORITAR ATIVIDADE","background:#ff0000;color:#fff;");
  console.log("REDIRECIONANDO O USUÁRIO PARA ATUALIZAR A LAYER:");

  $JSView.goToView('viewComunidade');
  carregarAtividadesGeral();

}


function favoritarAtividade2(){

  var idUsuario = localStorage.getItem("idUsuario");
  
    idAtividade = localStorage.getItem("favoritarAtividade");
  
  console.log("INICIANDO FUNÇÃO PARA FAVORITAR UMA ATIVIDADE DA COMUNIDADE");
  console.log("%c ID DO PROFESSOR QUE FAVORITOU: "+idUsuario,"background:#fff000;color:#000");
  console.log("%c ID DA ATIVIDADE QUE FOI FAVORITADA: "+idAtividade,"background:#fff000;color:#000");
 
                console.log("FAVORITANDO UMA ATIVIDADE...............");

              // INICIO CHAMADA AJAX
              var request = $.ajax({
                  method: "POST",
                  url: urlApi+"favoritar-atividade-principal.php",
                  data:{idUsuario:idUsuario,idAtividade:idAtividade}
              })
              request.done(function (dados) {            
                 console.log("%c RESULTADO FAVORITO:","background:#ff0000;color:#fff;");
                 console.log(dados);
                 if(dados.sucesso=="200"){
                      $("#atividadeLinha"+idAtividade+" .favorito i").addClass("atividade-favoritada");
                      favortitarAtividadeInterna();
                 }else{
                   console.log("PROBLEMAS AO FAVORITAR UMA ATIVIDADE INTERNAMENTE (favoritarAtividade2)"); 
                 }
              });
              request.fail(function (dados) {
                   console.log("PROBLEMAS AO FAVORITAR UMA ATIVIDADE INTERNAMENTE (favoritarAtividade2)");                              
              });
              // FINAL CHAMADA AJAX

            
  console.log("%c FINAL FAVORITAR ATIVIDADE INTERNAMENTE","background:#ff0000;color:#fff;");


}

// FUNÇÃO PARA PROCESSAR UMA TENTATIVA DETERMINAR O RATING DE UMA ATIVIDADE
function comboEstrela(idAtividade,avaliacao){

  var idUsuario = localStorage.getItem("idUsuario");

  console.log("%c ID DO PROFESSOR: "+idUsuario,"background:#fff000;color:#000");
  console.log("%c AVALIAÇÃO: "+avaliacao,"background:#fff000;color:#000");
  console.log("%c ID DA ATIVIDADE: "+idAtividade,"background:#fff000;color:#000");
  
              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"classificar-atividade.php",
                  data:{idUsuario:idUsuario,avaliacao:avaliacao,idAtividade:idAtividade}
              
              })
              request.done(function (dados) {            
                 
                 console.log("%c RESULTADO DA ALTERAÇÃO:","background:#ff0000;color:#fff;");
                 console.log(dados);

                 if(dados.sucesso=="200"){
                     
                       // ALTERAR AS ESTRELAS JÁ QUANDO O USUÁRIO FAZER A ESCOLA DE QUANTAS ESTRELAS ELE VAI QUERER 
                       if(avaliacao==0){
                          $("#atividadeLinha"+idAtividade+" td.estrelas").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star-o" aria-hidden="true"></i><i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star-o" aria-hidden="true"></i>');
                          $(".rating-atividade").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star-o" aria-hidden="true"></i><i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star-o" aria-hidden="true"></i>');
                      
                       }
                       if(avaliacao=="1"){
                           $("#atividadeLinha"+idAtividade+" td.estrelas").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star-o" aria-hidden="true"></i>');
                           $(".rating-atividade").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star-o" aria-hidden="true"></i>');
                      
                        }
                        if(avaliacao=="2"){
                           $("#atividadeLinha"+idAtividade+" td.estrelas").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star-o" aria-hidden="true"></i>');
                           $(".rating-atividade").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star-o" aria-hidden="true"></i>');
                       
                        }
                        if(avaliacao=="3"){
                           $("#atividadeLinha"+idAtividade+" td.estrelas").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star-o" aria-hidden="true"></i>');
                           $(".rating-atividade").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star-o" aria-hidden="true"></i>');
                       
                        }
                        if(avaliacao=="4"){
                           $("#atividadeLinha"+idAtividade+" td.estrelas").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star" aria-hidden="true"></i>');
                           $(".rating-atividade").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star" aria-hidden="true"></i>');
                       
                        }
                        if(avaliacao=="5"){
                           $("#atividadeLinha"+idAtividade+" td.estrelas").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star" aria-hidden="true"></i>');
                           $(".rating-atividade").html('<i onclick="comboEstrela('+idAtividade+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',1)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',2)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',3)"; class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+idAtividade+',4)"; class="fa fa-star" aria-hidden="true"></i>');
                       
                        }


                 }else{
                   console.log("PROBLEMAS AO CLASSIFICAR UMA ATIVIDADE (comboEstrela)"); 
                 }

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS AO CLASSIFICAR UMA ATIVIDADE (comboEstrela)");                              

              });
              // FINAL CHAMADA AJAX



  console.log("%c FIM COMBO ESTRELA","background:#ff0000;color:#fff;");

}



// CARREGAR VIEW TREINAMENTO
function loadTreinamento(){

      $('#sound1').get(0).pause();
      $('#sound2').get(0).play();
      
      desligarAllMusicas();

      $(".pagina-01 .container.tada").hide();
      $(".pagina-01 .container.caixa-conteudo").fadeIn("1900000");

      $(".pagina-01 .caixa-conteudo").css("min-height","800px");

      // ATIVAR O MENU LIVROS
      $(".menu-pai").removeClass("menu-ativo");
      $("#menuTraining").addClass("menu-ativo");
      $("#menuTrainingMobile").addClass("menu-ativo");
      
      // DIRECIONAR O USUÁRIO PARA A VIEW
      $JSView.goToView('viewTreinamento');

}






// FUNÇÃO PARA DAR UM ALERTA COM MENSAGEM PARA O USUÁRIO
function mensagem(mensagem){

  $(".alertas-usuarios").fadeIn("500");
  $(".alertas-usuarios h3").html(mensagem);

}

var conteudoGames = [];
var primeiraUnidade;
var nivelAtual = 1;

// ATIVAR GAMES
function ativarMenuGame(seletor){
  $('#sound1').get(0).pause();
  $('#sound2').get(0).play();
  desligarAllMusicas();

  var tutorialGames = localStorage.getItem("tutorialGames");
  if(tutorialGames!="javisto"){
    mensagem("Você sobe um nivel a cada 10 pontos conseguidos nos games!");
    localStorage.setItem("tutorialGames","javisto");
  }

  $(".pagina-01 .container.tada").hide();
  $(".pagina-01 .container.caixa-conteudo").fadeIn("1900000");

  $(".pagina-01 .caixa-conteudo").css("min-height","800px");

  var codigoLivroGame = $(seletor).attr("codigo-livro");
  console.log("%c CODIGO DO LIVRO A SEREM CARREGADOS GAMES (SERÁ SALVA NA LOCALSTORAGE): "+codigoLivroGame,"background:#16b428;color:#fff;");
  localStorage.setItem("codigoLivroGame",codigoLivroGame);

  //$JSView.goToView('viewMemoryGame');
  //memoryGame();

  // ATIVAR O MENU GAMES
  $(".menu-pai").removeClass("menu-ativo");
  $("#menuGames").addClass("menu-ativo");
  $("#menuGamesMobile").addClass("menu-ativo");

              console.log("INICIANDO FUNÇÃO PARA BAIXAR O CONTEÚDO DE GAMES");
              //var codigoLivroGame = localStorage.getItem("codigoLivroGame");
  
              // BAIXAR O CONTEÚDO DE GAMES
              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"carregar-games.php",
                  data:{codigoLivroGame:codigoLivroGame}                  
              
              })
              request.done(function (dados) {            

                 console.log("CONTEÚDO BAIXADO (GAMES):");
                 
                 // LIMPAR REGISTROS QUE NÃO VAMOS PRECISAR (COMO POR EXEMPLO LIVROS E UNIDADES FAKES OU VAZIAS)
                 var novoIndex = 0;
                 for(var i = 0;i<dados.tot_paginas;i++){

                    if(dados.paginas[i].id_livro<6 || dados.paginas[i].id_unidade==0){
                      delete dados.paginas[i];
                    }else{
                      conteudoGames[novoIndex] = dados.paginas[i];
                      novoIndex++;
                    }

                 }

                 //conteudoGames = dados;
                 console.log(conteudoGames);
                 console.log("TOTAL REAL DE REGISTROS: "+conteudoGames.length);
                 primeiraUnidade = conteudoGames[0]["id_unidade"];
                 console.log("%c PRIMEIRA UNIDADE: "+primeiraUnidade,"background:#ff0000;color:#fff;");

                 // ZERAR A LOCALSTORAGE QUE TINHA DADOS DO NÍVEL
                 localStorage.setItem("nivelGeralGames",1);
                 localStorage.setItem("unidadeAtualGame",primeiraUnidade);

                 // ATÉ ESSE PONTO TEMOS TODO O CONTEÚDO QUE SERÁ USADO EM GAMES CARREGADO
                 // ALÉM DA PRIMEIRA UNIDADE                                 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS AO BAIXAR CONTEÚDO GAMES (ativarMenuGame)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX

}


// RESETAR TODOS OS MENUS
function resetMenus(){
   
   console.log("INICIANDO FUNÇÃO PARA RESETAR TODOS OS MENUS");

   $(".menu-pai").removeClass("menu-ativo");

}

// ATIVAR AS DIVS DO JSVIEW
function ativarJsView(tamanho){
  
  // DESLIGAR TODAS AS MÚSICAS
  desligarAllMusicas();

  // TOCAR A MÚSICA DE TRANSIÇÃO
  $('#sound2').get(0).play();

  $(".pagina-01 .container.tada").hide();
  $(".pagina-01 .container.caixa-conteudo").fadeIn("1900000");
  
  // AJUSTAR O TAMANHO DA CAIXA DE CONTEÚDO
  $(".pagina-01 .caixa-conteudo").css("min-height",tamanho+"px");

}


function retrocederNivel(){

  if(nivelAtual==1){
    mensagem("Você já está no nivel inicial");
  }else{
    nivelAtual--;
    primeiraUnidade--;
    console.log("UNIDADE ATUAL: "+primeiraUnidade);
    $("#nivelGeralGames").html(nivelAtual);
    localStorage.setItem("nivelGeralGames",nivelAtual);
    localStorage.setItem("unidadeAtualGame",primeiraUnidade);
  }

}


function avancarNivel(){

  if(nivelAtual==8){
    mensagem("Você já está no maior nivel disponível");
  }else{
    nivelAtual++;
    primeiraUnidade++;
    console.log("UNIDADE ATUAL: "+primeiraUnidade);
    $("#nivelGeralGames").html(nivelAtual);
    localStorage.setItem("nivelGeralGames",nivelAtual);
    localStorage.setItem("unidadeAtualGame",primeiraUnidade);
  }

}

function atualizarNivel(){
  
    var nivelHistorico   = localStorage.getItem("nivelGeralGames");
    var unidadeHistorico = localStorage.getItem("unidadeAtualGame");

    primeiraUnidade = unidadeHistorico;
    nivelAtual      = nivelHistorico;
    
    $("#nivelGeralGames").html(nivelHistorico);

}



// ATIVAR VIDEOS
function ativarMenuVideos(){
  $('#sound1').get(0).pause();
  $('#sound2').get(0).play();
  desligarAllMusicas();

  $(".pagina-01 .container.tada").hide();
  $(".pagina-01 .container.caixa-conteudo").fadeIn("1900000");

  $(".pagina-01 .caixa-conteudo").css("min-height","800px");

  //$JSView.goToView('viewMemoryGame');
  //memoryGame();

  // ATIVAR O MENU VIDEOS
  $(".menu-pai").removeClass("menu-ativo");
  $("#menuVideos").addClass("menu-ativo");
  $("#menuVideosMobile").addClass("menu-ativo");

  carregarVideosGerais();
}


// CARREGAR OS VÍDEOS GERAIS
function carregarVideosGerais(){
   
   console.log("%c CARREGANDO OS VÍDEOS GERAIS DA PLATAFORMA","background:#ff0000;color:#fff;");

   var idUsuario = localStorage.getItem("idUsuario");

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"carregar-videos-geral.php",
                  data:{idUsuario:idUsuario}
              
              })
              request.done(function (dados) {            

                  if (dados["sucesso"]=="200") {
                        
                        console.log("%c VÍDEOS GERAIS BAIXADOS: ","background:#ff000;color:#fff;");
                        console.log(dados);
                       
                        var tot_videos = dados.videos.length;
                        for(var i = 0;i<tot_videos;i++){
                           
                           // IMPRIMIR O HTML
                           $("#areaVideosGeral").append('<div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 caixa-video" onclick="carregarVideo('+i+');"> <a href="javascript:void()" title="'+dados.videos[i].titulo+'">'+dados.videos[i].titulo+'</a> <br clear="both"/> <img src="'+dados.videos[i].url_thumb+'" alt="'+dados.videos[i].titulo+'"> <p style="font-size:11px;margin-top:-14px;">clique para abrir</p></div>');
                           localStorage.setItem("video_bd"+i,dados.videos[i].iframe_video);
                        }

                        if(tot_videos==0){
                          $("#areaVideosGeral").html('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"><p>&nbsp;</p><p style="font-family: \'granstander_cleanregular\';font-size:23px;">Em breve!</p></div>');
                        }


                  }else{

                       console.log("%c NENHUM VÍDEO CADASTRADO","background:#ff0000;color:#fff;");
                       $("#areaVideosGeral").html('<p style="text-align:center;padding-top:12px;font-family: \'granstander_cleanregular\';font-size:23px;">Nenhum vídeo cadastrado</p>');

                  } 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS NO LOGIN (carregarVideosGerais)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                   
              });
              // FINAL CHAMADA AJAX

    console.log("%c VÍDEOS GERAIS DA PLATAFORMA CARREGADOS","background:#ff0000;color:#fff;");


}





// ATIVAR SONGS
function ativarMenuSongs(){
  $('#sound1').get(0).pause();
  $('#sound2').get(0).play();
  desligarAllMusicas();

  $(".pagina-01 .container.tada").hide();
  $(".pagina-01 .container.caixa-conteudo").fadeIn("1900000");

  $(".pagina-01 .caixa-conteudo").css("min-height","900px");

  //$JSView.goToView('viewMemoryGame');
  //memoryGame();

  // ATIVAR O MENU SONGS
  $(".menu-pai").removeClass("menu-ativo");
  $("#menuSongs").addClass("menu-ativo");
  $("#menuSongsMobile").addClass("menu-ativo");
}

function loadMemoryGame(){

  $('#sound1').get(0).pause();
  //$('#sound2').get(0).play();
  desligarAllMusicas();

  playMusicBackground("#sound5");

  $(".pagina-01 .container.tada").hide();
  $(".pagina-01 .container.caixa-conteudo").fadeIn("1900000");

  $JSView.goToView('viewMemoryGame');
  memoryGame();

  // ATIVAR O MENU GAMES (ESTA REDUNDANTE)
  $(".menu-pai").removeClass("menu-ativo");
  $("#menuGames").addClass("menu-ativo");

}


function loadMathingGame(){

  $('#sound1').get(0).pause();
  //$('#sound2').get(0).play();
  desligarAllMusicas();

  //playMusic("#sound5");

  $(".pagina-01 .container.tada").hide();
  $(".pagina-01 .container.caixa-conteudo").fadeIn("1900000");

  $JSView.goToView('viewMathingGame');

  // PREENCHER AS IMAGENS DO MATHING GAME
  var controlePasso = 0;
  for(var i = 0;i<conteudoGames.length;i++){
      
      // VERIFICAR SE ESTAMOS NA UNIDADE CORRETA
      if(conteudoGames[i]["id_unidade"]==primeiraUnidade && conteudoGames[i]["tipo"]=="matching_game"){

        if(controlePasso==0){
          $("#mathingGame1 img").attr("src",urlCnd+conteudoGames[i]["link"]);
          
        }

        if(controlePasso==1){
          $("#mathingGame2 img").attr("src",urlCnd+conteudoGames[i]["link"]); 
          
        }

        if(controlePasso==2){
          $("#mathingGame3 img").attr("src",urlCnd+conteudoGames[i]["link"]);
          
        }

        if(controlePasso==3){
          $("#mathingGame4 img").attr("src",urlCnd+conteudoGames[i]["link"]);
          controlePasso=conteudoGames.length+1;
        }

        controlePasso++;

      }

  }
  // FINAL DO FOR DE PREENCHIMENTO DAS IMAGENS DO MATHING GAME

  mathingGame();

}

// CONTROLE SE USUARIO PODE OU NAO SELECIONAR UMA OPÇÃO NO MATHING GAME
var abertoOuFechado = "fechado";

function mathingGame(){

  console.log("INICIANDO FUNÇÃO DO MATHING GAME");
  
  var pontosMathing   = 0;
  var errosMathing    = 0;
  var tentativas      = 0; // MAX 4
  var realmenteclicou = 0;
  
  
  //var randomMathing = Math.floor(Math.random() * 4) + 1;
  //randomMathing = randomMathing - 1;

  // EMBARALHAR AS DIVS DOS ELEMENTOS DO MATHING GAME
  $('.itens-mathing-game .imagens-mathing').shuffle();

  var optionsMathing = {};

  optionsMathing[0] = {som:"#sound8",seletor:"#acerto1",tocado:"nao"};
  optionsMathing[1] = {som:"#sound9",seletor:"#acerto2",tocado:"nao"};
  optionsMathing[2] = {som:"#sound10",seletor:"#acerto3",tocado:"nao"};
  optionsMathing[3] = {som:"#sound11",seletor:"#acerto4",tocado:"nao"};
  
  // CARREGAR OS AUDIOS DO MATHING GAME
  var controlePasso = 0;
  for(var i = 0;i<conteudoGames.length;i++){
    
    if(conteudoGames[i]["id_unidade"]==primeiraUnidade && conteudoGames[i]["tipo"]=="matching_game"){

         if(controlePasso==0){ 
              optionsMathing[controlePasso] = {som:"#sound8",seletor:"#acerto1",tocado:"nao"}; 
              
              $("#sound8").attr("src",urlCnd+conteudoGames[i]["audio"]);
          }
         
         if(controlePasso==1){ 
              optionsMathing[controlePasso] = {som:"#sound9",seletor:"#acerto2",tocado:"nao"}; 
              
              $("#sound9").attr("src",urlCnd+conteudoGames[i]["audio"]);
          }
         
         if(controlePasso==2){ 
              optionsMathing[controlePasso] = {som:"#sound10",seletor:"#acerto3",tocado:"nao"}; 
               
              $("#sound10").attr("src",urlCnd+conteudoGames[i]["audio"]);
          }
         
         if(controlePasso==3){ 
              optionsMathing[controlePasso] = {som:"#sound11",seletor:"#acerto4",tocado:"nao"}; 
              $("#sound11").attr("src",urlCnd+conteudoGames[i]["audio"]);
              i = conteudoGames.length+1; 
         } 
         controlePasso++; 
    }// FINAL DO IF

  }
  // FINAL FOR PARA CARREGAMENTO DOS AUDIOS



  // ATUALIZAR NO ARRAY A INFORMAÇÃO QUE JÁ TEMOS UM AUDIO PRÉ EXECUTADO
  //optionsMathing[randomMathing].tocado = "sim";

      // AO CLICAR NO ÍCONE DO AUTO FALANTE EXECUTAR O SOM ATIVO
      $('#playMathingSound').click(function(){
         
         // TOCAR MÚSICA DO VOCABULÁRIO
         // NO CASO DO MATHING GAME, NÃO TEMOS O PROBLEMA DE SONS TOCANDO SIMULTANEAMENTE UM EM CIMA DO OUTRO
         // ENTÃO NESSE CASO, VAMOS TOCAR O AUDIO SEM QUALQUER CONTROLE
         playMusicBackground(optionsMathing[tentativas].som);
         optionsMathing[tentativas].tocado = "sim";    
         abertoOuFechado = "aberto"; 

      });
     
     // USUÁRIO ESCOLHEU UMA OPÇÃO
     $(".imagens-mathing").click(function(){
       

       if(abertoOuFechado=="aberto"){

                 console.log("USUÁRIO ESCOLHEU UMA OPÇÃO");

                 // CONTROLE DO NÚMERO DE TENTATIVAS
                 tentativas = tentativas + 1;
                 console.log("NÚMERO DE TENTATIVAS: "+tentativas);

                 pontosMathing++;

                  if(tentativas>=4){

                      if(pontosMathing==4){
                      $(".game-vitoria-game").fadeIn();
                      gameficacao();
                      playMusicBackground("#sound6");
                      playMusicBackground("#sound7");
                      console.log("TOTAL DE PONTOS: "+pontosMathing);
                      }else{
                         $(".game-derrota-game").fadeIn();
                         playMusicBackground("#sound4");
                         playMusicBackground("#sound12");
                         console.log("TOTAL DE PONTOS: "+pontosMathing);
                      }
                  }
                 
                 console.log(optionsMathing);

        }else{
           // SÓ NÃO VOU PRECISAR DO ALERTA AQUI, AS OUTRAS CONDIÇÕES JÁ ESTÃO CUIDANDO DISSO
        }
    
    });


           // USUÁRIO ARRISCOU A ALTERNATIVA 1
           $('#mathingGame1').click(function(){ 

              if(abertoOuFechado=="aberto"){
                    console.log("### USUÁRIO ARRISCOU A ALTERNATIVA 1");
                    if(tentativas==1){
                      console.log("USUARIO ACERTOU");
                      $("#acerto"+tentativas+" img.mathing-acerto").fadeIn(500);
                      //pontosMathing++;
                      console.log("### NUMERO DE PONTOS: "+pontosMathing);
                    }else{
                      console.log("USUARIO ERROU");
                      $("#acerto"+tentativas+" img.mathing-erro").fadeIn(500);
                      pontosMathing--;
                    }
                    abertoOuFechado="fechado";
              }else{
                 mensagem("Você precisa ouvir o áudio primeiro antes de fazer uma seleção");
              }

           });

           // USUÁRIO ARRISCOU A ALTERNATIVA 2
           $('#mathingGame2').click(function(){ 
              if(abertoOuFechado=="aberto"){
                      console.log("### USUÁRIO ARRISCOU A ALTERNATIVA 2");
                      if(tentativas==2){
                        console.log("USUARIO ACERTOU");
                        $("#acerto"+tentativas+" img.mathing-acerto").fadeIn(500);
                        //pontosMathing++;
                        console.log("### NUMERO DE PONTOS: "+pontosMathing);
                      }else{
                        console.log("USUARIO ERROU");
                        $("#acerto"+tentativas+" img.mathing-erro").fadeIn(500);
                        pontosMathing--;
                      }
                      abertoOuFechado="fechado";
              }else{
                mensagem("Você precisa ouvir o áudio primeiro antes de fazer uma seleção");
              }
           });

           // USUÁRIO ARRISCOU A ALTERNATIVA 3
           $('#mathingGame3').click(function(){ 
               if(abertoOuFechado=="aberto"){
                       console.log("### USUÁRIO ARRISCOU A ALTERNATIVA 3");
                       if(tentativas==3){
                        console.log("USUARIO ACERTOU");
                        $("#acerto"+tentativas+" img.mathing-acerto").fadeIn(500);
                        //pontosMathing++;
                        console.log("### NUMERO DE PONTOS: "+pontosMathing);
                      }else{
                        console.log("USUARIO ERROU");
                        $("#acerto"+tentativas+" img.mathing-erro").fadeIn(500);
                        pontosMathing--;
                      }
                      abertoOuFechado="fechado";
              }else{
                mensagem("Você precisa ouvir o áudio primeiro antes de fazer uma seleção");
              }
           });

           // USUÁRIO ARRISCOU A ALTERNATIVA 4
           $('#mathingGame4').click(function(){ 
              if(abertoOuFechado=="aberto"){
                        console.log("### USUÁRIO ARRISCOU A ALTERNATIVA 4");
                        if(tentativas==4){
                          console.log("USUARIO ACERTOU");
                          $("#acerto"+tentativas+" img.mathing-acerto").fadeIn(500);
                          //pontosMathing++;
                          console.log("### NUMERO DE PONTOS: "+pontosMathing);
                        }else{
                          console.log("USUARIO ERROU");
                          $("#acerto"+tentativas+" img.mathing-erro").fadeIn(500);
                          pontosMathing--;
                        }
                        abertoOuFechado="fechado";
              }else{
                 mensagem("Você precisa ouvir o áudio primeiro antes de fazer uma seleção");
              }
           });
 
  

}// FINAL DA FUNÇÃO DO MATHING GAME


// FUNÇÃO PARA SHUFFLE DIVS
(function($){
 
    $.fn.shuffle = function() {

        console.log("INICIANDO FUNÇÃO PARA DAR SHUFFLE NAS DIVS");
 
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
 
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
 
        return $(shuffled);

        console.log("SHUFFLE FINALIZADO");
 
    };
 
})(jQuery);
// FINAL FUNÇÃO PARA SHUFFLE DIVS


var dragAndrDropAcerto = "acerto";
var acertosDragAndDrop = 0;

function loadDragAndDrop(){
  
  acertosDragAndDrop = 0;

  $('#sound1').get(0).pause();
  //$('#sound2').get(0).play();
  desligarAllMusicas();

  //playMusic("#sound5");

  $(".pagina-01 .container.tada").hide();
  $(".pagina-01 .container.caixa-conteudo").fadeIn("1900000");

  $JSView.goToView('viewDragAndDrop');

  // INICIALIZAR O DRAG AND DROP
  dragAndDrop();

  // SHUFFLE NAS IMAGENS
  shuffleDragAndDrop( $('#listaElementosDragAndDrop li') );

}

function shuffleDragAndDrop($elements){

      var i, index1, index2, temp_val;

      var count = $elements.length;
      var $parent = $elements.parent();
      var shuffled_array = [];


      // populate array of indexes
      for (i = 0; i < count; i++) {
        shuffled_array.push(i);
      }

      // shuffle indexes
      for (i = 0; i < count; i++) {
        index1 = (Math.random() * count) | 0;
        index2 = (Math.random() * count) | 0;

        temp_val = shuffled_array[index1];
        shuffled_array[index1] = shuffled_array[index2];
        shuffled_array[index2] = temp_val;
      }

      // apply random order to elements
      $elements.detach();
      for (i = 0; i < count; i++) {
        $parent.append( $elements.eq(shuffled_array[i]) );
      }

}


var tocandoAlgo = false;
var interval;

var AUDIO_playlist = [];
//var valores  = [];
var AUDIO_player   = "livre";

var AUDIO_valores = {
       'musica' : "null",
       'status' : "tocando"
  }

// FUNÇÃO PARA TOCAR MUSICA
function playMusic(musica){
     
     /* CÓDIGOS ANTIGOS 12/07/2019 */
     /*
     $(seletor).get(0).play();
     $(seletor).on('playing', function() {
         playing = true;
         console.log("%c > TOCANDO AUDIO: "+seletor,"background:#1976D2;color:#fff;");
         // disable button/link
         return playing;
      });
      $(seletor).on('ended', function() {
         playing = false;
         console.log("%c > AUDIO ENCERRADO: "+seletor,"background:#1976D2;color:#fff;");
         // enable button/link     
         return playing;
      });
      */

      /* CÓDIGOS NOVOS 12/07/2019 */
      AUDIO_valores = {
           'musica' : musica,
           'status' : "não tocada"
      }
      AUDIO_playlist.push(AUDIO_valores);

      $("#playerOficial").on('playing', function() {
         console.log("%c > TOCANDO AUDIO: ","background:#1976D2;color:#fff;");
         AUDIO_player = "preso";
      });

      $("#playerOficial").on('ended', function() {
         console.log("%c > AUDIO ENCERRADO: ","background:#1976D2;color:#fff;");
         AUDIO_player = "livre";
      });
        
}


/* ############################################################################ */
/*                                                                              */
/* CONTROLAR A EXECUÇÃO DOS AUDIOS                                              */
/* Enquanto o intervalo estiver sendo executado, as músicas serão verificadas e */
/* tocadas, desde que, não toquem em simultâneo                                 */
/*                                                                              */
/*                                                                              */
var totalPosicoes = 0;
setInterval(function(){ 
  
   for (var i = 0; i < AUDIO_playlist.length; i++) {
      
      if(AUDIO_playlist[i].status=="não tocada" && AUDIO_player == "livre"){
         
         $("#playerOficial").attr("src",AUDIO_playlist[i].musica);
         console.log("TOCANDO..."+AUDIO_playlist[i].musica);
         console.log("POSIÇÃO..."+i);
         $('#playerOficial').get(0).play();
         AUDIO_playlist[i].status="tocando";
         AUDIO_player="preso";

      }
    
    //console.log("CICLO TIMEOUT FIM");
    //console.log(AUDIO_playlist);

   }

}, 50);
/*                                                                              */
/*                                                                              */
/* CONTROLAR A EXECUÇÃO DOS AUDIOS                                              */
/*                                                                              */
/* ############################################################################ */
      


// FUNÇÃO PARA TOCAR UMA MÚSICA DE BACKGROUND
function playMusicBackground(seletor){
   
   console.log("%c INICIANDO EXECUÇÃO DE MÚSICA EM BACKGROUND","background:#ff0000;color:#fff;");
   $(seletor).get(0).play();

}



// FUNÇÃO PARA PAUSAR MÚSICA
function pauseMusic(seletor){

  //console.log("PAUSANDO MÚSICA: "+seletor);

  // PAUSANDO MÚSICA
  $(seletor).get(0).pause();
  $(seletor).get(0).currentTime = 0;
  try{
     $("#soundTracks").get(0).pause();
  }catch(err) {
   console.log(err.message);
}


 

}

// PREENCHER O NOME DO LIVRO DA VIEW DE UNIDADES
function nomeLivro(nomeLivro){
   $("#nomeLivro").html(nomeLivro);
}


// PREENCHER O NOME DA UNIDADE DA VIEW DE UNIDADES
function nomeUnidade(nomeUnidade){
   $("#nomeUnidade").html(nomeUnidade);
}



// CARREGAR ARQUIVO PDF
function carregarPDF(){
      /*

      // If absolute URL from the remote server is provided, configure the CORS
      // header on that server.
      var url = 'images/pdf.pdf';

      // Loaded via <script> tag, create shortcut to access PDF.js exports.
      var pdfjsLib = window['pdf'];

      // The workerSrc property shall be specified.
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.js';

      // Asynchronous download of PDF
      var loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(function(pdf) {
        console.log('PDF loaded');

        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
          console.log('Page loaded');

          var scale = 1.5;
          var viewport = page.getViewport({scale: scale});

          // Prepare canvas using PDF page dimensions
          var canvas = document.getElementById('the-canvas');
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function () {
            console.log('Page rendered');
          });
        });
      }, function (reason) {
        // PDF loading error
        console.error(reason);
      });

      */


}

          var nomeCarta  = [];
          var imgCarta   = [];
          var idCarta    = [];   
          var audioCarta = [];

function memoryGame(){

        // Memory Game
        // © 2014 Nate Wiley
        // License -- MIT
        // best in full screen, works on phones/tablets (min height for game is 500px..) enjoy ;)
        // Follow me on Codepen

        (function(){

        	var Memory = {

        		init: function(cards){
        			this.$game = $(".game");
        			this.$modal = $(".modal");
        			this.$overlay = $(".modal-overlay");
        			this.$restartButton = $("button.restart");
        			this.cardsArray = $.merge(cards, cards);
        			this.shuffleCards(this.cardsArray);
        			this.setup();
        		},

        		shuffleCards: function(cardsArray){
        			this.$cards = $(this.shuffle(this.cardsArray));
        		},

        		setup: function(){
        			this.html = this.buildHTML();
        			this.$game.html(this.html);
        			this.$memoryCards = $(".card");
        			this.paused = false;
             	this.guess = null;
        			this.binding();
        		},

        		binding: function(){
        			this.$memoryCards.on("click", this.cardClicked);
        			this.$restartButton.on("click", $.proxy(this.reset, this));
        		},
        		// kinda messy but hey
        		cardClicked: function(){
        			var _ = Memory;
        			var $card = $(this);
        			if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
        				$card.find(".inside").addClass("picked");
        				if(!_.guess){
        					_.guess = $(this).attr("data-id");
        				} else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
        					$(".picked").addClass("matched"); 
                  
                  setTimeout(function(){
                    playMusic("sounds/goodjob.mp3"); // USUÁRIO ACERTOU
                  }, 1700);

        					_.guess = null;
        				} else {
        					_.guess = null;
        					_.paused = true;

        					setTimeout(function(){
        						$(".picked").removeClass("picked"); 
                    playMusic("sounds/try_again.mp3"); // USUARIO ERROU
        						Memory.paused = false;
        					}, 1700);

        				}
        				if($(".matched").length == $(".card").length){
        					_.win();
        				}
        			}
        		},

        		win: function(){ // USUAIRIO VENCEU
        			this.paused = true;
        			setTimeout(function(){

                pauseMusic("#sound5");
                playMusicBackground("#sound6");
                playMusicBackground("#sound7");

                $(".game-vitoria-game").fadeIn("50");
                gameficacao();


        				Memory.showModal();
        				//Memory.$game.fadeOut();
        			}, 1000);
        		},

        		showModal: function(){
        			this.$overlay.show();
        			this.$modal.fadeIn("slow");
        		},

        		hideModal: function(){
        			this.$overlay.hide();
        			this.$modal.hide();
        		},

        		reset: function(){
        			this.hideModal();
        			this.shuffleCards(this.cardsArray);
        			this.setup();
        			this.$game.show("slow");
              pauseMusic("#sound5");
        		},

        		// Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
        		shuffle: function(array){
        			var counter = array.length, temp, index;
        	   	// While there are elements in the array
        	   	while (counter > 0) {
                	// Pick a random index
                	index = Math.floor(Math.random() * counter);
                	// Decrease counter by 1
                	counter--;
                	// And swap the last element with it
                	temp = array[counter];
                	array[counter] = array[index];
                	array[index] = temp;
        	    	}
        	    	return array;
        		},

        		buildHTML: function(){
        			var frag = '';
        			this.$cards.each(function(k, v){
        				frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
        				<div class="front"><img src="'+ v.img +'"\
        				alt="'+ v.name +'" /></div>\
        				<div class="back"><img src="images/costas.svg"\
        				alt="MagicTree" /></div></div>\
        				</div>';
        			});
        			return frag;
        		}
        	};

          // CARREGAR AS CARTAS DO MEMORY GAME      
          
          
          var controleCartas = 0;
          var controleIndex  = 0;
          for(var i = 0;i<conteudoGames.length;i++){

            if(conteudoGames[i]["tipo"]=="memory_game" && conteudoGames[i]["id_unidade"] == primeiraUnidade){
               
               nomeCarta[controleIndex] = "carta"+controleIndex;
               imgCarta[controleIndex]  = urlCnd+conteudoGames[i]["link"];
               audioCarta[controleIndex] = urlCnd+conteudoGames[i]["audio"];
               idCarta[controleIndex]   = controleIndex;

               controleIndex++;
               controleCartas++;
            }

          }
          // FINAL DO FOR 
          
          
        	var cards = [
        		{
        			name: nomeCarta[0],
        			img: imgCarta[0],
        			id: idCarta[0]
        		},
        		{
        			name: nomeCarta[1],
              img: imgCarta[1],
              id: idCarta[1]
        		},
        		{
        			name: nomeCarta[2],
              img: imgCarta[2],
              id: idCarta[2]
        		},
        		{
        			name: nomeCarta[3],
              img: imgCarta[3],
              id: idCarta[3]
        		}

        	];

          //console.log("O QUE EU SOU");
          //console.log(cards);

        	Memory.init(cards);


        })();


}
// AO CLICAR EM UMA CARTA DO MEMORY GAME, VAMOS TOCAR O SOM CORRESPONDENTE
$('body').on('click', 'div.card', function() {

    var urlMusica = $(this).attr("data-id");
    console.log("CARTA CLICADA FOI A: "+urlMusica);
    
    // E AI DE ACORDO COM A MÚSICA TOCAMOS O SOM

    if(urlMusica==0){
      //$("#sound8").attr("src",audioCarta[0]);
      playMusic(audioCarta[0]);
    }
    
    if(urlMusica==1){
      //$("#sound9").attr("src",audioCarta[1]);
      playMusic(audioCarta[1]);
    }
    
    if(urlMusica==2){
      //$("#sound10").attr("src",audioCarta[2]);
      playMusic(audioCarta[2]);
    }
    
    if(urlMusica==3){
      //$("#sound11").attr("src",audioCarta[3]);
      playMusic(audioCarta[3]);
    }

});






// VARIAVEL GERAL DO JPLAYER
var my_jPlayer;
var musicas = ["sounds/musica1.mp3",
               "sounds/musica2.mp3",
               "sounds/musica3.mp3",
               "sounds/musica4.mp3"];

function desligarAllMusicas(){
  pauseMusic("#sound3");
  pauseMusic("#sound4");
  pauseMusic("#sound5");
  pauseMusic("#sound6");
  pauseMusic("#sound7");
  pauseMusic("#sound8");
  pauseMusic("#sound9");
  pauseMusic("#sound10");
  pauseMusic("#sound11");
  pauseMusic("#sound12");
  pauseMusic("audio");
  
  // GARANTIR QUE AS MÚSICAS DO MUSIC PLAYER SERÃO DESATIVADAS
  //inicializarMusicPlayer();

  /*
  try {
    my_jPlayer.jPlayer("stop");
  }
  catch(err) {
    console.log(err.message);
  }
  */

  $(document).ready(function(){
    $("html").scrollTop(0);
    $("body").scrollTop(0);
    $(".caixa-conteudo").scrollTop(0);
    $(".page-content").scrollTop(0); 
    $("jsv-content").scrollTop(0);    
});

}

var musicasDesligadas = 0;

function reduceAllVolume(){

  

  if(musicasDesligadas==0){

      var element = document.getElementById('sound1'); element.muted = "muted";
      //var element = document.getElementById('sound2'); element.muted = "muted";
      //var element = document.getElementById('sound3'); element.muted = "muted";
      //var element = document.getElementById('sound4'); element.muted = "muted";
      var element = document.getElementById('sound5'); element.muted = "muted";
      //var element = document.getElementById('soundTracks'); element.muted = "muted";
      pauseMusic("#soundTracks");
      //var element = document.getElementById('sound6'); element.muted = "muted";
      //var element = document.getElementById('sound7'); element.muted = "muted";
      //var element = document.getElementById('sound8'); element.muted = "muted";
      //var element = document.getElementById('sound9'); element.muted = "muted";
      //var element = document.getElementById('sound10'); element.muted = "muted";
      //var element = document.getElementById('sound11'); element.muted = "muted";
      //var element = document.getElementById('sound12'); element.muted = "muted";

      musicasDesligadas = 1;

  }else{

    $("audio").removeAttr("muted");
    musicasDesligadas = 0;
  
  }

}



// ######################### CONSTRUIR E POPULAR O MUSIC PLAYER PARA SOUNDS GERAIS
var tracks;
function inicializarMusicPlayer(){

  var idUsuario = localStorage.getItem("idUsuario");
    
                            // BUSCAR OS AUDIOS
                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"carregar-tracks-geral.php",
                                data:{idUsuario:idUsuario}
                            
                            })
                            request.done(function (dados) {            

                                if (dados["sucesso"]=="200") {
                                      
                                      console.log("%c TRACKS GERAIS BAIXADOS: ","background:#ff000;color:#fff;");
                                      console.log(dados);

                                      if(dados.tot_sounds!=0){

                                          // TRANSFERIR OS DADOS
                                          tracks = dados.sounds;

                                          // CHAMAR A FUNÇÃO QUE CONSTROI O PLAYER
                                          construirMusicPlayer();

                                      }else{

                                         $(".music-player-novo").html('<p style="font-size:23px;text-align:center;">Em breve!</p>');

                                      }

                                      

                                }else{

                                     console.log("%c NENHUM TRACK CADASTRADO","background:#ff0000;color:#fff;");
                                     $(".music-player-novo").html('<p style="text-align:center;padding-top:20px;">Nenhum song cadastrado</p>');
                                     
                                } 

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS NO LOGIN (inicializarMusicPlayer)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX

}
function construirMusicPlayer(){

                jQuery(function ($) {
                    'use strict'
                    var supportsAudio = !!document.createElement('audio').canPlayType;
                    if (supportsAudio) {
                        // initialize plyr
                        var player = new Plyr('#audio1', {
                            controls: [
                                'restart',
                                'play',
                                'progress',
                                'current-time',
                                'duration',
                                'mute',
                                'volume'
                            ]
                        });
                        // initialize playlist and controls
                        var index = 0,
                            playing = false,
                            mediaPath = urlCnd,
                            extension = '';
                                              
                            
                        /*
                        var tracks = [{
                                "track": 1,
                                "name": "Música 01",
                                "duration": "7:00",
                                "file": "musica1"
                            }, {
                                "track": 2,
                                "name": "Música 02",
                                "duration": "7:00",
                                "file": "musica2"
                            }, {
                                "track": 3,
                                "name": "Música 3",
                                "duration": "7:00",
                                "file": "musica3"
                            }, {
                                "track": 4,
                                "name": "Música 4",
                                "duration": "7:00",
                                "file": "musica4"
                            }];
                          */

                            console.log("%c TRACKS: ","background:#ff0000;color:#fff;");
                            console.log(tracks);

                            var buildPlaylist = $(tracks).each(function(key, value) {
                                var trackNumber = value.track,
                                    trackName = value.name,
                                    trackDuration = value.duration;
                                if (trackNumber.toString().length === 1) {
                                    trackNumber = '0' + trackNumber;
                                }
                                $('#plList').append('<li> \
                                    <div class="plItem"> \
                                        <span class="plNum">' + trackNumber + '.</span> \
                                        <span class="plTitle">' + trackName + '</span> \
                                        <span class="plLength">' + trackDuration + '</span> \
                                    </div> \
                                </li>');
                            }),
                            trackCount = tracks.length,
                            npAction = $('#npAction'),
                            npTitle = $('#npTitle'),
                            audio = $('#audio1').on('play', function () {
                                playing = true;
                                npAction.text('Tocando agora...');
                            }).on('pause', function () {
                                playing = false;
                                npAction.text('Pausado...');
                            }).on('ended', function () {
                                npAction.text('Pausado...');
                                if ((index + 1) < trackCount) {
                                    index++;
                                    loadTrack(index);
                                    audio.play();
                                } else {
                                    audio.pause();
                                    index = 0;
                                    loadTrack(index);
                                }
                            }).get(0),
                            btnPrev = $('#btnPrev').on('click', function () {
                                if ((index - 1) > -1) {
                                    index--;
                                    loadTrack(index);
                                    if (playing) {
                                        audio.play();
                                    }
                                } else {
                                    audio.pause();
                                    index = 0;
                                    loadTrack(index);
                                }
                            }),
                            btnNext = $('#btnNext').on('click', function () {
                                if ((index + 1) < trackCount) {
                                    index++;
                                    loadTrack(index);
                                    if (playing) {
                                        audio.play();
                                    }
                                } else {
                                    audio.pause();
                                    index = 0;
                                    loadTrack(index);
                                }
                            }),
                            li = $('#plList li').on('click', function () {
                                var id = parseInt($(this).index());
                                if (id !== index) {
                                    playTrack(id);
                                }
                            }),
                            loadTrack = function (id) {
                                $('.plSel').removeClass('plSel');
                                $('#plList li:eq(' + id + ')').addClass('plSel');
                                npTitle.text(tracks[id].name);
                                index = id;
                                audio.src = mediaPath + tracks[id].file + extension;
                            },
                            playTrack = function (id) {
                                loadTrack(id);
                                audio.play();
                            };
                        extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
                        loadTrack(index);
                    } else {
                        // boo hoo
                        $('.column').addClass('hidden');
                        var noSupport = $('#audio1').text();
                        $('.container').append('<p class="no-support">' + noSupport + '</p>');
                    }
                });

}




/*
*
* SCRIPTS PARA O DRAG AND DROP
*
*/

// VAMOS JÁ DEIXAR DECLARADAS AS MÚSICAS QUE SERÃO USADAS NO MATHING GAME
var musicaForMathing1 = "";
var musicaForMathing2 = "";
var musicaForMathing3 = "";
var musicaForMathing4 = "";

// FUNÇÃO PARA ORGANIZAR OS MATHING IN GAME
function dragAndDrop(){
        

        // CASO A TELA SEJA MENOR QUE 1024 (TABLET) VAMOS EXECUTAR A LÓGICA PARA MOBILE
        if($(window).width() <= 1024){
            
            console.log("USUÁRIO ESTÁ EXECUTANDO O MODO MOBILE");

            $('#dragAndrDrop1').draggable();
            $('#dragAndrDrop2').draggable();
            $('#dragAndrDrop3').draggable();
            $('#dragAndrDrop4').draggable();

            $('#dragAndrDrop1').bind('click', function() {
              $('#dragAndrDrop1').addClass("diogenes-pulse2");
              playMusic(musicaForMathing1); dragAndDropErrado = 'acerto';              
              
                  setTimeout(function(){
                    acertoDragAndDrop();
                  }, 1000);
                  setTimeout(function(){
                    $('#dragAndrDrop1').fadeOut('500');
                  }, 3500);

            });


            $('#dragAndrDrop2').bind('click', function() {
              $('#dragAndrDrop2').addClass("diogenes-pulse2");
              playMusic(musicaForMathing2); dragAndDropErrado = 'acerto';
                  setTimeout(function(){
                    acertoDragAndDrop();
                  }, 1000);
                  setTimeout(function(){
                    $('#dragAndrDrop2').fadeOut('500');
                  }, 3500);
            });

            $('#dragAndrDrop3').bind('click', function() {
              $('#dragAndrDrop3').addClass("diogenes-pulse2");
              playMusic(musicaForMathing3); dragAndDropErrado = 'acerto';
                 setTimeout(function(){
                    acertoDragAndDrop();
                  }, 1000);
                  setTimeout(function(){
                    $('#dragAndrDrop3').fadeOut('500');
                  }, 3500);
            });

            $('#dragAndrDrop4').bind('click', function() {              
              playMusic(musicaForMathing4); dragAndDropErrado = 'errado';
              setTimeout(function(){
                    erroDragAndDrop();
                  }, 1000);
            });                 


        }// FINAL ADAPTAÇÃO MODO MOBILE

        // CARREGAR OS ELEMENTOS DRAG AND DROP
        var controleAcertoDrag = 1;
        for(var i = 0;i<conteudoGames.length;i++){

            if(conteudoGames[i]["tipo"]=="drag_and_drop" && conteudoGames[i]["id_unidade"]==primeiraUnidade){

               // PREENCHER COM A INSTRUÇÃO DO JOGO QUANDO DISPONÍVEL
               if(conteudoGames[i]["instrucao"]!=""&&conteudoGames[i]["instrucao"]!=null){
                 $("#instrucaoDragAndDrop").html(conteudoGames[i]["instrucao"]);
                 
                 // PREENCHER INSTRUÇÃO DRAG AND DROP MOBILE
                 if($(window).width() <= 1024){
                   $("#instrucaoDragAndDropMobile").html(conteudoGames[i]["instrucao"]);
                 }

                 console.log("PREENCHENDO INSTRUÇÃO");

               }
               
               // COLUNA DA ESQUERDA
               if(conteudoGames[i]["extra_config"]=="Coluna esquerda"){
                $("#dragAndDropEsquerda").attr("src",urlCnd+conteudoGames[i]["link"]);
               }
               
               // SEMPRE O 4 SERÁ A ALTERNATIVA ERRADA
               if(conteudoGames[i]["extra_config"]=="Coluna direita errada"){
                $("#dragAndrDrop4 img").attr("src",urlCnd+conteudoGames[i]["link"]);
                $("#sound11").attr("src",urlCnd+conteudoGames[i]["audio"]);
                musicaForMathing4 = urlCnd+conteudoGames[i]["audio"];
               }

               // COLUNA DA DIREITA ACERTOS
               if(conteudoGames[i]["extra_config"]=="Coluna direita acerto"){
                $("#dragAndrDrop"+controleAcertoDrag+" img").attr("src",urlCnd+conteudoGames[i]["link"]);
                   
                     if(controleAcertoDrag==1){
                        $("#sound8").attr("src",urlCnd+conteudoGames[i]["audio"]);
                        musicaForMathing1 = urlCnd+conteudoGames[i]["audio"];
                     }

                     if(controleAcertoDrag==2){
                        $("#sound9").attr("src",urlCnd+conteudoGames[i]["audio"]);
                        musicaForMathing2 = urlCnd+conteudoGames[i]["audio"];
                     }

                     if(controleAcertoDrag==3){
                        $("#sound10").attr("src",urlCnd+conteudoGames[i]["audio"]);
                        musicaForMathing3 = urlCnd+conteudoGames[i]["audio"];
                     }

                controleAcertoDrag++;
              
               }

            }

        }

        var addEvent = (function () {
          if (document.addEventListener) {
            return function (el, type, fn) {
              if (el && el.nodeName || el === window) {
                el.addEventListener(type, fn, false);
              } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                  addEvent(el[i], type, fn);
                }
              }
            };
          } else {
            return function (el, type, fn) {
              if (el && el.nodeName || el === window) {
                el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
              } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                  addEvent(el[i], type, fn);
                }
              }
            };
          }
        })();

        (function () {

        var pre = document.createElement('pre');
        pre.id = "view-source"

        // private scope to avoid conflicts with demos
        addEvent(window, 'click', function (event) {
          if (event.target.hash == '#view-source') {
            // event.preventDefault();
            if (!document.getElementById('view-source')) {
              pre.innerHTML = ('<!DOCTYPE html>\n<html>\n' + document.documentElement.innerHTML + '\n</html>').replace(/[<>]/g, function (m) { return {'<':'&lt;','>':'&gt;'}[m]});
              document.body.appendChild(pre);      
            }
            document.body.className = 'view-source';
            
            var sourceTimer = setInterval(function () {
              if (window.location.hash != '#view-source') {
                clearInterval(sourceTimer);
                document.body.className = '';
              }
            }, 200);
          }
        });
          
        })();


          var eat = ['yum!', 'gulp', 'burp!', 'nom'];
          var yum = document.createElement('p');
          var msie = /*@cc_on!@*/0;
          yum.style.opacity = 1;

          var links = document.querySelectorAll('li > a'), el = null;
          for (var i = 0; i < links.length; i++) {
            el = links[i];
          
            el.setAttribute('draggable', 'true');

            //$(el).draggable();
          
            addEvent(el, 'dragstart', function (e) {
              e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
              e.dataTransfer.setData('Text', this.id); // required otherwise doesn't work
            });
          }

          var bin = document.querySelector('#bin');

          addEvent(bin, 'dragover', function (e) {
            if (e.preventDefault) e.preventDefault(); // allows us to drop
            this.className = 'over';
            e.dataTransfer.dropEffect = 'copy';
            return false;
          });

          // to get IE to work
          addEvent(bin, 'dragenter', function (e) {
            this.className = 'over';
            return false;
          });

          addEvent(bin, 'dragleave', function () {
            this.className = '';
          });

          addEvent(bin, 'drop', function (e) {

            if(dragAndDropErrado=="acerto"){
                    
                    
                    // ATRASO DE 2 SEGUNDOS ANTES DE TOCAR A MÚSICA DE ACERTO
                    setTimeout(function(){

                       acertoDragAndDrop();

                      }, 1500);                    


                    if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???

                    var el = document.getElementById(e.dataTransfer.getData('Text'));
                    
                    el.parentNode.removeChild(el);
                            

                    // stupid nom text + fade effect
                    bin.className = '';
                    //yum.innerHTML = eat[parseInt(Math.random() * eat.length)];

                    var y = yum.cloneNode(true);
                    bin.appendChild(y);



                    setTimeout(function () {
                      var t = setInterval(function () {
                        if (y.style.opacity <= 0) {
                          if (msie) { // don't bother with the animation
                            y.style.display = 'none';
                          }
                          clearInterval(t); 
                        } else {
                          y.style.opacity -= 0.1;
                        }
                      }, 50);
                    }, 250);

                    return false;

            }else{              
              
                    // ATRASO DE 2 SEGUNDOS ANTES DE TOCAR A MÚSICA DE ERRO
                    setTimeout(function(){

                       erroDragAndDrop();

                    }, 1500); 

            }
          });


}

function erroDragAndDrop(){
        
            playMusic("sounds/try_again.mp3"); // USUÁRIO ACERTOU
       
}
function acertoDragAndDrop(){

       
            playMusic("sounds/goodjob.mp3"); // USUÁRIO ACERTOU
       

        acertosDragAndDrop++;
        
        // USUÁRIO ACERTOU TODOS
        if(acertosDragAndDrop==3){
              
                    // ATRASO DE 2 SEGUNDOS ANTES DE TOCAR E EXIBIR A MÚSICA/TELA DE VITÓRIA
                    setTimeout(function(){

                       $(".game-vitoria-game").fadeIn();
                       gameficacao();

                       // MÚSICAS DE VÍTÓRIA PODEM SER TOCADAS EM SIMULTANEO COM OS DEMAIS AUDIOS
                       playMusicBackground("#sound6");
                       playMusicBackground("#sound7");

                    }, 1500); 

        }

}


/*
*
* SCRIPTS PARA O DRAG AND DROP
*
*/


// FUNCAO PARA CARREGAMENTO DE UM VÍDEO ESPECIFICO
function carregarVideo(idouIframeVideoDetalhe){
  
  console.log("CARREGANDO VÍDEO: "+idouIframeVideoDetalhe);

  // CARREGAR O MODAL DO VÍDEO
  $(".area-iframe-video").fadeIn('500');

  // RECUPERAR O ID DO VÍDEO
  var iframe_video = localStorage.getItem("video_bd"+idouIframeVideoDetalhe);

  // CARREGAR O IFRAME DO VÍDEO
  $(".area-iframe-video #areaIframeVideo").html(iframe_video);



}

// FUNCAO PARA FECHAR MODAL E EXECUCAO DA AREA DE VIDEOS
function fecharVideos(){
   
   console.log("FECHANDO MODAL E EXECUCAO DE VÍDEOS");

   // LIMPAR A AREA DO IFRAME PARA FECHAR O VIDEO
   $(".area-iframe-video #areaIframeVideo").html(' ');

   // FECHAR O MODAL DA AREA DOS VIDEOS
   $(".area-iframe-video").fadeOut('500');

}


// FUNÇÃO PARA ABRIR O MODAL DE UPLOAD DA IMAGEM DE PERFIL DO USUÁRIO
function uploadProfilePicture(){
  
  var idUsuario = localStorage.getItem("idUsuario");

  $(".area-iframe-upload").fadeIn("500");

  var urlDoIframe = "https://www.baltimoreeducation.com.br/api/iframe-upload.php";

  urlDoIframe = urlDoIframe+"?idUsuario="+idUsuario;

  console.log("%c URL CRIADA PARA O IFRAME DO UPLOAD: "+urlDoIframe,"background:#fff000;color:#000;");

  $("#iframeUpload").attr("src",urlDoIframe);

}


// FUNCAO PARA FECHAR MODAL IFRAME UPLOAD DE IMAGEM DE PERFIL
function fecharIframeUpload(){
   
   console.log("FECHANDO MODAL IFRAME UPLOAD");

   // FECHAR O MODAL DA AREA DO IFRAME UPLOAD DE IMAGEM
   $(".area-iframe-upload").fadeOut('500');

}


// CARREGAR DADOS PARA O MANAGE ACCOUNT
function carregarAccount(){
   
   console.log("INICIANDO FUNÇÃO PARA CARREGAR OS DADOS PARA MANAGE ACCOUNT");

   var idUsuario = localStorage.getItem("idUsuario");

                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"carregar-manage-account.php",
                                data:{idUsuario:idUsuario}
                            
                            })
                            request.done(function (dados) {            

                                if (dados["sucesso"]=="200") {

                                  console.log("%c DADOS RETORNADOS:","background:#ff000;color:#fff;");
                                  console.log(dados);
                                  
                                  // ALIMENTAR OS FORMULÁRIOS COM OS VALORES JÁ CADASTRADOS
                                  $("#manageNome").val(dados.usuario[0].nome);
                                  $("#manageNomeResponsavel").val(dados.usuario[0].nome_responsavel);
                                  $("#manageTelefone").val(dados.usuario[0].telefone);
                                  $("#manageEndereco").val(dados.usuario[0].endereco);
                                  $("#manageEscola").val(dados.usuario[0].escola);
                                  $("#manageEmail").val(dados.usuario[0].email);
                                  $("#manageSenha").val(dados.usuario[0].senha);      


                                  var fotoPerfil = localStorage.getItem("imagemPerfil");
                                  $("#manageContainerFotoPerfil").css("background","url('"+urlCnd+fotoPerfil+"') #f2f2f2 no-repeat");
                                  $("#manageContainerFotoPerfil").css("background-size","cover");
                                  $("#manageContainerFotoPerfil").css("background-position","center center");   


                                      

                                }else{

                                     console.log("%c ID DO USUÁRIO NÃO LOCALIZADO?","background:#ff0000;color:#fff;");
                                     mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                     
                                } 

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO OBTER OS DADOS DO USUÁRIO (carregarAccount)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX



}


// FUNÇÃO PARA REDIRECIONAR O USUÁRIO PARA O TOP DA PÁGINA
function sendToTop(){
  
    $("html").scrollTop(0);
    $("body").scrollTop(0);
    $(".caixa-conteudo").scrollTop(0);
    $(".page-content").scrollTop(0);
    $("jsv-content").scrollTop(0);

}


// FUNCAO PARA FECHAR MODAL E EXECUCAO DA AREA DE VIDEOS
function fecharNotasProfessor(){
   
   console.log("FECHANDO MODAL  NOTAS PROFESSOR");

   // FECHAR O MODAL DA AREA DOS VIDEOS
   $(".notas-professor").fadeOut('500');
   $(".area-adicionar-nova-nota").hide(0);

}


// INICIAR MODAL NOTAS DO PROFESSOR
function professorAddNota(){
  
  console.log("EXIBINDO MODAL PARA NOTAS DO PROFESSOR");

  $(".notas-professor").fadeIn();

    var idUsuario = localStorage.getItem("idUsuario");
    
    // LIMPAR A AREA DE NOTAS, PARA REMOVER POSSÍVEL NOTAS DE PÁGINAS ANTERIORES
    $("#areaLoadNotas").html("");
    // LIMPAR A AREA DE ATIVIDADES PARA REMOVER POSSÍVEL ATIVIDADES JÁ CARREGADAS ANTERIORMENTE
    $("#areaLoadAtividadesProfessorEspec").html("");

    // RECUPERAR QUAL É A PÁGINA ATIVA NO MOMENTO
    var idPaginaAtiva       = $("#aquiCarregamosImagens .item.active img").attr("imagem-ativa");
    var urlPaginaAtiva      = $("#aquiCarregamosImagens .item.active img").attr("imagem-ativa-url");
    var livroPaginaAtiva    = $("#aquiCarregamosImagens .item.active img").attr("imagem-livro");
    var unidadePaginaAtiva  = $("#aquiCarregamosImagens .item.active img").attr("imagem-unidade");
          
    console.log("%c PAGINA ATIVA (ID): "+idPaginaAtiva,"background:#ff0000;color:#fff;");
    console.log("%c PAGINA ATIVA (URL): "+urlPaginaAtiva,"background:#ff0000;color:#fff;");
    console.log("%c PAGINA ATIVA (LIVRO): "+livroPaginaAtiva,"background:#ff0000;color:#fff;");
    console.log("%c PAGINA ATIVA (UNIDADE): "+unidadePaginaAtiva,"background:#ff0000;color:#fff;");

                            // CARREGAR AS NOTAS
                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"carregar-notas.php",
                                data:{idUsuario:idUsuario,idPaginaAtiva:idPaginaAtiva,urlPaginaAtiva:urlPaginaAtiva,livroPaginaAtiva:livroPaginaAtiva,unidadePaginaAtiva:unidadePaginaAtiva}
                            
                            })
                            request.done(function (dados) {            

                                if (dados.tot_notas>0) {

                                    console.log("%c NOTAS OBTIDAS","background:#ff000;color:#fff;");
                                    console.log(dados);

                                    for(var g = 0;g<dados.tot_notas;g++){

                                       $("#areaLoadNotas").append('<tr><td>'+dados.notas[g].data_nota+'</td><td>'+dados.notas[g].titulo+'</td><td style="text-align: center;"> <a href="javascript:void(0)" title="Ver nota" onclick="verNota('+dados.notas[g].id+')"> <i class="fa fa-eye"></i> ver nota </a> </td></tr>');
                                      
                                    }
                                                                                   

                                }else{

                                     console.log("%c NENHUMA NOTA SALVA NA PÁGINA ATUAL","background:#ff0000;color:#fff;");
                                     $("#areaLoadNotas").append('<tr><td colspan="3" style="text-align:center">Nenhum nota salva nessa página</td></tr>');

                                } 

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO OBTER AS NOTAS (professorAddNota)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX 

                            // CARREGAR AS ATIVIDADES DESSE PROFESSOR
                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"carregar-atividades-professor.php",
                                data:{idUsuario:idUsuario}                  
                            
                            })
                            request.done(function (dados) {       

                                console.log("%c RETORNO DOS DADOS (ATIVIDADES DE UM ÚNICO PROFESSOR):","background:#0d7112;color:#fff;");  
                                console.log(dados);   

                               if(dados.sucesso=="200"){
                                 
                                 // IMPRIMIR AS ATIVIDADES NO HTML
                                 var estrelas = "";
                                 
                                 // PREENCHER AS ATIVIDADES QUE FORAM CADASTRADAS PELO PRÓPRIO PROFESSOR
                                 for(var a = 0;a<dados.tot_atividades;a++){
                                 
                                    $("#areaLoadAtividadesProfessorEspec").append('<tr style="cursor:pointer;" onclick="verDetalheAtividade('+dados.atividades[a].id+');"> <td style="width: 140px;" busca-titulo="'+dados.atividades[a].titulo+'">'+dados.atividades[a].titulo+'</td><td><a href="javascript:void(0);" onclick="verDetalheAtividade('+dados.atividades[a].id+');" title="clique para ver essa atividade" style="" class=""><i class="fa fa-eye"></i> ver atividade </a></a></td>/tr>');
                                 
                                 }  

                                 // PREENCHER AS ATIVIDADES QUE O PROFESSOR DETERMINOU COMO FAVORITAS
                                 for(var b = 0;b<dados.tot_vetor_fav;b++){

                                     $("#areaLoadAtividadesProfessorEspec").append('<tr style="cursor:pointer;" onclick="verDetalheAtividade('+dados.atividades_fav[b].id_atividade+');"> <td style="width: 140px;" busca-titulo="'+dados.atividades_fav[b].nome_atividade+'">'+dados.atividades_fav[b].nome_atividade+' <i class="fa fa-heart" style="color:#ccc;"></i></td><td><a href="javascript:void(0);" onclick="verDetalheAtividade('+dados.atividades_fav[b].id_atividade+');" title="clique para ver essa atividade" style="" class=""><i class="fa fa-eye"></i> ver atividade </a></a></td>/tr>');

                                 }

                               }else{

                                    // NENHUMA ATIVIDADE CADASTRADA AINDA
                                    $("#areaLoadAtividadesProfessorEspec").html('<tr><td colspan="2" style="text-align:center;">Nenhuma atividade cadastrada ainda :(</td></tr>');
                               
                               }                  

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO BAIXAR TODAS AS ATIVIDADES (professorAddNota)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

                            });
                            // FINAL CHAMADA AJAX

  console.log("MODAL PARA NOTAS DO PROFESSOR ATIVADA COM SUCESSO");

}


// FUNÇÃO PARA VER UMA NOTA
function verNota(idNota){

  console.log("%c INICIANDO FUNÇÃO PARA ABERTURA DA NOTA ID: "+idNota,"background:#ff0000;color:#fff;");

  localStorage.setItem("ultimaNota",idNota);

  // FAZER DIV DA NOTA APARECER
  $(".area-ver-nota").fadeIn();

                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"ver-nota.php",
                                data:{idNota:idNota}
                            
                            })
                            request.done(function (dados) {            

                                    console.log("%c DADOS DA NOTA OBTIDA","background:#ff000;color:#fff;");
                                    console.log(dados);        

                                    // ALIMENTAR O HTML
                                    $("#tituloNotaView").html(dados.nota[0].titulo);
                                    $("#textoNotaView").html(dados.nota[0].texto);                      

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO OBTER AS NOTAS (verNota)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX 

}


// FUNÇÃO PARA APAGAR UMA NOTA
function apagarNota(){
   
   var idNotaApagar = localStorage.getItem("ultimaNota");

   console.log("INICIANDO FUNÇÃO PARA APAGAR A NOTA: "+idNotaApagar);
   
                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"apagar-nota.php",
                                data:{idNotaApagar:idNotaApagar}
                            
                            })
                            request.done(function (dados) {            
                                    
                                    $(".area-ver-nota").fadeOut("500");   
                                    $(".notas-professor").fadeOut("500");
                                    mensagem("Nota apagada com sucesso!");

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO APAGAR UMA NOTA (apagarNota)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX 


                            
   console.log("FUNÇÃO PARA APAGAR NOTA FINALIZADA COM SUCESSO");

}


// MOSTRAR MODAL PARA ADICIONAR UMA NOVA NOTA
function adicionarUmaNotaNotaModal(){

  $(".area-adicionar-nova-nota").fadeIn();

}

// SALVAR A NOTA EM SI
function salvarNotaFinal(){
    
    var idUsuario = localStorage.getItem("idUsuario");

    // RECUPERAR QUAL É A PÁGINA ATIVA NO MOMENTO
    var idPaginaAtiva       = $("#aquiCarregamosImagens .item.active img").attr("imagem-ativa");
    var urlPaginaAtiva      = $("#aquiCarregamosImagens .item.active img").attr("imagem-ativa-url");
    var livroPaginaAtiva    = $("#aquiCarregamosImagens .item.active img").attr("imagem-livro");
    var unidadePaginaAtiva  = $("#aquiCarregamosImagens .item.active img").attr("imagem-unidade");
          
    console.log("%c PAGINA ATIVA (ID): "+idPaginaAtiva,"background:#ff0000;color:#fff;");
    console.log("%c PAGINA ATIVA (URL): "+urlPaginaAtiva,"background:#ff0000;color:#fff;");
    console.log("%c PAGINA ATIVA (LIVRO): "+livroPaginaAtiva,"background:#ff0000;color:#fff;");
    console.log("%c PAGINA ATIVA (UNIDADE): "+unidadePaginaAtiva,"background:#ff0000;color:#fff;");

    var tituloNotaAdd = $("#tituloNotaAdd").val();
    var textoNotaAdd  = $("#textoNotaAdd").val();

    console.log("%c TITULO DA NOTA: "+tituloNotaAdd,"background:#ff0000;color:#fff;");
    console.log("%c TEXTO DA NOTA: "+textoNotaAdd,"background:#ff0000;color:#fff;");
   
                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"salvar-nota.php",
                                data:{tituloNotaAdd:tituloNotaAdd,textoNotaAdd:textoNotaAdd,idUsuario:idUsuario,idPaginaAtiva:idPaginaAtiva,urlPaginaAtiva:urlPaginaAtiva,livroPaginaAtiva:livroPaginaAtiva,unidadePaginaAtiva:unidadePaginaAtiva}
                            
                            })
                            request.done(function (dados) {            

                                if (dados["sucesso"]=="200") {

                                    console.log("%c NOTA SALVA COM SUCESSO","background:#ff000;color:#fff;");
                                    $(".area-adicionar-nova-nota").fadeOut();
                                    $(".notas-professor").fadeOut('500');
                                    mensagem("Nota salva com sucesso");      
                                    
                                    // LIMPAR OS CAMPOS
                                    $("#tituloNotaAdd").val("");
                                    $("#textoNotaAdd").val("");                                                  

                                }else{

                                     console.log("%c NÃO CONSEGUIMOS SALVAR A NOTA","background:#ff0000;color:#fff;");
                                     mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");

                                } 

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO SALVAR FAVORITO (salvarNotaFinal)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX   

}


// FUNÇÃO PARA FAVORITAR UMA PÁGINA DO PROFESSOR
function professorFavoritar(){

  var idUsuario = localStorage.getItem("idUsuario");
  
  // RECUPERAR QUAL É A PÁGINA ATIVA NO MOMENTO
  var idPaginaAtiva       = $("#aquiCarregamosImagens .item.active img").attr("imagem-ativa");
  var urlPaginaAtiva      = $("#aquiCarregamosImagens .item.active img").attr("imagem-ativa-url");
  var livroPaginaAtiva    = $("#aquiCarregamosImagens .item.active img").attr("imagem-livro");
  var unidadePaginaAtiva  = $("#aquiCarregamosImagens .item.active img").attr("imagem-unidade");
        
  console.log("%c PAGINA ATIVA (ID): "+idPaginaAtiva,"background:#ff0000;color:#fff;");
  console.log("%c PAGINA ATIVA (URL): "+urlPaginaAtiva,"background:#ff0000;color:#fff;");
  console.log("%c PAGINA ATIVA (LIVRO): "+livroPaginaAtiva,"background:#ff0000;color:#fff;");
  console.log("%c PAGINA ATIVA (UNIDADE): "+unidadePaginaAtiva,"background:#ff0000;color:#fff;");

                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"favoritar-atividade.php",
                                data:{idUsuario:idUsuario,idPaginaAtiva:idPaginaAtiva,urlPaginaAtiva:urlPaginaAtiva,livroPaginaAtiva:livroPaginaAtiva,unidadePaginaAtiva:unidadePaginaAtiva}
                            
                            })
                            request.done(function (dados) {            

                                if (dados["sucesso"]=="200") {

                                  console.log("%c PÁGINA DA AULA FAVORITA COM SUCESSO","background:#ff000;color:#fff;");
                                  //mensagem("Página do livro favoritada com sucesso! Você pode ver todos os seus favoritos no menu 'Bookmarks'");                                                           
                                   
                                  // MUDAR A IMAGEM DO ÍCONE DE FAVORITAR
                                  $("#imgFavoritarPagina").attr("src","images/professor-favoritar-favoritado.png");
                                  $("#imgFavoritarPagina2").attr("src","images/professor-favoritar-favoritado.png");

                                }else{

                                     console.log("%c NÃO CONSEGUIMOS SALVAR O FAVORITO","background:#ff0000;color:#fff;");
                                     mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");

                                } 

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO SALVAR FAVORITO (professorFavoritar)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX  

}


// FUNÇÃO PARA ENVIAR ATIVIDADE DA COMUNIDADE
var controleAppendLinks = 0;
function enviarAtividadeComunidade(){

  $("#btnEnviarAtividadeComunidade").html("AGUARDE");

   console.log("%c INICIANDO FUNÇÃO PARA ENVIO DE ATIVIDADE PARA A COMUNIDADE","background:#ff0000;color:#fff;");

   var idUsuario = localStorage.getItem("idUsuario");

   // RECUPERAR DADOS DO HTML 
   var enviarName          = $("#enviarName").val();
   var enviarCategoria     = $("#enviarCategoria").val();
   var enviarLevel         = $("#enviarLevel").val();  
   var enviarUnit          = $("#enviarUnit").val();
   var enviarTopic         = $("#enviarTopic").val();
   var enviarDescricao     = $("#enviarDescricao").val();
   var enviarLinks         = $("#enviarLinks").val();
  

   // ############## PROCESSAR OS LINKS ############## //
   var totalLinks = $('.enviarLinks').length;

   for(var i = 0;i<totalLinks;i++){
         
         if($("#enviarLinks"+i).val()!=undefined){
           
            console.log("%c LINK: "+i+") "+$("#enviarLinks"+i).val(),"background:#ff0000;color:#fff");
            enviarLinks = enviarLinks+"###"+$("#enviarLinks"+i).val();
         
         }

   }

   console.log("%c LINK QUE SERÁ ENVIADO PARA O AJAX: "+enviarLinks,"background:#fff000;color:#000;");
   // ############## PROCESSAR OS LINKS ############## //

   if(enviarName!="" && enviarCategoria!="" && enviarLevel!="" && enviarUnit!="" && enviarTopic!="" && enviarDescricao!=""){

                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"enviar-atividade.php",
                                data:{idUsuario:idUsuario,
                                     enviarName:enviarName,
                                enviarCategoria:enviarCategoria,
                                    enviarLevel:enviarLevel,
                                     enviarUnit:enviarUnit,
                                    enviarTopic:enviarTopic,
                                enviarDescricao:enviarDescricao,
                                    enviarLinks:enviarLinks}
                            
                            })
                            request.done(function (dados) {            

                                  console.log("%c ATIVIDADE ENVIADA COM SUCESSO!","background:#649B4C;color:#fff;");
                                  console.log(dados);                

                                  // DIRECIONAR PARA O DETALHE DA ATIVIDADE
                                  ativarJsView('1520'); 
                                  //$JSView.goToView('viewDetalheAtividade');   

                                  // SETAR O ID DA ATIVIDADE ATUAL
                                  localStorage.setItem("atividadeAtiva",dados.atividade[0].id);
                                  localStorage.setItem("favoritarAtividade", dados.atividade[0].id);

                                  // ALIMENTAR DADOS DO HTML
                                  $("#atividadeFotoPerfil").css("background","url('"+urlCnd+dados.foto_perfil+"') #f2f2f2 no-repeat");
                                  $("#atividadeFotoPerfil").css("background-size","cover");
                                  $("#atividadeFotoPerfil").css("background-position","center center");

                                  $("#atividadeNomePerfil").html(dados.atividade[0].teatcher_name);
                                  $("#tituloDaAtividade").html(dados.atividade[0].titulo);
                                  $("#textoDaAtividade").html(dados.atividade[0].descricao);

                                  // POSSIBILIDADE DO PROFESSOR EDITAR OU APAGAR A SUA PRÓPRIA ATIVIDADE
                                  //$("#actionsInnerAtividade").html('<a href="javascript:void(0)" title="Editar essa atividade" onclick="editarAtividadeProfessor();"> <i class="fa fa-pencil fa-2x"></i> </a> &nbsp;&nbsp;&nbsp; <a href="javascript:void(0)" title="Apagar essa atividade" onclick="ApagarAtividadeProfessor();"> <i class="fa fa-trash fa-2x"></i> </a>');                                       

                                  if(dados.atividade[0].acessos!=null && dados.atividade[0].acessos != "1"){
                                     $("#numeroDeViews").html(dados.atividade[0].acessos+" visualizações");
                                  }else{
                                     $("#numeroDeViews").html("1 visualização");
                                  }

                                  if(dados.atividade[0].rating=="0"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="1"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="2"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="3"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="4"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star" aria-hidden="true"></i>');
                                  }
                                  
                                  /*
                                  if(dados.atividade[0].rating=="5"){
                                    $(".rating-atividade").html('');
                                  }
                                  */

                                  // ALIMENTAR OS LINKS
                                  for(var g = 0;g<dados.tot_links;g++){
                                    $("#listaDeLinks").append('<a href="'+dados.links[g].url+'" target="_blank" title="Clique para acessar">'+dados.links[g].url+'</a> <br clear="both">')
                                  }

                                  // ALIMENTAR OS ARQUIVOS
                                  for(var h = 0;h<dados.tot_arquivos;h++){
                                    $(".area-arquivos-carregados").append(' <div class="arquivo"> <p> <a href="'+urlCnd+dados.arquivos[h].url+'" target="_blank" title="Clique para fazer o download"> <img src="images/arquivo.png" alt="Clique para fazer o download"> </a> </p><p> <a href="'+urlCnd+dados.arquivos[h].url+'" target="_blank" title="Clique para fazer o download"> '+dados.arquivos[h].titulo+' </a> </p></div>');
                                  }                                   

                                  // ALIMENTAR O RATING DA ATIVIDADE
                                  if(dados.atividade[0].rating=="0"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="1"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="2"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="3"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="4"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star" aria-hidden="true"></i>');
                                  }       

                                  // SE A ATIVIDADE FOR CADASTRADA COM SUCESSO, VAMOS DIRECIONAR O USUÁRIO
                                  //  DE VOLTA PARA A TELA GERAL com TODAS ATIVIDADES
                                  //mensagem("Atividade cadastrada com sucesso");
                                  //loadComunidade();
                                  
                                  resetWindow("viewComunidade");

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO ENVIAR ATIVIDADE (enviarAtividadeComunidade)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 $("#btnEnviarAtividadeComunidade").html("SUBMIT");
                                 
                            });
                            // FINAL CHAMADA AJAX


   }else{
     
      mensagem("todos os campos são necessários");
      $("#btnEnviarAtividadeComunidade").html("SUBMIT");

   }


}

// FUNÇÃO PARA DAR UM APPEND NOS LINKS, NA HORA DE ADICIONAR UMA ATIVIDADE
function appendLinks(){
   
   console.log("%c INICIANDO FUNÇÃO PARA DARMOS UM APPEND NOS LINKS NA HORA DE ENVIAR UMA ATIVIDADE:","background:#CB5688;color:#fff");
   
   var html = '<div class="form-group" id="seletorLinks'+controleAppendLinks+'"> <input type="text" name="links[]" class="form-control enviarLinks" placeholder="Não esqueça de colocar o http:// ou https://" id="enviarLinks'+controleAppendLinks+'"> <a href="javascript:void(0)" onclick="removeAppendLinks('+controleAppendLinks+');" title="remover link" style="font-size:11px;color:#ff0000;margin-top: -29px;">remover</a></div>';

   $(".appendLinks").append(html);

   controleAppendLinks = controleAppendLinks + 1; // AUMENTAR O NUMERO DO CONTADOR

   console.log("%c APPEND FEITO COM SUCESSO:","background:#CB5688;color:#fff");

}

// FUNÇÃO PARA REMOVER UM DOS LINKS DO APPEND
function removeAppendLinks(idAppend){
     
     console.log("%c REMOVENDO UM DOS APPENDS: "+idAppend,"background:#CB5688;color:#fff");

     $("#seletorLinks"+idAppend).fadeOut("500");
     $("#seletorLinks"+idAppend).remove();
     
     console.log("%c APPEND REMOVIDO: "+idAppend,"background:#CB5688;color:#fff");

}



// FUNÇÃO PARA ABRIR O MODAL DE UPLOAD DE ARQUIVOS DA COMUNIDADE
function ativarUploadFiles(){
  
  var idUsuario = localStorage.getItem("idUsuario");

  $(".area-iframe-upload").fadeIn("500");

  var urlDoIframe = "https://www.baltimoreeducation.com.br/api/iframe-upload-comunidade.php";

  urlDoIframe = urlDoIframe+"?idUsuario="+idUsuario;

  console.log("%c URL CRIADA PARA O IFRAME DO UPLOAD: "+urlDoIframe,"background:#fff000;color:#000;");

  $("#iframeUpload").attr("src",urlDoIframe);

}


// VERIFICAR SE O PROFESSOR TEM ARQUIVOS JÁ CARREGADOS ESPERANDO O ENVIO DE UMA ATIVIDADE PARA SALVA-LOS
function verificarArquivosUpload(){

  console.log("%c INICIANDO FUNÇÃO PARA RECUPERAR ARQUIVOS PENDENTES DO PROFESSOR","background:#ff0000;color:#fff;");
  //$("#appendFilesTemporarios").html("<p>carregando...</p>");

  var idUsuario = localStorage.getItem("idUsuario");

                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"arquivos-pendentes.php",
                                data:{idUsuario:idUsuario}
                            
                            })
                            request.done(function (dados) {            

                                if (dados["sucesso"]=="200") {

                                  console.log("%c DADOS RETORNADOS:","background:#ff000;color:#fff;");
                                  console.log(dados);         

                                  // IMPRIMINDO NO HTML OS ARQUIVOS
                                  console.log("IMPRIMINDO NO HTML OS ARQUIVOS");
                                  //$("#appendFilesTemporarios").html("");

                                  for(var t =0;t<dados.arquivos.length;t++){

                                    console.log("TESTE APPEND: "+t);
                                    $("#appendFilesTemporarios").append('<p id="arquivoTemporario'+dados.arquivos[t].id+'"><a href="'+urlCnd+dados.arquivos[t].url+'" title="Clique para ver o arquivo" target="_blank"><img src="images/arquivo.png" alt="Arquivo" style="width: 18px;margin-right: 4px;"> '+dados.arquivos[t].titulo+'</a> <a href="javascript:void(0)" onclick="apagarArquivoTemporario('+dados.arquivos[t].id+')" style="color:#ff0000"><i class="fa fa-trash-o" aria-hidden="true"></i> remover</a>');

                                  }                                                             

                                }else{

                                     console.log("%c NENHUM ARQUIVO PENDENTE PARA UPLOAD","background:#ff0000;color:#fff;");
                                                                          
                                } 

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO OBTER OS ARQUIVOS PENDENTES (verificarArquivosUpload)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX

}

// FUNÇÃO PARA APAGAR UM ARQUIVO TEMPORÁRIO
function apagarArquivoTemporario(idArquivoTemporario){

  console.log("%c INICIANDO FUNÇÃO PARA REMOVER ARQUIVO TEMPORÁRIO","background:#fff000;color:#000;");
  console.log("%c ID DO ARQUIVO TEMPORÁRIO: "+idArquivoTemporario,"background:#fff000;color:#000;");
  

                            // APAGAR ARQUIVO TEMPORÁRIO
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"apagar-arquivo-pendentes.php",
                                data:{idArquivoTemporario:idArquivoTemporario}
                            
                            })
                            request.done(function (dados) {            

                                if (dados["sucesso"]=="200") {

                                  console.log("%c ARQUIVO APAGADO COM SUCESSO:","background:#ff000;color:#fff;");
                                  
                                  // VAMOS APAGAR A LINHA DO ARQUIVO REMOVIDO DO HTML
                                  $("#arquivoTemporario"+idArquivoTemporario).fadeOut("50");
                                  //$("#arquivoTemporario"+idArquivoTemporario).destroy();                                                                                          

                                }else{

                                     console.log("%c NÃO CONSEGUIMOS APAGAR O ARQUIVO","background:#ff0000;color:#fff;");
                                                                          
                                } 

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO APAGAR UM DOS ARQUIVOS PENDENTES (apagarArquivoTemporario)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // APAGAR ARQUIVO TEMPORÁRIO
}


// FAVORITAR A ATIVIDADE INTERNAMENTE
function favortitarAtividadeInterna(){
  
  var idUsuario = localStorage.getItem("idUsuario");

  console.log("%c INICIANDO FUNÇÃO PARA FAVORITAR UMA ATIVIDADE (INTERNAMENTE)","background:#ff0000;color:#fff;");

  // MUDAR O ICONE DO <i>
  $(".favoritar-atividade i").removeClass("fa-heart-o");
  $(".favoritar-atividade i").addClass("fa-heart");

  // CÓDIGO DO AJAX PARA SALVAR O FAVORITO

}

// DESFAVORITAR UMA ATIVIDADE INTERNAMENTE
function desfavoritarAtividadeInterna(seletor){

  console.log("%c INICIANDO FUNÇÃO PARA DESFAVORITAR UMA ATIVIDADE (INTERNAMENTE)","background:#ff0000;color:#fff;");

  if($(seletor).hasClass("fa-heart")){
     $(".favoritar-atividade i").removeClass("fa-heart");
     $(".favoritar-atividade i").addClass("fa-heart-o");   
      
     var idAtividade = localStorage.getItem("favoritarAtividade");
     favoritarAtividade(idAtividade,"atividade-favoritada");
  }

}


// FUNÇÃO PARA REPORTAR ABUSO SOBRE ALGUMA ATIVIDADE
function reportAbuse(){
   
   var idUsuario      = localStorage.getItem("idUsuario");
   var atividadeAtiva = localStorage.getItem("atividadeAtiva");
   
   console.log("INICIANDO FUNÇÃO PARA REPORT DE ABUSO EM ATIVIDADE CADASTRADA"); 

   // DIRECIOANR PARA A VIEW
   $JSView.goToView('viewReportAbuse');

}


// FUNÇÃO PARA PROCESSAR REPORT ABUSE
function sendReportAbuse(){

    $("#btnReportAbuse").html("PROCESSANDO...");
  
    console.log("INICIANDO FUNÇÃO PARA ATUALIZAR DADOS 'REPORT ABUSE'");
  
    var idUsuario = localStorage.getItem("idUsuario"); 

    // RECUPERAR DADOS DO FORMULÁRIO GET HELP
    var reportName           = $("#reportName").val();
    var reportEmail          = $("#reportEmail").val();
    var reportAssunto        = $("#reportAssunto").val();
    var reportDescricao      = $("#reportDescricao").val();


    if(reportName!="" && reportEmail!="" && reportAssunto!="" && reportDescricao!=""){

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"report-abuse.php",
                  data:{idUsuario:idUsuario,reportName:reportName,reportEmail:reportEmail,reportAssunto:reportAssunto,reportDescricao:reportDescricao}
              
              })
              request.done(function (dados) {            

                  if (dados["sucesso"]=="200") {                     
                        
                        $("#btnReportAbuse").html("Send");
                        mensagem("Mensagem enviada com sucesso! Em breve retornaremos o seu contato.");
 
                  }else{

                       console.log("PROBLEMAS NO ENVIO DA MENSAGEM (sendReportAbuse)");
                       console.log(dados);

                       // LIMPANDO OS CAMPOS DE LOGIN E SENHA
                       mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");

                  } 

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS NO ENVIO DA MENSAGEM (sendReportAbuse)");
                   mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");                   

              });
              // FINAL CHAMADA AJAX


    }else{
      
      mensagem("Todos os campos são necessários");

    }
    
    console.log("FUNÇÃO PARA ATUALIZAR DADOS 'REPORT ABUSE' FINALIZADA COM SUCESSO'");

}



// FUNÇÃO PARA VOLTAR PARA A ÚLTIMA ATIVIDADE ATIVA
function voltarAtividade(){

  var ultimaAtividadeAtiva = localStorage.getItem("atividadeAtiva");
  verDetalheAtividade(ultimaAtividadeAtiva); 

}

// CARREGAR DETALHES DE UMA ATIVIDADE
function verDetalheAtividade(idAtividade){

  console.log("%c CARREGANDO DADOS DO DETALHE DA ATIVIDADE","background:#ff0000;color:#fff");
  console.log("%c ID DA ATIVIDADE SENDO CARREGADA: "+idAtividade);

  $(".notas-professor").fadeOut("500");

                             // DIRECIONAR PARA A VIEW DO DETALHE DA ATIVIDADE
                             ativarJsView('1520'); 
                             $JSView.goToView('viewDetalheAtividade');
                             var idUsuario = localStorage.getItem("idUsuario");

                             localStorage.setItem("favoritarAtividade", idAtividade);


                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"ver-atividade.php",
                                data:{idAtividade:idAtividade,idUsuario:idUsuario}
                            
                            })
                            request.done(function (dados) {            

                                  console.log("%c ATIVIDADE CARREGADA COM SUCESSO!","background:#649B4C;color:#fff;");
                                  console.log(dados);                

                                  // SETAR O ID DA ATIVIDADE ATUAL
                                  localStorage.setItem("atividadeAtiva",dados.atividade[0].id);
                                  
                                  // SE A ATIVIDADE FOR DE PROPRIEDADE DO USUÁRIO LOGADO (PROFESSOR) VAMOS EXIBIR OS BOTÕES DE EDIÇÃO E EXCLUSÃO
                                  if(dados.atividade[0].id_professor==idUsuario){
                                    
                                    // POSSIBILIDADE DO PROFESSOR EDITAR OU APAGAR A SUA PRÓPRIA ATIVIDADE
                                    $("#actionsInnerAtividade").html('<a href="javascript:void(0)" title="Editar essa atividade" onclick="editarAtividadeProfessor();"> <i class="fa fa-pencil fa-2x"></i> </a> &nbsp;&nbsp;&nbsp; <a href="javascript:void(0)" title="Apagar essa atividade" onclick="ApagarAtividadeProfessor();"> <i class="fa fa-trash fa-2x"></i> </a>');                                       

                                  }

                                  // ALIMENTAR DADOS DO HTML
                                  $("#atividadeFotoPerfil").css("background","url('"+urlCnd+dados.foto_perfil+"') #f2f2f2 no-repeat");
                                  $("#atividadeFotoPerfil").css("background-size","cover");
                                  $("#atividadeFotoPerfil").css("background-position","center center");

                                  $("#atividadeNomePerfil").html(dados.atividade[0].teatcher_name);
                                  $("#tituloDaAtividade").html(dados.atividade[0].titulo);
                                  $("#textoDaAtividade").html(dados.atividade[0].descricao);  

                                  
                                  // CASO A ATIVIDADE JÁ ESTEJA FAVORITA VAMOS DEIXAR ISSO CLARO MARCANDO O CORAÇÃO
                                  if(dados.tot_favoritos>0){
                                    $(".favoritar-atividade i").removeClass("fa-heart-o"); 
                                    $(".favoritar-atividade i").addClass("fa-heart");
                                  }                                     

                                  if(dados.atividade[0].acessos!=null && dados.atividade[0].acessos != "1"){
                                     $("#numeroDeViews").html(dados.atividade[0].acessos+" visualizações");
                                  }else{
                                     $("#numeroDeViews").html("1 visualização");
                                  }

                                  // ALIMENTAR OS LINKS
                                  for(var g = 0;g<dados.tot_links;g++){
                                    $("#listaDeLinks").append('<a href="'+dados.links[g].url+'" target="_blank" title="Clique para acessar">'+dados.links[g].url+'</a> <br clear="both">')
                                  }

                                  // ALIMENTAR OS ARQUIVOS
                                  for(var h = 0;h<dados.tot_arquivos;h++){
                                    $(".area-arquivos-carregados").append(' <div class="arquivo"> <p> <a href="'+urlCnd+dados.arquivos[h].url+'" target="_blank" title="Clique para fazer o download"> <img src="images/arquivo.png" alt="Clique para fazer o download"> </a> </p><p> <a href="'+urlCnd+dados.arquivos[h].url+'" title="Clique para fazer o download"> '+dados.arquivos[h].titulo+' </a> </p></div>');
                                  }                                   

                                  if(dados.atividade[0].rating=="1"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="2"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="3"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="4"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="5"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star" aria-hidden="true"></i>');
                                  }      

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO ENVIAR ATIVIDADE (verDetalheAtividade)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX
}


// FUNÇÃO DOS FILTROS DA PÁGINA DA COMUNIDADE
function pesquisaOuFiltroAtividades(chaveValor,chaveFiltro){

     console.log("%c CHAVE FILTRO: "+chaveFiltro,"background:#ff0000;color:#fff;");
     console.log("%c CHAVE VALOR: "+chaveValor,"background:#ff0000;color:#fff;");


     if(chaveFiltro=="categoria"){
        localStorage.setItem("filtroCategoria",chaveValor);
        localStorage.setItem("hasFiltroCategoria","sim");
        $( "#atividadesGeraisComunidade tr[busca-categoria]" ).fadeIn(500);
        if(chaveValor!="todos"){
           $( "#atividadesGeraisComunidade tr[busca-categoria!='"+chaveValor+"']" ).fadeOut(500);
        }
     }


     if(chaveFiltro=="nivel"){
        localStorage.setItem("filtroNivel",chaveValor);
        localStorage.setItem("hasFiltroNivel","sim");
        $( "#atividadesGeraisComunidade tr[busca-nivel]" ).fadeIn(500);
        if(chaveValor!="todos"){
           $( "#atividadesGeraisComunidade tr[busca-nivel!='"+chaveValor+"']" ).fadeOut(500);
        }
     }


     if(chaveFiltro=="unidade"){
        localStorage.setItem("filtroUnidade",chaveValor);
        localStorage.setItem("hasFiltroUnidade","sim");
        $( "#atividadesGeraisComunidade tr[busca-unidade]" ).fadeIn(500);
        if(chaveValor!="todos"){
           $( "#atividadesGeraisComunidade tr[busca-unidade!='"+chaveValor+"']" ).fadeOut(500);
        }
     }


     if(chaveFiltro=="topico"){
        localStorage.setItem("filtroTopico",chaveValor);
        localStorage.setItem("hasFiltroTopico","sim");
        $( "#atividadesGeraisComunidade tr[busca-topico]" ).fadeIn(500);
        if(chaveValor!="todos"){
           $( "#atividadesGeraisComunidade tr[busca-topico!='"+chaveValor+"']" ).fadeOut(500);
        }
     }


     if(chaveFiltro=="teacher"){
        localStorage.setItem("filtroTeacher",chaveValor);
        localStorage.setItem("hasFiltroTeacher","sim");
        $( "#atividadesGeraisComunidade tr[busca-professor]" ).fadeIn(500);
        if(chaveValor!="todos"){
           $( "#atividadesGeraisComunidade tr[busca-professor!='"+chaveValor+"']" ).fadeOut(500);
        }
     }
    
    // VERIFICAR SE EXISTEM FILTROS PERSISTENTES JÁ SELECIONADOS
    analisarFiltrosPersistencia();

}


// VERIFICAR SE EXISTEM FILTROS PERSISTENTES JÁ SELECIONADOS
function analisarFiltrosPersistencia(){

   var filtroCategoria = localStorage.getItem("filtroCategoria");
   var hasFiltroCategoria = localStorage.getItem("hasFiltroCategoria");   
   if(hasFiltroCategoria=="sim"&&filtroCategoria!="todos"){
      $( "#atividadesGeraisComunidade tr[busca-categoria!='"+filtroCategoria+"']" ).fadeOut(500);
   }


   var filtroNivel     = localStorage.getItem("filtroNivel");
   var hasFiltroNivel     = localStorage.getItem("hasFiltroNivel");
   if(hasFiltroNivel=="sim"&&filtroNivel!="todos"){
      $( "#atividadesGeraisComunidade tr[busca-nivel!='"+filtroNivel+"']" ).fadeOut(500);
   }
   

   var filtroUnidade   = localStorage.getItem("filtroUnidade"); 
   var hasFiltroUnidade   = localStorage.getItem("hasFiltroUnidade"); 
   if(hasFiltroUnidade=="sim"&&filtroUnidade!="todos"){
      $( "#atividadesGeraisComunidade tr[busca-unidade!='"+filtroUnidade+"']" ).fadeOut(500);
   }
   

   var filtroTopico    = localStorage.getItem("filtroTopico");
   var hasFiltroTopico    = localStorage.getItem("hasFiltroTopico");
   if(hasFiltroTopico=="sim"&&filtroTopico!="todos"){
      $( "#atividadesGeraisComunidade tr[busca-topico!='"+filtroTopico+"']" ).fadeOut(500);
   }
   

   var filtroTeacher   = localStorage.getItem("filtroTeacher");
   var hasFiltroTeacher   = localStorage.getItem("hasFiltroTeacher");
   if(hasFiltroTeacher=="sim"&&filtroTeacher!="todos"){
      $( "#atividadesGeraisComunidade tr[busca-professor!='"+filtroTeacher+"']" ).fadeOut(500);
   }

}

// FILTRO DA BUSCA POR PALAVRA
function filtroTabela() {
     // Declare variables
     var input, filter, ul, li, a, i;
     input = document.getElementById('comunidadePesquisa');
     filter = input.value.toUpperCase();
     ul = document.getElementById("atividadesGeraisComunidade");

     li = ul.getElementsByTagName('tr');

     // Loop through all list items, and hide those who don't match the search query
     for (i = 0; i < li.length; i++) {
         a = li[i];
         if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
             li[i].style.display = "";
         } else {
             li[i].style.display = "none";
         }
     }
}


// AUMENTAR PONTOS PARA GAMEFICAÇÃO
function gameficacao(){

  var idUsuario = localStorage.getItem("idUsuario");
  
              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: urlApi+"gameficacao.php",
                  data:{idUsuario:idUsuario}
              
              })
              request.done(function (dados) {            

                // ALIMENTAR DADOS GAMEFICAÇÃO
                 console.log("%c ALIMENTANDO DADOS GAMEFICAÇÃO:","background:#AD1457;color:#fff;font-size:20px;");
                 $(".progress-bar").html("<small>"+dados.pontos+" pontos</small>");

                 var nivel = 0;

                 if(dados.pontos>0){
                 
                    nivel = dados.pontos / 10;
                    nivel = parseInt(nivel);
                 
                    $("#nivelAtualUsuario").html(nivel);
                    $("#nivelAtualUsuarioMobile").html(nivel);
                 
                 }
                 
                 mensagem("<i class=\"fa fa-trophy fa-2x diogenes-pulse\" aria-hidden=\"true\" style=\"color: #FDD835;\"></i><br>Você ganhou 1 ponto por ter vencido o desafio do game!");
                 localStorage.setItem("pontosUsuario",dados.pontos);

              });
              request.fail(function (dados) {
                     
                   console.log("PROBLEMAS AO AUMENTAR PONTOS USUÁRIO GAMEFICAÇÃO (gameficacao)");
                   
              });
              // FINAL CHAMADA AJAX

}





// EDITAR ATIVIDADE DO PROFESSOR
function editarAtividadeProfessor(){
  
  var idAtividadeProfessor = localStorage.getItem("atividadeAtiva");
  var idUsuario = localStorage.getItem("idUsuario");

  console.log("%c ATIVIDADE SENDO CARREGADA PARA EDIÇÃO: "+idAtividadeProfessor,"background:#ff0000;color:#fff;font-size:20px;");
  
  var idAtividade = idAtividadeProfessor;

  console.log("%c ID DA ATIVIDADE SENDO CARREGADA: "+idAtividade);

                            //$(".notas-professor").fadeOut("500");

                             // DIRECIONAR PARA A VIEW DO DETALHE DA ATIVIDADE
                             ativarJsView('1520'); 
                             $JSView.goToView('viewEditarDetalheAtividade');
                             
                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"ver-atividade.php",
                                data:{idAtividade:idAtividade,idUsuario:idUsuario}
                            
                            })
                            request.done(function (dados) {            

                                  console.log("%c ATIVIDADE CARREGADA COM SUCESSO!","background:#649B4C;color:#fff;");
                                  console.log(dados);                                                  

                                  // ALIMENTAR DADOS DO HTML
                                  $("#enviarName").val(dados.atividade[0].titulo);
                                  $("#enviarCategoria").val(dados.atividade[0].category);
                                  $("#enviarLevel").val(dados.atividade[0].level);
                                  $("#enviarUnit").val(dados.atividade[0].unidade);
                                  $("#enviarTopic").val(dados.atividade[0].topic);

                                  $("#enviarDescricao").val(dados.atividade[0].descricao);
                                  $("#enviarDescricao").html(dados.atividade[0].descricao);    

                                  console.log("%c TESTE VALOR! "+dados.atividade[0].titulo,"background:#649B4C;color:#fff;");                                                            
                                  

                                  // ALIMENTAR OS LINKS
                                  for(var g = 0;g<dados.tot_links;g++){
                                    //$("#listaDeLinks").append('<a href="'+dados.links[g].url+'" target="_blank" title="Clique para acessar">'+dados.links[g].url+'</a> <br clear="both">')
                                    if(dados.links[g].url!=""){
                                      $(".appendLinks").append('<div class="form-group" id="seletorLinks'+dados.links[g].id+'"> <input type="text" name="links[]" class="form-control enviarLinks" placeholder="Não esqueça de colocar o http:// ou https://" value="'+dados.links[g].url+'" id="enviarLinks'+dados.links[g].id+'"> <a href="javascript:void(0)" onclick="removeAppendLinks('+dados.links[g].id+');" title="remover link" style="font-size:11px;color:#ff0000;margin-top: -29px;">remover</a></div>');
                                    }
                                  }

                                  // ALIMENTAR OS ARQUIVOS
                                  for(var h = 0;h<dados.tot_arquivos;h++){
                                    //$(".area-arquivos-carregados").append(' <div class="arquivo"> <p> <a href="'+urlCnd+dados.arquivos[h].url+'" target="_blank" title="Clique para fazer o download"> <img src="images/arquivo.png" alt="Clique para fazer o download"> </a> </p><p> <a href="'+urlCnd+dados.arquivos[h].url+'" title="Clique para fazer o download"> '+dados.arquivos[h].titulo+' </a> </p></div>');
                                    
                                    $("#appendFilesTemporarios").append('<p id="arquivoTemporario'+dados.arquivos[h].id+'"><a href="'+urlCnd+dados.arquivos[h].url+'" title="Clique para ver o arquivo" target="_blank"><img src="images/arquivo.png" alt="Arquivo" style="width: 18px;margin-right: 4px;"> '+dados.arquivos[h].titulo+'</a> <a href="javascript:void(0)" onclick="apagarArquivoTemporario('+dados.arquivos[h].id+')" style="color:#ff0000"><i class="fa fa-trash-o" aria-hidden="true"></i> remover</a>');

                                  }                                   
                                  

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO ENVIAR ATIVIDADE (editarAtividadeProfessor)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX
    
    console.log("%c ATIVIDADE CARREGADA PARA EDIÇÃO COM SUCESSO: "+idAtividadeProfessor,"background:#ff0000;color:#fff;font-size:20px;");

}


// REMOVER ATIVIDADE DO PROFESSOR
function ApagarAtividadeProfessor(){

  var idAtividadeProfessor = localStorage.getItem("atividadeAtiva");
  var idUsuario = localStorage.getItem("idUsuario");

  $JSView.goToView('viewConfirmarApagarAtividade');

}


// VOLTAR PARA O DETALHE DA ATIVIDADE
function voltarDetalheAtividade(){
   
   console.log("USUÁRIO DESISTIU DE EDITAR A ATIVIDADE, VAMOS DIRECIONAR PARA A TELA DO DETALHE DA ATIVIDADE");
   var idAtividadeProfessor = localStorage.getItem("atividadeAtiva");
   verDetalheAtividade(idAtividadeProfessor);

}


// CONFIRMAÇÃO SE É OU NÃO PARA APAGAR A ATIVIDADE
// SE SIM VAMOS APAGAR
// SE NÃO VAMOS VOLTAR A TELA DA ATIVIDADE
function apagarAtividade(tipoFuncao){

  var idAtividadeProfessor = localStorage.getItem("atividadeAtiva");
  
  // USUÁRIO CONFIRMOU, QUER APAGAR
  if(tipoFuncao=="1"){
     
                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"apagar-atividade.php",
                                data:{idAtividadeProfessor:idAtividadeProfessor}
                            
                            })
                            request.done(function (dados) {            

                                  console.log("%c ATIVIDADE APAGADA COM SUCESSO!","background:#649B4C;color:#fff;");
                                  mensagem("Atividade apagada com sucesso");
                                  loadComunidade();                                
                                  

                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO TENTAR APAGAR A ATIVIDADE (apagarAtividade)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 
                            });
                            // FINAL CHAMADA AJAX


  }


  // USUÁRIO DESISTIU, VOLTAR PARA O DETALHE DA ATIVIDADE
  if(tipoFuncao=="2"){
    voltarDetalheAtividade(idAtividadeProfessor);
  }

}




// SAVAR ATIVIDADE APÓS A EDIÇÃO
function editarAtividadeComunidade(){

  $("#btnEnviarAtividadeComunidade").html("AGUARDE");

   console.log("%c INICIANDO FUNÇÃO PARA ENVIO DE ATIVIDADE (UPDATE) PARA A COMUNIDADE","background:#ff0000;color:#fff;");

   var idUsuario = localStorage.getItem("idUsuario");
   var atividadeAtiva = localStorage.getItem("atividadeAtiva");

   // RECUPERAR DADOS DO HTML 
   var enviarName          = $("#enviarName").val();
   var enviarCategoria     = $("#enviarCategoria").val();
   var enviarLevel         = $("#enviarLevel").val();  
   var enviarUnit          = $("#enviarUnit").val();
   var enviarTopic         = $("#enviarTopic").val();
   var enviarDescricao     = $("#enviarDescricao").val();
   var enviarLinks         = $("#enviarLinks").val();
  

   // ############## PROCESSAR OS LINKS ############## //
   var totalLinks = $('.enviarLinks').length;

   for(var i = 0;i<totalLinks;i++){
         
         if($("#enviarLinks"+i).val()!=undefined){
           
            console.log("%c LINK: "+i+") "+$("#enviarLinks"+i).val(),"background:#ff0000;color:#fff");
            enviarLinks = enviarLinks+"###"+$("#enviarLinks"+i).val();
         
         }

   }

   console.log("%c LINK QUE SERÁ ENVIADO PARA O AJAX: "+enviarLinks,"background:#fff000;color:#000;");
   // ############## PROCESSAR OS LINKS ############## //

   if(enviarName!="" && enviarCategoria!="" && enviarLevel!="" && enviarUnit!="" && enviarTopic!="" && enviarDescricao!=""){

                            // INICIO CHAMADA AJAX
                            var request = $.ajax({

                                method: "POST",
                                url: urlApi+"update-atividade.php",
                                data:{idUsuario:idUsuario,
                                     enviarName:enviarName,
                                enviarCategoria:enviarCategoria,
                                    enviarLevel:enviarLevel,
                                     enviarUnit:enviarUnit,
                                    enviarTopic:enviarTopic,
                                enviarDescricao:enviarDescricao,
                                    enviarLinks:enviarLinks,
                                 atividadeAtiva:atividadeAtiva}
                            
                            })
                            request.done(function (dados) {            

                                  console.log("%c ATIVIDADE ATUALIZADA (UPDATE) COM SUCESSO!","background:#649B4C;color:#fff;");
                                  console.log(dados);                

                                  // DIRECIONAR PARA O DETALHE DA ATIVIDADE
                                  ativarJsView('1520'); 
                                  

                                  // SETAR O ID DA ATIVIDADE ATUAL
                                  localStorage.setItem("atividadeAtiva",dados.atividade[0].id);
                                  localStorage.setItem("favoritarAtividade", dados.atividade[0].id);

                                  resetWindow("viewComunidade");

                                  // ALIMENTAR DADOS DO HTML
                                  $("#atividadeFotoPerfil").css("background","url('"+urlCnd+dados.foto_perfil+"') #f2f2f2 no-repeat");
                                  $("#atividadeFotoPerfil").css("background-size","cover");
                                  $("#atividadeFotoPerfil").css("background-position","center center");

                                  $("#atividadeNomePerfil").html(dados.atividade[0].teatcher_name);
                                  $("#tituloDaAtividade").html(dados.atividade[0].titulo);
                                  $("#textoDaAtividade").html(dados.atividade[0].descricao);

                                  // POSSIBILIDADE DO PROFESSOR EDITAR OU APAGAR A SUA PRÓPRIA ATIVIDADE
                                  $("#actionsInnerAtividade").html('<a href="javascript:void(0)" title="Editar essa atividade" onclick="editarAtividadeProfessor();"> <i class="fa fa-pencil fa-2x"></i> </a> &nbsp;&nbsp;&nbsp; <a href="javascript:void(0)" title="Apagar essa atividade" onclick="ApagarAtividadeProfessor();"> <i class="fa fa-trash fa-2x"></i> </a>');                                       

                                  if(dados.atividade[0].acessos!=null && dados.atividade[0].acessos != "1"){
                                     $("#numeroDeViews").html(dados.atividade[0].acessos+" visualizações");
                                  }else{
                                     $("#numeroDeViews").html("1 visualização");
                                  }

                                  if(dados.atividade[0].rating=="0"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="1"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="2"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="3"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="4"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star" aria-hidden="true"></i>');
                                  }
                                  
                                  /*
                                  if(dados.atividade[0].rating=="5"){
                                    $(".rating-atividade").html('');
                                  }
                                  */

                                  // ALIMENTAR OS LINKS
                                  for(var g = 0;g<dados.tot_links;g++){
                                    $("#listaDeLinks").append('<a href="'+dados.links[g].url+'" target="_blank" title="Clique para acessar">'+dados.links[g].url+'</a> <br clear="both">')
                                  }

                                  // ALIMENTAR OS ARQUIVOS
                                  for(var h = 0;h<dados.tot_arquivos;h++){
                                    $(".area-arquivos-carregados").append(' <div class="arquivo"> <p> <a href="'+urlCnd+dados.arquivos[h].url+'" target="_blank" title="Clique para fazer o download"> <img src="images/arquivo.png" alt="Clique para fazer o download"> </a> </p><p> <a href="'+urlCnd+dados.arquivos[h].url+'" target="_blank" title="Clique para fazer o download"> '+dados.arquivos[h].titulo+' </a> </p></div>');
                                  }                                   

                                  // ALIMENTAR O RATING DA ATIVIDADE
                                  if(dados.atividade[0].rating=="0"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="1"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="2"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="3"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star-o" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star-o" aria-hidden="true"></i>');
                                  }

                                  if(dados.atividade[0].rating=="4"){
                                    $(".rating-atividade").html('<i onclick="comboEstrela('+dados.atividade[0].id+',0);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',1);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',2);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',3);" class="fa fa-star" aria-hidden="true"></i> <i onclick="comboEstrela('+dados.atividade[0].id+',4);" class="fa fa-star" aria-hidden="true"></i>');
                                  }       


                            });
                            request.fail(function (dados) {
                                   
                                 console.log("PROBLEMAS AO ATUALIZAR ATIVIDADE (editarAtividadeComunidade)");
                                 mensagem("Não conseguimos comunicação com o servidor, tente novamente dentro de alguns instantes.");
                                 $("#btnEnviarAtividadeComunidade").html("SUBMIT");
                                 
                            });
                            // FINAL CHAMADA AJAX


   }else{
     
      mensagem("todos os campos são necessários");
      $("#btnEnviarAtividadeComunidade").html("UPDATE");

   }


}


// FUNÇÃO QUE FAZ UM RESET NA JANELA POR COMPLETO, DIRECIONANDO O USUÁRIO PARA A VIEW INFORMADA NA VOLTA
function resetWindow(nomeDaViewGoBack){
  
  localStorage.setItem("resetWindow","sim");
  localStorage.setItem("resetWindowView",nomeDaViewGoBack);
  
  // RELOAD DA TELA
  location.reload();

}

/**/