import withReduxSaga from '../lib/withReduxSaga'
import withApollo from '../lib/withApollo';
import MovingStill from "../containers/movingStill/movingStill";

export default withReduxSaga(
	withApollo(MovingStill)
);
