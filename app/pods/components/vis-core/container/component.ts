import Component from '@ember/component';
import VisCoreChild from 'ember-electron-vis-timeline-problem/pods/components/vis-core/child/component';
import Evented from '@ember/object/evented';

export default class VisCoreContainer extends Component.extend(Evented) {
	children: VisCoreChild[] = [];

	constructor(properties?: object) {
		super(properties);
	}

	addChild(child: VisCoreChild) {
		this.children.pushObject(child);
		this.registerChild(child);
	}

	removeChild(child: VisCoreChild) {
		this.children.removeObject(child);
		this.unregisterChild(child);
	}

	registerChild(child: VisCoreChild) { }
	unregisterChild(child: VisCoreChild) { }

}
