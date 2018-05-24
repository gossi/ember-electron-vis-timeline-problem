import Controller from "@ember/controller";
import vis from 'vis';

export default class ApplicationController extends Controller {

	timelineOptions: vis.TimelineOptions = {
		min: 0,
		start: 0,
		max: 5000,
		end: 5000,
		editable: {
			updateTime: true
		},
		selectable: true,
		snap: null,
		onMove: (item, callback) => {
			callback(item);
		},
		onMoving: (item, callback) => {
			callback(item);
		}
	};
}
