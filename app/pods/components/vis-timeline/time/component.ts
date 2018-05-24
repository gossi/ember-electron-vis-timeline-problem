import { tagName } from '@ember-decorators/component';
import VisCoreChild from 'ember-electron-vis-timeline-problem/pods/components/vis-core/child/component';
import VisTimeline from 'ember-electron-vis-timeline-problem/pods/components/vis-timeline/component';
import vis from 'vis';

@tagName('')
export default class VisTimelineTime extends VisCoreChild {
	container!: VisTimeline;

	id!: vis.IdType;
	time: vis.DateType = this.time || 0;
	title: string = this.title || '';

	constructor() {
		super(...arguments);

		this.addObserver('time', () => {
			if (this.container.timeline) {
				this.container.timeline.setCustomTime(this.time, this.id);
			}
		});

		this.addObserver('title', () => {
			if (this.container.timeline) {
				this.container.timeline.setCustomTimeTitle(this.title, this.id);
			}
		});
	}

}
