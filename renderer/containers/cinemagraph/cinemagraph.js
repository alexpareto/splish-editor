import React from "react";
import Logo from "../../components/logo/logo";

class Cinemagraph extends React.Component {

	myClick = () => {
		this.props.dispatch({type: 'CHANGE_TEST'});
	}

	render() {
		return (
			<div onClick={this.myClick}>
				<Logo size={300} />
			</div>
		);
	}
}

export default Cinemagraph;
