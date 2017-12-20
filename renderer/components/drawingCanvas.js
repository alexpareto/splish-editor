import React from "react";
import * as globalStyles from "../globalStyles";

class DrawingCanvas extends React.Component {
	componentDidMount() {
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
	}

	render() {
		return (
			<div>
				<div id="tool-eraser"> Eraser </div>
				<div id="tool-pencil"> Pencil </div>
				<div className="literally core">
				</div>
				<style jsx>
						{` 
						`}
				</style>
			</div>
		);
	}
}

export default DrawingCanvas;
