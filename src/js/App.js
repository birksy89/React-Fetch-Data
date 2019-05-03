import React from 'react';
import image from '../images/cloud-upload-download-data-transfer.svg';
import Collapsible from './Collapsible';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            contacts: []
        }
    }


    componentWillMount() {
        localStorage.getItem('contacts') && this.setState({
            contacts: JSON.parse(localStorage.getItem('contacts')),
            isLoading: false
        })
    }


    componentDidMount() {
        //const tooOld;
        const date = localStorage.getItem('contactsDate');
        const contactsDate = date && new Date(parseInt(date));
        const now = new Date();

        const dataAge = Math.round((now - contactsDate) / (1000 * 60));
        const tooOld = dataAge >= 1;

        if (tooOld) {
            //If doesn't exist - Fetch Data
            this.fetchData()
        }
        else {
            console.log(`Using Data From Local Storage - Which is ${dataAge} mins old`);
        }

    }

    fetchData() {
        this.setState({
            isLoading: true,
            contacts: []
        })

        fetch('https://randomuser.me/api/?results=10&nat=us,dk,fr,gb')
            .then(response => response.json())
            .then(parsedJSON => parsedJSON.results.map(user => (
                {
                    name: `${user.name.first} ${user.name.last}`,
                    username: `${user.login.username}`,
                    email: `${user.email}`,
                    location: `${user.location.street}, ${user.location.city}`
                }
            )))
            .then(
            contacts => this.setState({
                contacts,
                isLoading: false
            }))
            .catch(error => console.log('parsing failed', error))
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('contacts', JSON.stringify(nextState.contacts));
        localStorage.setItem('contactsDate', Date.now());
    }


    render() {
        return (
            <div>
                <header>
                    <img src={image} />
                    <h1>Fetching Data <button className="btn btn-sm btn-danger" onClick={(e) => { this.fetchData() }}>Fetch now</button></h1>
                </header>
                <div className={`content ${this.state.isLoading ? 'is-loading' : ''}`}>
                    <div className="panel-group">

                        {
                            !this.state.isLoading && this.state.contacts.length > 0 ? this.state.contacts.map(contact => {

                                return (
                                    <Collapsible key={contact.username} title={contact.name}>
                                        <p>{contact.email}<br />{contact.location}</p>
                                    </Collapsible>
                                )
                            }) : null
                        }


                    </div>

                    <div className="loader">
                        <div className="icon"></div>
                    </div>
                </div>


            </div>
        );
    }
}
export default App;
