import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import InputSubmitCustomizado from './componentes/InputSubmitCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

//FormularioAutor -> callback function(atualizaListagem)
class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();

        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/autores',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: function (data) {
                PubSub.publish('atualiza-lista-autores', data.reverse().slice(0, 10));
                this.setState({ nome: '', email: '', senha: '' });
            }.bind(this),
            error: function (err) {
                if (err.status === 400) {
                    //Não é componente, é uma classe!
                    new TratadorErros().publicaErros(err.responseJSON);
                }
            }, beforeSend: function () {
                PubSub.publish('limpa-erros', {});
            }
        });
    }

    setNome(evento) {
        this.setState({ nome: evento.target.value });
    }

    setEmail(evento) {
        this.setState({ email: evento.target.value });
    }

    setSenha(evento) {
        this.setState({ senha: evento.target.value });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">

                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" />

                    <InputSubmitCustomizado type="submit" label="Gravar" />

                </form>
            </div>
        );
    }
}

//TabelaAutores(lista)
class TabelaAutores extends Component {
    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(function (autor) {
                                return (
                                    <tr key={autor.id}>
                                        <td>
                                            {autor.nome}
                                        </td>
                                        <td>
                                            {autor.email}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

//Classe criada para juntar os dois componentes do autor.
export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
    }

    //Executa depois da tela ter sido carregada.
    componentDidMount() {
        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success: function (data) {
                this.setState({ lista: data.reverse().slice(0, 10) })
            }.bind(this)
        });

        //Escutando o canal atualiza-lista-autores 
        PubSub.subscribe('atualiza-lista-autores', function (topico, novaListagem) {
            this.setState({ lista: novaListagem })
        }.bind(this));

    }

    render() {
        return (
            <div>
                <FormularioAutor />
                <TabelaAutores lista={this.state.lista} />
            </div>
        );
    }
}

