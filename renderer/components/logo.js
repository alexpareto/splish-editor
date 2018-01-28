import React from 'react';
import * as globalStyles from '../globalStyles';

const Logo = props => {
  const size = props.size;
  const strokeW = props.size / 50;
  const duration = 1.4;
  const contrast = size < 80 ? 6 : 7;

  return (
    <div className="container">
      <svg
        className="svg"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        version="1.2"
      >
        <circle
          x={strokeW}
          y={strokeW}
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeW * 3) / 2}
          fill={globalStyles.background}
          className="boundingCircle"
          strokeWidth={strokeW}
        />
        <g className="droplet">
          <circle
            x={strokeW}
            y={strokeW}
            cx={size / 2}
            cy={size / 2}
            r={(size - strokeW * 3) / 2}
            fill="none"
            strokeWidth={strokeW}
            stroke={globalStyles.accent}
          />
          <ellipse className="bulge" cx={size / 2} />
          <ellipse className="mainDroplet" cx={size / 2} />;
          <ellipse className="mainDropletFriend" cx={size / 2} />;
          <ellipse className="mainDropletFriend2" cx={size / 2} />;
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
			      	  0 0 0 46 -${contrast}`}
              result="filter"
            />
            <linearGradient id="MyGradient">
              <stop offset="5%" stopColor="green" />
              <stop offset="95%" stopColor="gold" />
            </linearGradient>
          </filter>
        </defs>
      </svg>

      <style jsx>
        {`
	    	.container {
    			background-color: ${globalStyles.background};
          box-shadow: ${globalStyles.heavierBoxShadow};
          border-radius: 50%;
	    	};

	    	.svg {

	    	};

	    	.boundingCircle {
	    		stroke: ${globalStyles.background};
				};

	    	.bulge {
	    		fill: ${globalStyles.background};
	    		animation-name: bulgeAnimation;
	    		animation-duration: ${duration}s;
	    		animation-iteration-count:infinite;
	    	}

	    	@keyframes bulgeAnimation {
			    20% { cy: 0; ry: ${strokeW}; rx: ${strokeW}}
			    40% { cy: 0; ry: ${strokeW * 9}; rx: ${strokeW / 2}; }
			    80% { cy: 0; ry: 0; rx: 0; }
				};

	    	.mainDroplet {
	    		fill: ${globalStyles.accent};
	    		animation-name: mainDropletAnimation;
	    		animation-duration: ${duration}s;
	    		animation-iteration-count:infinite;
	    		animation-timing-function: ease-in-out;
	    	};

	    	.mainDropletFriend {
	    		fill: ${globalStyles.accent};
	    		animation-name: mainDropletFriendAnimation;
	    		animation-duration: ${duration * 1}s;
	    		animation-iteration-count:infinite;
	    		animation-timing-function: ease-in-out;
	    	};

	    	.mainDropletFriend2 {
	    		fill: ${globalStyles.accent};
	    		animation-name: mainDropletFriend2Animation;
	    		animation-duration: ${duration * 1}s;
	    		animation-iteration-count:infinite;
	    		animation-timing-function: ease-in-out;
	    	};

	    	.droplet {
	    		filter:url('#dropletFilter');
	    	};

	    	@keyframes mainDropletFriendAnimation {
	    		from {
	    			cy: -${strokeW * 5};
	    			rx: ${strokeW * 1.5};
	    			ry: ${strokeW * 1.5};
	    			fill: ${globalStyles.accent};
	    		}
	    		to {
	    			cy: ${size};
	    			rx: ${strokeW * 1};
	    			ry: ${strokeW * 1};
	    			fill: ${globalStyles.accent};
	    		}
	    	}

	    	@keyframes mainDropletFriend2Animation {
	    		from {
	    			cy: -${strokeW * 5};
	    			rx: ${strokeW * 1};
	    			ry: ${strokeW * 1};
	    		}
	    		to {
	    			cy: ${size + strokeW * 7};
	    			rx: ${strokeW * 1};
	    			ry: ${strokeW * 1};
	    		}
	    	}

    		@keyframes mainDropletAnimation {
	    		from {
	    			cy: -${strokeW * 5};
	    			rx: ${strokeW * 4};
	    			ry: ${strokeW * 4};
	    		}
	    		to {
	    			cy: ${size + strokeW * 15};
	    			rx: ${strokeW * 4};
	    			ry: ${strokeW * 4};
	    		}
	    	}

	    `}
      </style>
    </div>
  );
};

export default Logo;
