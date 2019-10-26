// Imports
import React, { Component } from 'react';

// Import Search Bar Components
import { Input } from 'reactstrap';

// Import React Scrit Libraray to load Google object
import Script from 'react-load-script';

const axios = require('axios');

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            APIKey: null,
        };
    }

    componentDidMount() {
        this.getAPIKey().then(key => {
            this.setState({APIKey: key});
        })
    }

    getAPIKey = async () => {
        const response = await axios.get('https://myhealthapp-backend.herokuapp.com/api/search-key');        
        return response.data.key;
    };

    handleScriptLoad = () => {
        // Declare Options For Autocomplete
        let options = {
            // types: ['(address)'],
        };

        // Initialize Google Autocomplete
        /*global google*/ // To disable any eslint 'google not defined' errors
        this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById(this.props.id),
            options);

        // Avoid paying for data that you don't need by restricting the set of
        // place fields that are returned to just the address components, formatted
        // address and geometry.
        this.autocomplete.setFields(['formatted_address', 'geometry', 'address_components']);

        // Fire Event when a suggested name is selected
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
    }

    handlePlaceSelect = () => {
        const addressObject = this.autocomplete.getPlace();
        const address = addressObject.address_components;
        this.props.onSelect(addressObject)
        // Check if address is valid
        if (address) {
            // Set State
            this.setState(
                {
                    query: addressObject.formatted_address,
                }
            );
        }
    }

    updateQuery = (value) => {        
        this.setState({
            query: value
        })
    };

    render() {
        return this.state.APIKey && (
            <div>
                <Script
                    url={`https://maps.googleapis.com/maps/api/js?key=${this.state.APIKey}&libraries=places`}
                    onLoad={this.handleScriptLoad}
                />
                <Input type="text" id={this.props.id} name="address" placeholder="Matienzos 345" required disabled={this.props.disabled} value={this.props.value}/>
            </div>
        );
    }
}

export default Search;