import PubSub from 'pubsub-js';

//Classe
export default class TratadorErros {
    publicaErros(responseErro){
        for(var i=0; i < responseErro.errors.length; i++){
            var erro = responseErro.errors[i];
            PubSub.publish('erro-validacao',  erro)
        }
    }
}