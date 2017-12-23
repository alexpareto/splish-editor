import {remote} from 'electron';

export default (mask, video, videoTime=0) => {
	let cv;
	if(remote)
	{
		cv = remote.require('opencv4nodejs');
		console.log('CV: ', cv);
	}
}