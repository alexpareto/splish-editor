import React from "react";
import * as globalStyles from "../globalStyles";

class DrawingCanvas extends React.Component {
	componentDidMount() {
		console.log("LC: ", LC);
		var lc = LC.init(document.getElementsByClassName("literally core")[0]);
		var tools = [
      {
        name: 'pencil',
        el: document.getElementById('tool-pencil'),
        tool: new LC.tools.Pencil(lc)
      },
      {
        name: 'eraser',
        el: document.getElementById('tool-eraser'),
        tool: new LC.tools.Eraser(lc)
      }
    ];

    var activateTool = function(t) {
        lc.setTool(t.tool);

        tools.forEach(function(t2) {
          if (t == t2) {
            t2.el.style.backgroundColor = 'yellow';
          } else {
            t2.el.style.backgroundColor = 'transparent';
          }
        });
    }

    tools.forEach(function(t) {
      t.el.style.cursor = "pointer";
      t.el.onclick = function(e) {
        e.preventDefault();
        activateTool(t);
      };
    });
    activateTool(tools[0]);
    console.log(lc);
	}

	render() {
		return (
			<div className="bounding">
				<div className="tools">
					<div id="tool-eraser"> Eraser </div>
					<div id="tool-pencil"> Pencil </div>
				</div>
				<div className="literally core">
				</div>
				<style jsx>
						{` 
							.literally.core {
								display: block;
								width: 100px !important;
								height: 100px !important;
								background-color: #A4A5AE;
							};

							.bounding {
								width: 100px;
								height: 100px;
							};
						 `}
					</style>
			</div>
		);
	}
}

export default DrawingCanvas;
