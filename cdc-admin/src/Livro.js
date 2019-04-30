import React, { Component } from 'react';
import $ from 'jquery';
import TratadorErros from './TratadorErros';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = { titulo: '', preco: '', autorId: '', listaAutores: [] };
        this.enviarForm = this.enviarForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }


    componentDidMount() {
        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success: function (data) {
                this.setState({ listaAutores: data.reverse().slice(0, 10) });
            }.bind(this)
        });
    }

    enviarForm(evento) {
        evento.preventDefault();

        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/livros',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
            success: function (data) {
                alert(data);
            }, error: function (error) {
                new TratadorErros().publicaErros(error.responseJSON);
            }, beforeSend: function () {
                PubSub.publish('limpa-erros', {});
            }
        });
    }

    setTitulo(evento) {
        this.setState({ titulo: evento.target.titulo });
    };

    setPreco(evento) {
        this.setState({ preco: evento.target.preco });
    };

    setAutorId(evento) {
        this.setState({ autorId: evento.target.autorId });
    }

    render() {
        return (
            <div className="autorForm">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">

                    <InputCustomizado id="titulo" label="Título" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} />
                    <InputCustomizado id="preco" label="Preço" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} />
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autores</label>
                        <select value={this.state.autorId} id="autorId" name="autorId" onChange={this.setAutorId}>
                            <option value="">Selecione</option>
                            {
                                this.state.listaAutores.map(function (autor) {
                                    return <option key={autor.id} value={autor.id}>
                                        {autor.nome}
                                    </option>;
                                })
                            }
                        </select>
                    </div>

                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>

                </form>
            </div>
        );
    }
}

class TabelaLivros extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.listaLivros.map(function (livro) {
                                return (
                                    <tr key={livro.id}>
                                        <td>
                                            {livro.titulo}
                                        </td>
                                        <td>
                                            {livro.preco}
                                        </td>
                                        <td>
                                            {livro.autor.nome}
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

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = { listaLivros: [] };
    }

    componentDidMount() {
        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/livros',
            dataType: 'json',
            success: function (data) {
                this.setState({ listaLivros: data.reverse().slice(0, 10) });
            }.bind(this)
        });
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro />
                    <TabelaLivros listaLivros={this.state.listaLivros} />
                </div>
            </div>
        );
    }
}
