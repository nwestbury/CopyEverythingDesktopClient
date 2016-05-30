export function initialize(application) {
  application.inject('index', 'main', 'service:db');
}

export default {
  name: 'db-init',
  initialize
};
