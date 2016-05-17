'use babel';

import AtomAndroidView from './atom-android-view';
import { CompositeDisposable } from 'atom';

export default {

  atomAndroidView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomAndroidView = new AtomAndroidView(state.atomAndroidViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomAndroidView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-android:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomAndroidView.destroy();
  },

  serialize() {
    return {
      atomAndroidViewState: this.atomAndroidView.serialize()
    };
  },

  toggle() {
    console.log('AtomAndroid was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
