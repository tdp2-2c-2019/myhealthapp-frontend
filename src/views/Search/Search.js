// Imports
import React, { Component } from 'react';

// Import Search Bar Components
import { Input } from 'reactstrap';

// Import React Scrit Libraray to load Google object
import Script from 'react-load-script';

class Search extends Component {
    // Define Constructor
    constructor(props) {
        super(props);

        // Declare State
        this.state = {
            query: '',
        };
        // Bind Functions
        this.handleScriptLoad = this.handleScriptLoad.bind(this);
        this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    }

    handleScriptLoad() {
        // Declare Options For Autocomplete
        var options = {
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
        this.autocomplete.setFields(['formatted_address', 'geometry']);

        // Fire Event when a suggested name is selected
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
    }

    handlePlaceSelect() {
        const addressObject = this.autocomplete.getPlace();
        const address = addressObject.address_components;
        this.props.onSelect(addressObject.geometry)
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
        return (
            <div>
                <Script
                    url={`https://maps.googleapis.com/maps/api/js?key=AIzaSyA5NfHs-H_DMXjw95fx0upHdi2irK08Nqw&libraries=places`}
                    onLoad={this.handleScriptLoad}
                />
                <Input type="text" id={this.props.id} name="address" placeholder="Matienzos 345" required />
            </div>
        );
    }
}

export default Search;