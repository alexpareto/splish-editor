import React from "react";
import NavBar from '../../components/navBar';
import DrawingCanvas from '../../components/drawingCanvas';
import Trimmer from '../../components/trimmer';

class Cinemagraph extends React.Component {

	myClick = () => {
		this.props.dispatch({type: 'CHANGE_TEST'});
	}

	render() {
		return (
			<div onClick={this.myClick}>
				<NavBar />
				<DrawingCanvas />
				<Trimmer />
			</div>
		);
	}
}

export default Cinemagraph;
