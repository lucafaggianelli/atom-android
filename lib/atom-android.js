'use babel';

import AtomAndroidView from './atom-android-view';
import { CompositeDisposable } from 'atom';

export default {

  atomAndroidView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomAndroidView = new AtomAndroidView(state.atomAndroidViewState);

    // Install dependencies
    require('atom-package-deps').install('atom-android')
      .then(function() {
        console.log('All dependencies installed, good to go')
      });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-android:build': () => this.build(),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.atomAndroidView.destroy();
  },

  serialize() {
    return {
      atomAndroidViewState: this.atomAndroidView.serialize()
    };
  },

  build() {
    if (atom.packages.isPackageActive('build') &&
        atom.packages.isPackageActive('build-gradle')) {
      projectDir = atom.project.rootDirectories[0].path;
      console.log('path', projectDir);
      builder = require(atom.packages.resolvePackagePath('build'));
      target = builder.targetManager.getTargets(projectDir)
            .find(t => t.name === "Gradle: assembleDebug");

      console.log('Target', target);
      if (target) {
        builder.targetManager.setActiveTarget(projectDir, target.name);

        editor = atom.workspace.getActiveTextEditor();
        atom.commands.dispatch(atom.views.getView(editor), 'build:trigger')
      }
    }
  },
};
