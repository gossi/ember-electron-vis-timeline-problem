import { tagName } from '@ember-decorators/component';
import VisCoreChild from 'ember-electron-vis-timeline-problem/pods/components/vis-core/child/component';
import VisTimeline from 'ember-electron-vis-timeline-problem/pods/components/vis-timeline/component';
import vis from 'vis';

@tagName('')
export default class VisTimelineItem extends VisCoreChild {
	container!: VisTimeline;

	className?: string;
	content: string = '';
	end?: vis.DateType;
	group?: any;
	id!: vis.IdType;
	start!: vis.DateType;
	style?: string;
	subgroup?: vis.SubgroupType;
	title?: string;
	type?: string;
	editable?: boolean;

	constructor() {
		super(...arguments);
		const observers = ['className', 'content', 'end', 'group', 'start', 'style', 'subgroup', 'title', 'type', 'editable'];
		for (let prop of observers) {
			//@ts-ignore
			this.addObserver(prop, () => {
				// @ts-ignore
				this.container.items.update({
					id: this.id,
					[prop]: this.get(prop)
				});
			});
		}
	}
}
