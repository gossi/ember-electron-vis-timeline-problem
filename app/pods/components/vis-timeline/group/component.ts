import { tagName } from '@ember-decorators/component';
import VisCoreChild from 'ember-electron-vis-timeline-problem/pods/components/vis-core/child/component';
import VisTimeline from 'ember-electron-vis-timeline-problempods/components/vis-timeline/component';
import vis from 'vis';

@tagName('')
export default class VisTimelineGroup extends VisCoreChild {
	container!: VisTimeline;

	className?: string;
	content: string = '';
	id!: vis.IdType;
	// options?: DataGroupOptions;
	style?: string;
	subgroupOrder?: string;
	title?: string;
	// nestedGroups?: number[];
	order?: number;

	constructor() {
		super(...arguments);
		const observers = ['className', 'content', 'style', 'subgroupOrder', 'title', 'order'];
		for (let prop of observers) {
			//@ts-ignore
			this.addObserver(prop, () => {
				// @ts-ignore
				this.container.groups.update({
					id: this.id,
					[prop]: this.get(prop)
				});
			});
		}
	}
}
