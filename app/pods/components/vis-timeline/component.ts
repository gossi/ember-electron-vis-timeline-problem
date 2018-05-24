import VisCoreChild from 'ember-electron-vis-timeline-problem/pods/components/vis-core/child/component';
import VisCoreContainer from 'ember-electron-vis-timeline-problem/pods/components/vis-core/container/component';
import VisTimelineGroup from 'ember-electron-vis-timeline-problem/pods/components/vis-timeline/group/component';
import VisTimelineItem from 'ember-electron-vis-timeline-problem/pods/components/vis-timeline/item/component';
import VisTimelineTime from 'ember-electron-vis-timeline-problem/pods/components/vis-timeline/time/component';
import vis from 'vis';
import { tagName } from '@ember-decorators/component';

export interface TimelineElement extends HTMLDivElement {

	rebuild(): void;

	getTimeline(): vis.Timeline;
}

@tagName('')
export default class VisTimeline extends VisCoreContainer {

	options: vis.TimelineOptions = this.options || {};

	items: vis.DataSet<vis.DataItem>;
	groups: vis.DataSet<vis.DataGroup>;

	timeline?: vis.Timeline;

	selection?: string | number | vis.IdType[];
	selected?: string | number | vis.IdType[];

	firstRun: boolean = true;

	constructor() {
		super(...arguments);

		this.items = new vis.DataSet();
		this.groups = new vis.DataSet();
	}

	didInsertElement() {
		super.didInsertElement();

		// setup
		this.timeline = this.setup();

		// add times
		for (let child of this.children) {
			if (child instanceof VisTimelineTime) {
				this.addTime(child);
			}
		}

		// public API
		// this.element.redraw = () => {
		// 	this.timeline.redraw();
		// };

		const element = document.querySelector(`#${this.elementId}`);

		element.rebuild = () => {
			if (this.timeline) {
				this.timeline.destroy();
			}
			this.timeline = this.setup();
		};

		element.getTimeline = () => {
			return this.timeline;
		}
	}

	setup(): vis.Timeline {
		const timeline = new vis.Timeline(
			document.querySelector(`#${this.elementId}`) as HTMLElement,
			this.items,
			this.groups,
			this.options
		);

		timeline.on('select', (props) => {
			this.handleSelect(props);
		});

		['changed', 'groupDragged', 'currentTimeTick'].forEach(name => {
			timeline.on(name, (props) => {
				this.trigger(name, props);
			});
		});
		const mappedEvents = {
			'itemout': 'itemOut',
			'itemover': 'itemOver',
			'rangechange': 'rangeChange',
			'rangechanged': 'rangeChanged',
			'timechange': 'timeChange',
			'timechanged': 'timeChanged',
			'contextmenu': 'onContextMenu',
			'mouseDown': 'onMouseDown',
			'mouseUp': 'onMouseUp',
			'moveMove': 'onMouseMove',
			'click': 'onClick',
			'doubleClick': 'onDoubleClick',
			'drop': 'onDrop'
		};

		for (const [key, value] of Object.entries(mappedEvents)) {
			timeline.on(key, (props) => {
				this.trigger(value, props);
			});
		}
		this.addObserver('selection', () => {
			this.handleIncomingSelection();
		});

		this.addObserver('options', () => {
			if (this.timeline) {
				this.timeline.setOptions(this.options);
			}
		});

		return timeline;
	}

	registerChild(child: VisCoreChild) {
		if (child instanceof VisTimelineItem) {
			this.addItem(child);
		} else if (child instanceof VisTimelineGroup) {
			this.addGroup(child);
		} else if (child instanceof VisTimelineTime) {
			this.addTime(child);
		}
	}

	addItem(item: VisTimelineItem) {
		this.items.add({
			id: item.id,
			start: item.start,
			end: item.end,
			group: item.group,
			content: item.content,
			style: item.style,
			type: item.type
		});
	}

	addGroup(group: VisTimelineGroup) {
		if (!group.order) {
			group.set('order', this.groups.length);
		}
		this.groups.add({
			id: group.id,
			content: group.content,
			style: group.style,
			order: group.order
		});
	}

	addTime(time: VisTimelineTime) {
		if (this.timeline) {
			this.timeline.addCustomTime(time.time, time.id);
			this.timeline.setCustomTimeTitle(time.title, time.id);
		}
	}

	unregisterChild(child: VisCoreChild) {
		if (child instanceof VisTimelineItem) {
			this.items.remove(child.id);
		} else if (child instanceof VisTimelineGroup) {
			this.groups.remove(child.id);
		} else if (child instanceof VisTimelineTime && this.timeline) {
			this.timeline.removeCustomTime(child.id);
		}
	}

	handleSelect(props: any) {
		this.trigger('selectionChanged', props.items, props.event);
	}

	handleIncomingSelection() {
		if (this.selection && this.selection !== this.selected && this.timeline) {
			this.timeline.setSelection(this.selection);
		}
	}
}
