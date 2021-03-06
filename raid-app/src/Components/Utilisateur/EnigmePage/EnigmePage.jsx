import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import ReactDOM from "react-dom";
import { bindActionCreators } from 'redux'
import { displayEnigmeAction, enigmeValidation } from '../../../Actions/displayEnigmeAction.js'
import { enigmesFetch } from '../../../Actions/Utilisateur/enigmesFetchAction'
import { AvForm, AvField } from 'availity-reactstrap-validation'
import { NavLink } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap'
import './EnigmePage.css'
import info from './info.1.png'
import './InfosModalEgnime.css'
import Header from '../Header'
import '../MapPage/MapPage.css'
import { timingSafeEqual } from 'crypto';

function validateform(respo) {
    console.log("hello", respo)
    const errors = [];
    if (respo.length === 0) {
        errors.push(" Le champ doit être remplis");
    }
    return errors;
}

export class EnigmePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compteurcontinue: 0,
            proposition: "",
            isResTrue: false,
            modal: false,
            indice: null,
            indiceNumber: 0,
            score: 5,
            visibilite: "visible",
            continuer: null,
            isContinue: false,
            markernumber: null,
            disableIndice: null,
            visibleAlert: true,
            //Les états qu'on l'on fetchera
            question: null,
            titre: null,
            enonce: null,
            reponse: null,
            indices: null,
            displayedIndices: [],
            loadedIndice: false,
            info: null,
            check: null,
            succeed: null,
            numClickValidate: 0,
            img: "./Pierrephilosophale.jpeg",
            isLoaded: false,
            agagner: null,
            baseagagner: null,
            //Affichage du score 
            scoregeneral: null,
            errors: [],
        };
        this.data = null
        this.scoreg = null
        this.enigme = this.props.match.params._id
        this.user = this.props.match.params.id
    }

    onDismiss = () => {
        this.setState({
            visibleAlert: false
        });
    }

    //Fetch et stockage des données de l'énigme en state + stockage du score du joueur //
    componentDidMount = () => {
        axios.get(`/api/enigmes/${this.enigme}`)
            .then(data => {
                this.data = data.data[0]
                this.setState({
                    id: this.data._id,
                    check: this.data.check,
                    question: this.data.question,
                    titre: this.data.titre,
                    reponse: this.data.reponse,
                    enonce: this.data.enonce,
                    indices: this.data.indices,
                    info: this.data.info,
                    img: this.data.img,
                    isFloat: true,
                    agagner: this.data.agagner,
                    baseagagner: this.data.agagner
                })
                if (this.state.indices[0]) {
                    if (!this.state.indices[0]) {
                        this.setState({
                            disableIndice: true
                        })
                    }
                }
            })
            .catch(error => {
                throw (error);
            })
        axios.get(`/api/equipe/${this.user}`)
            .then(data => {
                this.scoreg = data.data[0]
                this.setState({
                    isLoaded: true,
                })

                if (data.data[0].enigmes.length > 0) {
                    //console.log("UNO")
                    for (let i = 0; i < data.data[0].enigmes.length; i++) {
                        /* console.log("DOS", "idQuestion: ", data.data[0].enigmes[i]._idQuestion)
                        console.log("this.enigme", this.enigme) */
                        if (data.data[0].enigmes[i]._idQuestion === this.enigme) {
                            //console.log("TRES")
                            this.setState({
                                scoregeneral: this.scoreg.score,
                                succeed: data.data[0].enigmes[i].succeed,
                                check: data.data[0].enigmes[i].check,
                            })
                        }
                    }
                }
            })
            .catch(error => {
                throw (error);
            })
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    //Gestion des clics sur les indices //
    displayIndices = () => {
        //this.setState({ indiceNumber: this.state.indiceNumber + 1 })
        if (this.state.indiceNumber === 0) {
            if (this.state.indices[0]) {
                const push = this.state.displayedIndices.push(this.state.indices[0])
                this.setState({
                    indiceNumber: this.state.indiceNumber + 1,
                    loadedIndice: true,
                    agagner: Math.ceil(this.state.baseagagner / 1.3)
                })
            } else {
                this.setState({
                    disableIndice: true
                })
            }
            console.log("indice 1:", this.state.indices[0])
            console.log(this.state.agagner)
        }

        if (this.state.indiceNumber === 1) {
            if (this.state.indices[1]) {
                const push1 = this.state.displayedIndices.push(this.state.indices[1])
                this.setState({
                    indiceNumber: this.state.indiceNumber + 1,
                    agagner: Math.ceil(this.state.baseagagner / 2)
                })
            }
            else {
                this.setState({
                    disableIndice: true
                })
            }
            console.log("indice 2:", this.state.indices[1])
            console.log(this.state.indices)
            console.log(this.state.agagner)
        }

        if (this.state.indiceNumber === 2) {
            if (this.state.indices[2]) {
                const push2 = this.state.displayedIndices.push(this.state.indices[2])
                this.setState({
                    indiceNumber: this.state.indiceNumber + 1,
                    agagner: Math.ceil(this.state.baseagagner / 3)
                })
            }
            else {
                this.setState({
                    disableIndice: true
                })
            }
            console.log("indice 3:", this.state.indices[2])
            console.log(this.state.agagner)
        }

        if (this.state.indiceNumber >= 3) {
            this.setState({
                disableIndice: true
            })
        }
    };

    //Stockage de la proposition de réponse pour comparaison//
    isProposing = (e) => {
        this.setState({
            proposition: e.target.value
        });
    }

    //Gestion de la bonne ou mauvaise réponse//
    async ReponseManagement() {

        const respo = ReactDOM.findDOMNode(this._respoInput).value;
        const errors = validateform(this.state.proposition);
        if (errors.length > 0) {
            this.setState({ errors });
            return
        } else {
            this.setState({ errors: [] });
        }
       await axios.post(`/api/enigmes/${this.state.id}`, {
            proposition: this.state.proposition.toLowerCase()
        })

            .then(response => {
                //console.log(response.data.status)
                if (response.data.status === true) {
                    this.setState({
                        isContinue: true,
                        isResTrue: true,
                        visibilite: "pasvisible",
                        succeed: true,
                    })
                    this.saveResp()

                } else if (this.state.numClickValidate >= 2 && this.state.isResTrue === false) {
                    this.setState({
                        isResTrue: false,
                        succeed: false,
                        agagner: 0,
                    })
                    this.saveResp()

                } else {
                    this.setState({
                        isResTrue: false,
                    })
                }
                console.log(response);
                this.setState({
                    check: true,
                    numClickValidate: this.state.numClickValidate + 1
                })
            })
            .catch(function (error) {
                console.log(error);
            });
        await this.setState({proposition : ""})

    }




    //Enregistrement du score et de l'ID en BDD//
    saveResp = () => {
        axios.put(`/api/equipes/${this.user}`, {
            score: this.state.agagner,
            _idQuestion: this.state.id,
            check: this.state.check,
            succeed: this.state.succeed,
            gain: this.state.agagner
        })
            .then(function (response) {
                console.log("L'envoi a fonctionné", response);
            })
            .catch(function (error) {
                console.log("L'envoi n'a PAS fonctionné", error);
            });
    }

    selectColorIcon = () => {
        if (this.state.succeed === null) return "warning"
        else if (this.state.succeed === false) return "danger"
        else if (this.state.succeed) return "success"
    }

    render() {
        const { errors } = this.state;
        console.log("reponse: ", this.state.reponse)
        console.log("indices", this.state.indices)
        console.log('numValidate', this.state.numClickValidate)
        let tentatives = this.state.numClickValidate - 3
        return (
            <div className="EnigmePageContainer">
                <Header />
                {this.state.isLoaded ?
                    <div style={{ padding: '5vw' }} id='blockMap' className={this.props.isSliderOpen ? 'slideOut' : 'slideIn'}>
                        {this.state.img ? <img className="Illustration" src={`/api/image?img=${this.state.img}`} alt='' /> : null}
                        <h2 className="Titre">{this.state.titre}</h2>
                        <br />
                        <p className="enonce">{this.state.enonce}</p>

                        <AvForm onSubmit={this.isTrue}>
                            <h3 className="TitreQuestion">{this.state.question}</h3>
                            <br />
                            {this.state.succeed || this.state.succeed === false ?
                                null
                                :
                                <div style={{ textAlign: "start", marginBottom: '-2vh' }}>
                                    <p><i>Il vous reste {Math.abs(tentatives)} tentatives de réponse</i></p>
                                </div>
                            }
                            {this.state.succeed || this.state.succeed === false ?
                                <p style={{ fontSize: '3vh', color: '#ffbb34', textAlign: 'center' }}>réponse: <strong>{this.state.reponse}</strong></p>
                                :
                                <AvField name="enigme" type="text" value={this.state.proposition} onChange={this.isProposing} />
                            }{errors.map(error => (<p key={error}> * {error}</p>))}
                            <br />
                            <div className="validationContainer">

                                {(this.state.isResTrue || this.state.succeed || this.state.succeed === false) ?
                                    <NavLink to={`/MapPage/${window.localStorage.getItem("id")}`}><Button color={this.selectColorIcon(this.state.succeed)} type="button" className={this.state.visibilite}>Continuer</Button></NavLink>
                                    :
                                    <Button
                                        color={this.selectColorIcon(this.state.succeed)}
                                        onClick={() => { this.ReponseManagement() }}
                                        ref={respoInput => (this._respoInput = respoInput)}
                                        className={this.state.visibilite}>Valider</Button>}
                            </div>
                            {this.state.succeed === false || this.state.succeed ?
                                null
                                :
                                <div>
                                    {this.state.disableIndice || this.state.indices === [] ?
                                        <div>
                                            <Button disabled type="button" onClick={this.displayIndices} className="bonton2" >indices épuisés</Button><br></br>
                                        </div>
                                        :
                                        <div>
                                            <Button type="button" onClick={this.displayIndices} className="bonton2" href="#indices">Indice</Button><br></br>
                                        </div>}
                                </div>}
                            {this.state.indiceNumber === 2 && this.state.indices[2] ?
                                < Alert color="dark" isOpen={this.state.visibleAlert} toggle={this.onDismiss}>
                                    1 indice restant
                        </Alert>
                                :
                                null}
                            {this.state.succeed || this.state.succeed === false ?
                                null
                                :
                                <div>
                                    {this.state.loadedIndice ?
                                        <div>{/* {this.state.displayedIndices} */}
                                            <ul>
                                                {this.state.displayedIndices.map((item, i) => (
                                                    <li id="indices" key={item}>indice n°{i + 1}: {item}</li>
                                                ))}
                                            </ul>

                                        </div>
                                        :
                                        null}
                                </div>
                            }
                        </AvForm>
                    </div>
                    :
                    null}
            </div>

        );
    }
}

const mapStateToProps = state => ({
    enigme: state.reducerMongoEnigmes.enigme,
    display: state.reducerMongoEnigmes.display,
    check: state.reducerMongoEnigmes.check,

    isSliderOpen: state.reducerHeader.isSliderOpen,
})

const mapDispatchToProps = dispatch => {
    return {
        displayEnigmeAction: bindActionCreators(displayEnigmeAction, dispatch),
        enigmeValidation: bindActionCreators(enigmeValidation, dispatch),
        enigmesFetch: bindActionCreators(enigmesFetch, dispatch)
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(EnigmePage);