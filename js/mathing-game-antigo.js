// USUÁRIO FEZ UMA SELEÇÃO
  $(".imagens-mathing").click(function(){
  
     console.log("USUÁRIO ESCOLHEU UMA OPÇÃO");

      // OBTER UM NOVO VALOR ALEATÓRIO
      //randomizar();
      
      // MANTER O FLUXO ATÉ ACHAR UMA POSIÇÃO NÃO, TEORICAMENTE AINDA HAVERA UM SIM ATÉ O USUÁRIO TERMINAR AS 4 TENTATIVAS DE JOGAR
      do{        

          if(optionsMathing[randomMathing].tocado=="nao"){
             optionsMathing[randomMathing].tocado="sim";

             randomizar();
             console.log(optionsMathing);

             break;
          
          }else{
          
            randomizar();
            console.log(optionsMathing);
          
          }

      }while(optionsMathing[randomMathing].tocado=="nao" && tentativas <4);     

      
      // INCREMENTAR O NÚMERO DE TENTATIVAS
      tentativas = tentativas + 1;
      
      // FINAL DAS TENTATIVAS
      if(tentativas>=4){
        $(".game-vitoria-game").fadeIn();
      }

  });
  

  // RAMDOMIZAR
  function randomizar(){
     randomMathing = Math.floor(Math.random() * 4) + 1;
     randomMathing = randomMathing - 1;
  }