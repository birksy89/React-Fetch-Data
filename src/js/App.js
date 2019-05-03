import React from 'react';
import image from '../images/cloud-upload-download-data-transfer.svg';
import Collapsible from './Collapsible';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contacts: [],
    };
  }

  componentWillMount() {
    if (localStorage.getItem('contacts')) {
      this.setState({
        contacts: JSON.parse(localStorage.getItem('contacts')),
        isLoading: false,
      });
    }
  }

  componentDidMount() {
    // const tooOld;
    const date = localStorage.getItem('contactsDate');
    const contactsDate = date && new Date(parseInt(date));
    const now = new Date();

    const dataAge = Math.round((now - contactsDate) / (1000 * 60));
    const tooOld = dataAge >= 1;

    if (tooOld) {
      // If doesn't exist - Fetch Data
      this.fetchData();
    } else {
      console.log(
        `Using Data From Local Storage - Which is ${dataAge} mins old`
      );
    }
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('contacts', JSON.stringify(nextState.contacts));
    localStorage.setItem('contactsDate', Date.now());
  }

  fetchData() {
    this.setState({
      isLoading: true,
      contacts: [],
    });

    fetch('https://randomuser.me/api/?results=10&nat=us,dk,fr,gb')
      .then(response => response.json())
      .then(parsedJSON =>
        parsedJSON.results.map(user => ({
          name: `${user.name.first} ${user.name.last}`,
          username: `${user.login.username}`,
          email: `${user.email}`,
          location: `${user.location.street}, ${user.location.city}`,
        }))
      )
      .then(contacts =>
        this.setState({
          contacts,
          isLoading: false,
        })
      )
      .catch(error => console.log('parsing failed', error));
  }

  render() {
    const { isLoading, contacts } = this.state;
    return (
      <div>
        <header>
          <img src={image} alt="" />
          <h1>
            Fetching Data{' '}
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => {
                this.fetchData();
              }}
            >
              Fetch now
            </button>
          </h1>
        </header>
        <div className={`content ${isLoading ? 'is-loading' : ''}`}>
          <div className="panel-group">
            {!isLoading && contacts.length > 0
              ? contacts.map(contact => (
                  <Collapsible key={contact.username} title={contact.name}>
                    <p>
                      {contact.email}
                      <br />
                      {contact.location}
                    </p>
                  </Collapsible>
                ))
              : null}
          </div>

          <div className="loader">
            <div className="icon" />
          </div>
        </div>
      </div>
    );
  }
}
export default App;
