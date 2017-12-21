import React from "react";
import NavBar from "../../components/navBar";
import DrawingCanvas from "../../components/drawingCanvas";
import Trimmer from "../../components/trimmer";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Cinemagraph extends React.Component {
	render() {
		console.log("RENDERING", this.props);
		return (
			<div>
				hello !
			</div>
		);
	}
}

const getUsers = gql`
	query {
		allUsers {
	  	name
	  }
	}
`;

export default graphql(getUsers)(Cinemagraph);
