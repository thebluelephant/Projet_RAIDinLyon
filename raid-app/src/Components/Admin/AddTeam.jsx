
import React from 'react';
import { Breadcrumb, BreadcrumbItem, Collapse, Button, CardBody, Card, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import './AddTeam.css'
import axios from 'axios'


export default class AddTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isEmpty: true,
            name: null,
            email: null,
            phone: null,
            value: true,
            data: null,
        };
    }

    toggle = () => {
        this.setState({
            collapse: !this.state.collapse
        });
    }

    handleparticipantChange = (evt) => {
        this.setState({
            name: evt.target.value
        });
    }

    /* handleLastNameChange = (evt) => {
        this.setState({
            lastName: evt.target.value
        });
    } */

    handleEmailChange = (evt) => {
        this.setState({
            email: evt.target.value
        });
    }

    handlePhoneChange = (evt) => {
        this.setState({
            phone: evt.target.value
        });
    }

    youCanAdd = () => {
        if (this.state.name !== null && this.state.lastName !== null && this.state.email !== null) {
            this.setState({
                isEmpty: false
            })
            console.log("isEMPTY")
        }
    }

    submitParticipant = () => {
        
        axios({
            method: 'post',
            url: 'http://localhost:5000/api/equipe',
            data: {
                participants: this.state.name
            }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        window.location.href = 'ListEnigmes';
    }

    /* handleChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    } */


    render() {
        return (
            <div className="containerAddTeam">
                <h1>Nom de l'équipe</h1>

                <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Ajouter un participant</Button>
                <Collapse isOpen={this.state.collapse}>
                    {/*  <Card>
                        <CardBody> */}
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">Prenom</InputGroupAddon>
                        <Input
                            type="name"
                            onChange={this.handleparticipantChange}
                            placeholder="Paul" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">Nom</InputGroupAddon>
                        <Input
                            type="name"
                            onChange={this.handleparticipantChange}
                            placeholder="Bocuse" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">Email</InputGroupAddon>
                        <Input
                            type="email"
                            onChange={this.handleEmailChange}
                            placeholder="bocuse.paul@lyon.fr" />
                    </InputGroup>

                    {(this.state.isEmpty === false) ?
                        <Button style={{ backgroundColor: 'green' }} >Ajouter</Button>
                        :
                        <Button>Ajouter</Button>
                    }
                    {/* </CardBody>
                    </Card> */}

                </Collapse>
                <div className='breadcrumbContainer'>
                    <Breadcrumb>
                        <BreadcrumbItem active>Jean-Pierre</BreadcrumbItem>
                        

                        <Button style={{ marginRight: '3vh' }} close />
                    </Breadcrumb>

                    <Breadcrumb>
                        <BreadcrumbItem active>Maryvonne</BreadcrumbItem>
                        <Button style={{ marginRight: '3vh' }} close />
                    </Breadcrumb>

                    <Breadcrumb>
                        <BreadcrumbItem active>Claire-Andrée</BreadcrumbItem>
                        <Button style={{ marginRight: '3vh' }} close />
                    </Breadcrumb>
                </div>
                {/* <Card body> */}
                <div class="enregistrerModifications">
                    <Button style={{ marginBottom: '3vh' }}>Enregistrer <br />les modifications</Button>
                </div>
                {/* </Card> */}
            </div>

        );
    }
}