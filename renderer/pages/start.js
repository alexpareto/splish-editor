import withReduxSaga from '../lib/withReduxSaga'
import withApollo from '../lib/withApollo';
import Cinemagraph from "../containers/cinemagraph/cinemagraph";

export default withReduxSaga(
	withApollo(Cinemagraph)
);
