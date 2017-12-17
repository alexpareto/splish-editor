import React from 'react';
import * as ss from './logoStyle';

const Logo = props => {
  return (
    <div className="hello">
    	blah blah blah
    	<style jsx>
    		{`
    			.hello {${ss.hello}};
    		`}
    	</style>
    </div>
  );
};

export default Logo;
