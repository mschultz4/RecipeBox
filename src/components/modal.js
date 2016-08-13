var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Form = require('./form.js');
var React = require('react');

var modal = React.createClass({
    getInitialState: function(){
        return {showModal: this.props.showModal};
    },
    render: function(){
        return (
            <Modal
                  show={this.props.showModal}
                  onHide={this._closeModal}
            >
                <Modal.Body>
                    <Form
                      onRecipeSubmit={this.props.onSubmit}
                      recipe={this.props.recipe}
                     />
                </Modal.Body>
            </Modal>
            );
    },
    _closeModal: function() {
        this.props.hideModal();
    }
}); 

module.exports = modal;