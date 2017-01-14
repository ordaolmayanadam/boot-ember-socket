import Ember from 'ember';

export default Ember.Component.extend({
  client: Ember.inject.service('socket-connection'),
  message: "",
  actions: {
    connect(){
      this.get('client').connect();
    },
    disconnect() {
      this.get('client').disconnect();
    },
    sendMessage(message) {
      this.get('client').sendMessage(message);
    }
  }
});
