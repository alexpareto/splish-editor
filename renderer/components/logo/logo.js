import React from 'react';
import * as globalStyles from '../../globalStyles';

const Logo = props => {
	const size = props.size;
	const strokeW = props.size / 50;
	const duration = 1.5;

	console.log("STROKEW", strokeW);

  return (
  	<div className="container">
	    <svg 
	    	className="svg" 
	    	width={size} 
	    	height={size}
	    	xmlns="http://www.w3.org/2000/svg"
	    	version="1.2">
	    	<circle 
	    		x={strokeW}
	    		y={strokeW}
	    		cx={size/2}
	    		cy={size/2}
		    	r={(size - strokeW*2)/2}
	    		className="boundingCircle"
	    		strokeWidth={strokeW} />
	    	<g className="droplet">
	    		<circle 
		    		x={strokeW/2}
		    		y={strokeW/2}
		    		cx={size/2}
		    		cy={size/2}
			    	r={(size - strokeW)/2}
		    		fill="none"
		    		strokeWidth={strokeW} 
	    			stroke="#fff"/>
	    		<ellipse
	    			className="bulge"
	    			cx={size/2} />
	  			<ellipse 
	  				className="mainDroplet"
	    			cx={size/2} />;
    		</g>
  			<defs>
			    <filter id="dropletFilter">
			      <feGaussianBlur in="SourceGraphic" stdDeviation={strokeW + 1} />
			      <feColorMatrix 
			      	in="blur" 
			      	mode="matrix" 
			      	values={`
			      		1 0 0 0 0
			      	  0 1 0 0 0  
			      	  0 0 1 0 0  
			      	  0 0 0 46 -8`}
		      	  result="filter" />
			    </filter>
			  </defs>
	    	
	    </svg>

	    <style jsx>
	    {`
	    	.container { 
    			background-color: ${globalStyles.background};
					width: 100vw;
					height: 100vh;
					margin-left: -8px;
					margin-top: -8px;
	    	}; 

	    	.svg { 
	    		margin-left: 10px;
					margin-top: 10px;
	    	}; 

	    	.boundingCircle { 
	    		stroke: ${globalStyles.primary};
				};

	    	.bulge {
	    		fill: ${globalStyles.background};
	    		animation-name: bulgeAnimation;
	    		animation-duration: ${duration}s;
	    		animation-iteration-count:infinite;
	    	}

	    	@keyframes bulgeAnimation {
			    10% { cy: 0; ry: ${strokeW}; rx: ${strokeW}}
			    20% { cy: 0; ry: ${strokeW * 8}; rx: ${strokeW/2}; }
			    50% { cy: 0; ry: 0; rx: 0; }
				};

	    	.mainDroplet { 
	    		fill: #FFF; 
	    		animation-name: mainDropletAnimation;
	    		animation-duration: ${duration}s;
	    		animation-iteration-count:infinite;
	    		transition-timing-function: easeInExpo;
	    		cy: -${strokeW*5}; rx: ${strokeW*4}; ry: ${strokeW * 4};
	    	};

	    	.mainDropletFriend { 
	    		fill: ${globalStyles.primary}; 
	    		animation-name: mainDropletFriendAnimation;
	    		animation-duration: ${duration}s;
	    		animation-iteration-count:infinite;
	    		transition-timing-function: easeInExpo;
	    	};

	    	.droplet { 
	    		filter:url('#dropletFilter');
	    	};

    		@keyframes mainDropletAnimation {
	    		from { cy: -${strokeW*5}; rx: ${strokeW*4}; ry: ${strokeW * 4}; }
	    		to { cy: ${size + strokeW*5}; rx: ${strokeW*4}; ry: ${strokeW * 4}; }
	    	}

	    `}
	    </style>
		</div>
  );
};

export default Logo;
