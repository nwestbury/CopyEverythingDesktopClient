import Ember from 'ember';
import DbInitInitializer from 'Copy Everything/initializers/db-init';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | db init', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  DbInitInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
