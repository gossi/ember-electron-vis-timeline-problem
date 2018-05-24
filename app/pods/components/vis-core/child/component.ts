import Component from '@ember/component';
import VisCoreContainer from 'ember-electron-vis-timeline-problem/pods/components/vis-core/container/component';

export default class VisCoreChild extends Component {
	container!: VisCoreContainer;

	constructor(properties?: object) {
		super(properties);

		this.container.addChild(this);
	}

	willDestroyElement() {
		super.willDestroyElement();

		this.container.removeChild(this);
	}
}
