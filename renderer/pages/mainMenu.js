import withReduxSaga from '../lib/withReduxSaga'
import withApollo from '../lib/withApollo';
import MainMenu from "../containers/mainMenu/mainMenu";

export default withReduxSaga(
	withApollo(MainMenu)
);
